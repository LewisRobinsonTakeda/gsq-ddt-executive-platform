import { Component, useState } from 'react';
import type { ReactNode } from 'react';
import { queryClient } from '@/lib/query-client';

interface ErrorBoundaryProps {
  children: ReactNode;
  resetQueryCache?: boolean;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  isAutoReloading: boolean;
}

interface ParsedError {
  title: string;
  description: string;
  component?: string;
  file?: string;
  line?: number;
  suggestion: string;
}

const autoReloadAttempts = new Map<string, number>();
const AUTO_RELOAD_ERROR_MESSAGES: string[] = [];

// Parse error into user-friendly format
function parseError(error: Error, errorInfo?: React.ErrorInfo): ParsedError {
  const message = error.message || 'Unknown error';
  const stack = error.stack || '';
  const componentStack = errorInfo?.componentStack || '';

  const componentMatch = componentStack.match(/at (\w+)/);
  const component = componentMatch?.[1];

  const fileMatch =
    stack.match(/\((.+?):(\d+):(\d+)\)/) ||
    stack.match(/at\s+.+?\s+\((.+?):(\d+):(\d+)\)/) ||
    stack.match(/(.+?):(\d+):(\d+)/);

  const file = fileMatch?.[1]?.split('/').pop()?.split('?')[0];
  const line = fileMatch?.[2] ? parseInt(fileMatch[2], 10) : undefined;

  let title = 'Runtime error';
  let description = message;
  let suggestion = 'Copy the error details and ask AI to help resolve this issue.';

  if (message.includes('is not defined')) {
    const varMatch = message.match(/(\w+) is not defined/);
    title = 'Undefined reference';
    description = `"${varMatch?.[1] || 'A variable'}" is being used but hasn't been defined.`;
    suggestion = 'This usually means a missing import or variable declaration.';
  } else if (message.includes('is not a function')) {
    const fnMatch = message.match(/(\w+) is not a function/);
    title = 'Type error';
    description = `"${fnMatch?.[1] || 'Value'}" was called as a function but is not callable.`;
    suggestion = 'Check that the value is correctly imported and is actually a function.';
  } else if (message.includes('Cannot read properties of undefined') || message.includes('Cannot read property')) {
    const propMatch = message.match(/reading '(\w+)'/) || message.match(/property '(\w+)'/);
    title = 'Null reference error';
    description = `Cannot access "${propMatch?.[1] || 'property'}" because the object is undefined.`;
    suggestion = 'Add a null check or ensure the data is loaded before accessing it.';
  } else if (message.includes('Cannot read properties of null')) {
    title = 'Null reference error';
    description = 'Attempted to access a property on a null value.';
    suggestion = 'Add a null check or ensure the value exists before accessing it.';
  } else if (message.includes('Maximum update depth exceeded')) {
    title = 'Infinite loop detected';
    description = 'A component is updating in an infinite loop.';
    suggestion = 'Check useEffect dependencies or state updates that trigger re-renders.';
  } else if (message.includes('Invalid hook call')) {
    title = 'Invalid hook usage';
    description = 'A React hook was called outside of a function component.';
    suggestion = 'Hooks can only be called at the top level of function components.';
  } else if (message.includes('Objects are not valid as a React child')) {
    title = 'Invalid render value';
    description = 'An object was passed where React expected renderable content.';
    suggestion = 'Convert the object to a string or access its properties directly.';
  } else if (message.includes('Each child in a list should have a unique')) {
    title = 'Missing list keys';
    description = 'List items are missing unique key props.';
    suggestion = 'Add a unique "key" prop to each item in the list.';
  }

  return { title, description, component, file, line, suggestion };
}

function trimStackTrace(stack: string, maxLength = 3000): string {
  if (stack.length <= maxLength) return stack;

  return stack.slice(0, maxLength) + '\n    ... (truncated)';
}

// Icons
function AlertIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function CopyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function RefreshIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}


