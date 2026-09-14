import { useEffect, useRef, useState, type FormEvent } from 'react';
import { getClient } from '@microsoft/power-apps/data';
import { AlertTriangle, ArrowRight, Flame, MessagesSquare, Radio, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dataSourcesInfo } from '../../.power/appschemas/dataSourcesInfo';

type Context = { siteCode: string; siteName: string; scope: string; audience: string };
type CopilotResponse = {
  lastResponse?: string;
  LastResponse?: string;
  responses?: unknown[];
  conversationId?: string;
  ConversationId?: string;
  conversationID?: string;
};
type CopilotParameters = { Copilot: string; body: { message: string; notificationUrl: string }; 'x-ms-conversation-id'?: string };
type PluginMessage = { messageType?: string; isPluginCall?: boolean; callbackId?: string; antiCSRFToken?: string; status?: number; args?: unknown };

const integrationNeeded = 'Integration needed';
const copilotSchemaName = 'new_gsqDdtExecPlatformStd';
const copilotClient = getClient(dataSourcesInfo);
type Turn = { role: 'user' | 'assistant'; text: string };

function forgetSavedChats(): void {
  try {
    for (const key of Object.keys(localStorage).filter((item: string) => item.startsWith('gsq-ep-ask-copilot'))) {
      localStorage.removeItem(key);
    }
  } catch {
    return;
  }
}

function cleanBriefing(text: string): string {
  return text
    .replace(/\[(?:cite)?[\d:]+[^\]]*\]/gi, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/[—-]\s*Executive Summary/gi, '')
    .replace(/^[^\n]*Executive Summary[^\n]*\n+/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function briefingPrompt(siteName: string, scope: string, audience: string, userText: string): string {
  return `Site=${siteName} Scope=${scope} Audience=${audience} Voice=60-second VP briefing. Answer in exactly five labeled beats: Context. Bottom line. Business impact. Risk and mitigation. Clear ask. Spoken professional prose. No markdown, bullets, or citation marks. ${userText}`;
}

function replyFrom(data: CopilotResponse | undefined): string | undefined {
  if (!data) return undefined;
  const firstResponse = data.responses?.find((item: unknown): item is string => typeof item === 'string');
  return data.lastResponse ?? data.LastResponse ?? firstResponse;
}

function pluginCall(port: MessagePort, token: string, service: string, action: string, actionArgs: unknown[], callbackId: string): Promise<{ status?: number; args?: unknown }> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(integrationNeeded)), 25000);
    const onMessage = (event: MessageEvent<PluginMessage>) => {
      const message = event.data;
      if (!message || !message.isPluginCall || message.callbackId !== callbackId) return;
      window.clearTimeout(timer);
      port.removeEventListener('message', onMessage);
      resolve({ status: message.status, args: message.args });
    };
    port.addEventListener('message', onMessage);
    port.postMessage({ isPluginCall: true, callbackId, service, action, actionArgs, antiCSRFToken: token });
  });
}

async function openHostChannel(): Promise<{ port: MessagePort; token: string }> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => reject(new Error(integrationNeeded)), 4000);
    channel.port1.onmessage = (event: MessageEvent<PluginMessage>) => {
      const message = event.data;
      if (message?.messageType !== 'initCommunication' || !message.antiCSRFToken) return;
      window.clearTimeout(timer);
      resolve({ port: channel.port1, token: message.antiCSRFToken });
    };
    window.parent.postMessage({ messageType: 'initCommunicationWithPort', instanceId: `mcs-${Date.now()}` }, '*', [channel.port2]);
  });
}

async function executeCopilotViaHost(parameters: CopilotParameters): Promise<CopilotResponse> {
  const { port, token } = await openHostChannel();
  const connections = await pluginCall(port, token, 'AppPowerAppsClientPlugin', 'loadAppConnectionsAsync_v2', [], `mcs-conns-${Date.now()}`);
  const connectionMap = Array.isArray(connections.args) ? connections.args[0] as Record<string, { apiId?: string; runtimeUrl?: string; connectionName?: string }> : undefined;
  const mcs = connectionMap?.microsoftcopilotstudio;
  if (!mcs?.runtimeUrl || !mcs.connectionName || !mcs.apiId) throw new Error(integrationNeeded);
  const tokenResult = await pluginCall(port, token, 'AppIdentityServicePlugin', 'getAppAccessTokenAsync', [mcs.apiId], `mcs-tok-${Date.now()}`);
  const access = Array.isArray(tokenResult.args) ? tokenResult.args[0] : undefined;
  if (typeof access !== 'string' || !access) throw new Error(integrationNeeded);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-ms-protocol-semantics': 'cdp',
    ServiceNamespace: 'microsoftcopilotstudio',
    Authorization: `paauth ${access}`,
  };
  if (parameters['x-ms-conversation-id']) headers['x-ms-conversation-id'] = parameters['x-ms-conversation-id'];
  const url = `${mcs.runtimeUrl}${mcs.connectionName}/powervirtualagents/dataverse-backed/authenticated/bots/${encodeURIComponent(parameters.Copilot)}/proactivecopilot/executeAsyncV2`;
  const http = await pluginCall(port, token, 'AppHttpClientPlugin', 'sendHttpAsync', [{
    url,
    method: 'POST',
    requestSource: 'PublishedApp',
    allowSessionStorage: true,
    returnDirectResponse: true,
    headers,
  }, JSON.stringify(parameters.body), 'arraybuffer'], `mcs-http-${Date.now()}`);
  const payload = Array.isArray(http.args) ? http.args[0] : undefined;
  const meta = Array.isArray(payload) ? payload[0] as { status?: number } : undefined;
  const body = Array.isArray(payload) ? payload[1] : undefined;
  if (meta?.status !== 200 || !body) throw new Error(integrationNeeded);
  const text = body instanceof ArrayBuffer ? new TextDecoder().decode(body) : typeof body === 'string' ? body : '';
  const data = JSON.parse(text) as CopilotResponse;
  const reply = replyFrom(data);
  if (!reply) throw new Error(integrationNeeded);
  return { ...data, lastResponse: reply };
}

