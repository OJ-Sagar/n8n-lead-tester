import type { RefObject } from 'react';

interface WebhookEndpointProps {
  value: string;
  hasErrorPulse: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
}

export function WebhookEndpoint({
  value,
  hasErrorPulse,
  inputRef,
  onChange,
}: WebhookEndpointProps) {
  return (
    <section className="card url-section">
      <label htmlFor="wurl">Webhook Endpoint</label>
      <div className="url-wrap">
        <input
          ref={inputRef}
          type="url"
          id="wurl"
          placeholder="https://your-n8n-instance.com/webhook/lead"
          autoComplete="off"
          spellCheck={false}
          aria-label="Webhook URL"
          className={hasErrorPulse ? 'url-err' : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="url-icon" aria-hidden="true">
          ⬢
        </span>
      </div>
    </section>
  );
}
