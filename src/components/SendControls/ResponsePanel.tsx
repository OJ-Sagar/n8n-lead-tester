import type { ResponseState } from '../../types/lead';
import { SectionLabel } from '../ui/SectionLabel';

interface ResponsePanelProps {
  response: ResponseState | null;
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  if (!response) {
    return null;
  }

  return (
    <section className="card resp-sec" id="respSec">
      <SectionLabel>Response Body</SectionLabel>
      <pre>
        <code id="respBody">{response.body}</code>
      </pre>
    </section>
  );
}
