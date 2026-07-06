import type { StatusState } from '../../types/lead';

interface SendControlsProps {
  sending: boolean;
  status: StatusState | null;
  onSend: () => void;
  onClear: () => void;
}

export function SendControls({ sending, status, onSend, onClear }: SendControlsProps) {
  return (
    <section className="send-section">
      <div className="send-row">
        <button className="send-btn" id="sendBtn" type="button" disabled={sending} onClick={onSend}>
          <span className="shm" />
          <span className="arrow" aria-hidden="true">
            →
          </span>
          Send to Webhook
        </button>
        <button className="clear-btn" id="clearBtn" type="button" onClick={onClear}>
          Clear Form
        </button>
      </div>
      <div className="shortcut">
        <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to send
      </div>
      {status ? (
        <div className="sbar" id="sbar" role="status" aria-live="polite">
          <span className={`sdot ${status.kind}`} id="sdot" />
          <span className="stxt" id="stxt">
            {status.text}
          </span>
        </div>
      ) : null}
    </section>
  );
}