async function executeCopilot(message: string, conversationId?: string): Promise<CopilotResponse> {
  const parameters: CopilotParameters = {
    Copilot: copilotSchemaName,
    body: {
      message,
      notificationUrl: 'https://notificationurlplaceholder',
    },
    ...(conversationId ? { 'x-ms-conversation-id': conversationId } : {}),
  };
  const result = await copilotClient.executeAsync<CopilotParameters, CopilotResponse>({ connectorOperation: { tableName: 'microsoftcopilotstudio', operationName: 'ExecuteCopilotAsyncV2', parameters } });
  const reply = result.success ? replyFrom(result.data) : undefined;
  if (reply && result.data) return { ...result.data, lastResponse: reply };
  return executeCopilotViaHost(parameters);
}

export function Briefing({ siteCode, siteName, scope, audience }: Context) {
  const sections = [
    { title: 'Portfolio', body: `${siteName} (${siteCode}) · ${scope}`, icon: Radio },
    { title: 'Attention', body: integrationNeeded, icon: AlertTriangle },
    { title: 'Priority', body: 'TO MES Elaprase DS · DDTTO-12 · SPOT 1024096', icon: Flame },
    { title: 'Context', body: `${audience} · Jira, SPOT and EDB status: ${integrationNeeded}`, icon: MessagesSquare },
    { title: 'Action', body: integrationNeeded, icon: ArrowRight },
  ];
  return <div className="space-y-3"><div className="rounded bg-primary p-4 text-primary-foreground"><b>Exception-first walk-in</b><p className="mt-1 text-sm">Golden thread: TO MES Elaprase DS · DDTTO-12 · SPOT 1024096</p></div><div className="grid gap-3 lg:grid-cols-5">{sections.map(({ title, body, icon: Icon }: { title: string; body: string; icon: typeof Radio }) => <Card key={title}><CardHeader className="pb-2"><Icon className="size-5" /><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent><p className="text-sm">{body}</p></CardContent></Card>)}</div></div>;
}

type AgentSession = { turns: Turn[]; conversationId?: string; sending: boolean; text: string; open: boolean };
const agentSession: AgentSession = { turns: [], sending: false, text: '', open: false };
const agentListeners = new Set<() => void>();
function emitAgent(): void {
  agentListeners.forEach((listener: () => void) => listener());
}
function useAgentSession(): AgentSession {
  const [, setTick] = useState(0);
  useEffect(() => {
    const refresh = () => setTick((value: number) => value + 1);
    agentListeners.add(refresh);
    return () => { agentListeners.delete(refresh); };
  }, []);
  return agentSession;
}

