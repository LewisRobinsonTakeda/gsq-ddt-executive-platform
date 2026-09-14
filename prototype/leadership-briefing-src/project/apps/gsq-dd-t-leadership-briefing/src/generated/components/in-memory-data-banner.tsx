import { useState } from 'react';

interface InMemoryDataBannerProps {
  show: boolean;
  message: string;
  className?: string;
}

export function InMemoryDataBanner({ show, message, className }: InMemoryDataBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (!show || dismissed) return null;
  const defaultColors = "rounded-md border border-amber-200 bg-amber-50 text-amber-800";
  return (
    <div className={`flex items-center justify-between gap-2 px-4 py-2 text-sm ${className ?? defaultColors}`}>
      <span>{message}</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-2 shrink-0 opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}