function ChevronIcon({ className = '', expanded = false }: { className?: string; expanded?: boolean }) {
  return (
    <svg
      className={`${className} transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// Copy button with feedback
function CopyButton({
  text,
  label,
  variant = 'secondary',
  icon,
}: {
  text: string;
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}) {
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!success) throw new Error('Copy failed');
      }
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium
    transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer
  `;

  const variantStyles = {
    primary: `
      bg-[#0078d4] text-white hover:bg-[#106ebe] active:bg-[#005a9e]
      focus:ring-[#0078d4]
      ${state === 'success' ? 'bg-[#107c10] hover:bg-[#107c10]' : ''}
      ${state === 'error' ? 'bg-[#d13438] hover:bg-[#d13438]' : ''}
    `,
    secondary: `
      bg-white text-[#323130] border border-[#8a8886] hover:bg-[#f3f2f1] active:bg-[#edebe9]
      focus:ring-[#0078d4]
      ${state === 'success' ? 'border-[#107c10] text-[#107c10]' : ''}
      ${state === 'error' ? 'border-[#d13438] text-[#d13438]' : ''}
    `,
  };

  return (
    <button type="button" onClick={handleCopy} className={`${baseStyles} ${variantStyles[variant]}`}>
      {state === 'success' ? (
        <>
          <CheckIcon className="w-4 h-4" />
          Copied
        </>
      ) : state === 'error' ? (
        'Copy failed'
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}

// Collapsible section
function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#e1dfdd] rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-[#faf9f8] hover:bg-[#f3f2f1] transition-colors text-left cursor-pointer"
      >
        <span className="text-sm font-medium text-[#323130]">{title}</span>
        <ChevronIcon className="w-4 h-4 text-[#605e5c]" expanded={isOpen} />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-white border-t border-[#e1dfdd]">{children}</div>
      )}
    </div>
  );
}

// Error display component
function ErrorDisplay({
  error,
  errorInfo,
  onReset,
}: {
  error: Error;
  errorInfo?: React.ErrorInfo;
  onReset: () => void;
}) {
  const parsed = parseError(error, errorInfo);

  const aiPrompt = `I encountered this error in my app and need help fixing it.

**Error:** ${parsed.title}
${parsed.component ? `**Component:** ${parsed.component}` : ''}
${parsed.file ? `**Location:** ${parsed.file}${parsed.line ? `:${parsed.line}` : ''}` : ''}

**Error message:**
${error.message}

**Stack trace:**
\`\`\`
${trimStackTrace(error.stack || 'No stack trace available')}
\`\`\`

Please explain what caused this error and provide a fix.`;

  return (
    <div role="alert" className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg border border-[#e1dfdd] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e1dfdd] bg-[#faf9f8]">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#fed9cc] flex items-center justify-center">
              <AlertIcon className="w-5 h-5 text-[#d83b01]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-[#323130]">{parsed.title}</h2>
              <p className="mt-1 text-sm text-[#605e5c]">{parsed.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          {/* Location info */}
          {(parsed.component || parsed.file) && (
            <div className="flex flex-wrap gap-2">
              {parsed.component && (
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#f3f2f1] text-xs font-medium text-[#323130]">
                  Component: {parsed.component}
                </span>
              )}
              {parsed.file && (
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#f3f2f1] text-xs font-medium text-[#323130] font-mono">
                  {parsed.file}
                  {parsed.line ? `:${parsed.line}` : ''}
                </span>
              )}
            </div>
          )}

          {/* Suggestion */}
          <div className="p-3 rounded-md bg-[#f0f6ff] border border-[#c7e0f4]">
            <p className="text-sm text-[#0078d4]">
              <span className="font-medium">Suggestion:</span> {parsed.suggestion}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <CopyButton
              text={aiPrompt}
              label="Copy for AI"
              variant="primary"
              icon={<CopyIcon className="w-4 h-4" />}
            />
            <CopyButton
              text={`${error.message}\n\n${error.stack || ''}`}
              label="Copy error"
              variant="secondary"
              icon={<CopyIcon className="w-4 h-4" />}
            />
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                bg-white text-[#323130] border border-[#8a8886] hover:bg-[#f3f2f1] active:bg-[#edebe9]
                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0078d4] cursor-pointer"
            >
              <RefreshIcon className="w-4 h-4" />
              Reload
            </button>
          </div>

          {/* Technical details */}
          <Collapsible title="Technical details">
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-[#605e5c] uppercase tracking-wide mb-1">
                  Error Message
                </div>
                <code className="block p-3 rounded bg-[#faf9f8] text-sm text-[#323130] font-mono break-all border border-[#e1dfdd]">
                  {error.message}
                </code>
              </div>
              {error.stack && (
                <div>
                  <div className="text-xs font-medium text-[#605e5c] uppercase tracking-wide mb-1">
                    Stack Trace
                  </div>
                  <pre className="p-3 rounded bg-[#faf9f8] text-xs text-[#605e5c] font-mono overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap break-all border border-[#e1dfdd]">
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <div className="text-xs font-medium text-[#605e5c] uppercase tracking-wide mb-1">
                    Component Stack
                  </div>
                  <pre className="p-3 rounded bg-[#faf9f8] text-xs text-[#605e5c] font-mono overflow-x-auto max-h-32 overflow-y-auto whitespace-pre-wrap border border-[#e1dfdd]">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
    isAutoReloading: false,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[error-boundary] caught error:', error, errorInfo);
    }

    // Auto-reload for specific error messages
    const shouldAutoReload = AUTO_RELOAD_ERROR_MESSAGES.some((message) =>
      error.message.includes(message)
    );

    if (shouldAutoReload) {
      const currentLocation = window.location.href;
      const attempts = autoReloadAttempts.get(currentLocation) || 0;

      if (attempts === 0) {
        autoReloadAttempts.set(currentLocation, 1);
        this.setState({ isAutoReloading: true });
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  }

  private handleReset = () => {
    const { resetQueryCache, onReset } = this.props;
    if (resetQueryCache) {
      try {
        queryClient.clear();
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn('[error-boundary] failed to clear query cache', e);
        }
      }
    }
    onReset?.();
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      isAutoReloading: false,
    });
    window.location.reload();
  };

  render() {
    if (this.state.isAutoReloading) {
      return null;
    }

    if (this.state.hasError && this.state.error) {
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