function AgentChat({ siteName, scope, audience, embedded, onClose }: Context & { embedded?: boolean; onClose?: () => void }) {
  const session = useAgentSession();
  const sendingRef = useRef(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const chips = [
    `Walk me into ${siteName}`,
    'What needs my attention',
    'What just went live',
    'Brief me on LIMS',
    'What do I need from Elaine',
  ];
  useEffect(() => {
    forgetSavedChats();
  }, []);
  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [session.turns, session.sending]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userText = session.text.trim();
    if (!userText || sendingRef.current) return;
    sendingRef.current = true;
    agentSession.sending = true;
    agentSession.turns = [...agentSession.turns, { role: 'user', text: userText }];
    agentSession.text = '';
    emitAgent();
    try {
      let result: CopilotResponse;
      try {
        result = await executeCopilot(briefingPrompt(siteName, scope, audience, userText), agentSession.conversationId);
      } catch {
        result = await executeCopilot(briefingPrompt(siteName, scope, audience, userText));
      }
      const nextId = result.conversationId ?? result.ConversationId ?? result.conversationID;
      if (nextId) agentSession.conversationId = nextId;
      agentSession.turns = [...agentSession.turns, { role: 'assistant', text: result.lastResponse || integrationNeeded }];
    } catch (_error: unknown) {
      agentSession.turns = [...agentSession.turns, { role: 'assistant', text: integrationNeeded }];
    } finally {
      sendingRef.current = false;
      agentSession.sending = false;
      emitAgent();
    }
  };
  return (
    <div className={embedded ? 'flex h-[70vh] min-h-[32rem] w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-background shadow-sm' : 'flex h-[34rem] w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-background shadow-xl'} style={embedded ? undefined : { width: 'min(26rem, calc(100vw - 1.5rem))' }}>
      <div className="flex min-w-0 items-center justify-between gap-3 border-b bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15"><Sparkles className="size-4" /></span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Executive advisor</p>
            <p className="flex min-w-0 items-center gap-1.5 text-xs opacity-90"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: '#2E8B57' }} /><span className="truncate">Live · {siteName}</span></p>
          </div>
        </div>
        {onClose && <Button type="button" variant="ghost" size="icon" className="shrink-0 text-primary-foreground hover:bg-primary-foreground/10" onClick={onClose} aria-label="Close live advisor"><X className="size-4" /></Button>}
      </div>
      <div ref={transcriptRef} aria-label="Live advisor conversation" className="min-h-0 min-w-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto bg-muted/30 p-3">
        {session.turns.length === 0 && !session.sending && (
          <div className="min-w-0 space-y-3">
            <div className="max-w-full min-w-0 break-words rounded-2xl rounded-tl-sm border bg-background px-3 py-3 text-sm leading-6 shadow-sm" style={{ overflowWrap: 'anywhere' }}>I am live for this visit. Ask as you would at a walk-in, and I will brief you in 60 seconds: context, bottom line, business impact, risk and mitigation, then a clear ask.</div>
            <div className="flex min-w-0 flex-wrap gap-2">{chips.map((label: string) => <Button key={label} type="button" variant="outline" size="sm" className="h-auto max-w-full whitespace-normal break-words text-left text-xs" onClick={() => { agentSession.text = label; emitAgent(); }}>{label}</Button>)}</div>
          </div>
        )}
        {session.turns.map((turn: Turn, index: number) => (
          <div key={`${turn.role}-${index}`} className={turn.role === 'user' ? 'flex min-w-0 justify-end pl-6' : 'min-w-0 pr-6'}>
            <div className={turn.role === 'user' ? 'max-w-full min-w-0 break-words rounded-2xl rounded-tr-sm bg-primary px-3 py-3 text-sm leading-6 text-primary-foreground' : 'max-w-full min-w-0 whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border bg-background px-3 py-3 text-sm leading-6 shadow-sm'} style={{ overflowWrap: 'anywhere' }}>{turn.role === 'assistant' ? cleanBriefing(turn.text) : turn.text}</div>
          </div>
        ))}
        {session.sending && <div className="max-w-full min-w-0 pr-6"><div className="rounded-2xl rounded-tl-sm border bg-background px-3 py-3 text-sm text-muted-foreground">Advisor is writing…</div></div>}
      </div>
      <form className="flex min-w-0 gap-2 border-t bg-background p-3" onSubmit={submit}>
        <Input className="min-w-0 flex-1" value={session.text} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { agentSession.text = event.target.value; emitAgent(); }} placeholder="Type a message" aria-label="Ask the live advisor" />
        <Button type="submit" className="shrink-0" disabled={session.sending || !session.text.trim()}>Send</Button>
      </form>
    </div>
  );
}

export function AskCopilot({ siteName, scope, audience, siteCode }: Context) {
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><Sparkles className="size-5 shrink-0" />Live advisor</h2>
          <p className="text-sm leading-6 text-muted-foreground">A live chat agent for this visit. Same 60-second vice president briefing, in a customer-service style conversation.</p>
        </div>
        <Badge variant="secondary" className="shrink-0">Live</Badge>
      </div>
      <AgentChat siteCode={siteCode} siteName={siteName} scope={scope} audience={audience} embedded />
    </div>
  );
}

export function LiveAgent({ siteName, scope, audience, siteCode, hidden }: Context & { hidden?: boolean }) {
  const session = useAgentSession();
  if (hidden) return null;
  if (!session.open) {
    return (
      <button type="button" className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg" onClick={() => { agentSession.open = true; emitAgent(); }} aria-label="Open live advisor">
        <span className="relative flex size-8 items-center justify-center rounded-full bg-primary-foreground/15"><Sparkles className="size-4" /><span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full" style={{ backgroundColor: '#2E8B57' }} /></span>
        <span className="text-sm font-semibold">Live advisor</span>
      </button>
    );
  }
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AgentChat siteCode={siteCode} siteName={siteName} scope={scope} audience={audience} onClose={() => { agentSession.open = false; emitAgent(); }} />
    </div>
  );
}
