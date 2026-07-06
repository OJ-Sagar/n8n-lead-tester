import type { RequestHistoryItem } from '../../types/lead';
import { SectionLabel } from '../ui/SectionLabel';

interface HistoryPanelProps {
  history: RequestHistoryItem[];
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  if (!history.length) {
    return null;
  }

  return (
    <section className="card hist-sec" id="histSec">
      <SectionLabel>Request History</SectionLabel>
      <div id="histList">
        {history.map((item, index) => (
          <div key={item.id} className={`hi ${index === 0 ? 'ani' : ''}`}>
            <span className={`hdot ${item.st}`} />
            <div className="hinfo">
              <span className="hlt">{item.leadType}</span>
              <span className={`hst ${item.st}`}>{item.sl}</span>
            </div>
            <span className="htm">
              {item.ts.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
