import { useMemo } from 'react';
import type { LeadPayload } from '../../types/lead';
import { highlightJson } from '../../utils/jsonHighlight';

interface JsonPreviewProps {
  payload: LeadPayload;
  open: boolean;
  onToggle: () => void;
}

export function JsonPreview({ payload, open, onToggle }: JsonPreviewProps) {
  const highlightedPayload = useMemo(
    () => highlightJson(JSON.stringify(payload, null, 2)),
    [payload],
  );

  return (
    <section className="card json-section" id="jsonSec">
      <button
        className={`json-tog ${open ? 'exp' : ''}`}
        id="jsonTog"
        type="button"
        aria-expanded={open}
        aria-controls="jsonBd"
        onClick={onToggle}
      >
        <span>JSON Preview</span>
        <span className="chev" aria-hidden="true">
          ▾
        </span>
      </button>
      <div
        className={`json-bd ${open ? 'open' : ''}`}
        id="jsonBd"
        role="region"
        aria-label="JSON payload preview"
      >
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlightedPayload }} />
        </pre>
      </div>
    </section>
  );
}
