import type { FieldKey, LeadFormValues } from '../../types/lead';
import { SectionLabel } from '../ui/SectionLabel';

interface FieldMeta {
  error?: string;
  invalid?: boolean;
}

type FieldMetaMap = Partial<Record<FieldKey, FieldMeta>>;

interface LeadDataFormProps {
  values: LeadFormValues;
  meta: FieldMetaMap;
  onChange: (field: FieldKey, value: string) => void;
}

const inputClass = (meta?: FieldMeta): string | undefined => (meta?.invalid ? 'fw' : undefined);

export function LeadDataForm({ values, meta, onChange }: LeadDataFormProps) {
  return (
    <section className="card form-section">
      <SectionLabel>Lead Data</SectionLabel>
      <div className="form-grid">
        <div className="fg">
          <label htmlFor="fn">
            First Name <span className="rq" aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="fn"
            placeholder="John"
            autoComplete="off"
            value={values.fn}
            onChange={(event) => onChange('fn', event.target.value)}
          />
          <span className="fh">Letters, hyphens, and apostrophes only</span>
          <span className={`fe ${meta.fn?.error ? 'vis' : ''}`} id="fnE" role="alert">
            {meta.fn?.error}
          </span>
        </div>

        <div className="fg">
          <label htmlFor="ln">Last Name</label>
          <input
            type="text"
            id="ln"
            placeholder="Smith"
            autoComplete="off"
            value={values.ln}
            onChange={(event) => onChange('ln', event.target.value)}
          />
          <span className="fh">Letters, hyphens, and apostrophes only</span>
          <span className={`fe ${meta.ln?.error ? 'vis' : ''}`} id="lnE" role="alert">
            {meta.ln?.error}
          </span>
        </div>

        <div className="fg">
          <label htmlFor="em">
            Email <span className="rq" aria-label="required">*</span>
          </label>
          <input
            className={inputClass(meta.em)}
            type="email"
            id="em"
            placeholder="john@company.com"
            autoComplete="off"
            spellCheck={false}
            value={values.em}
            onChange={(event) => onChange('em', event.target.value)}
          />
          <span className={`fe ${meta.em?.error ? 'vis' : ''}`} id="emE" role="alert">
            {meta.em?.error}
          </span>
        </div>

        <div className="fg">
          <label htmlFor="ph">
            Phone <span className="rq" aria-label="required">*</span>
          </label>
          <input
            type="tel"
            id="ph"
            placeholder="+1 (555) 123-4567"
            autoComplete="off"
            value={values.ph}
            onChange={(event) => onChange('ph', event.target.value)}
          />
          <span className="fh">Digits, spaces, dashes, +, parentheses</span>
          <span className={`fe ${meta.ph?.error ? 'vis' : ''}`} id="phE" role="alert">
            {meta.ph?.error}
          </span>
        </div>

        <div className="fg">
          <label htmlFor="co">Company</label>
          <input
            type="text"
            id="co"
            placeholder="Acme Corp"
            autoComplete="off"
            value={values.co}
            onChange={(event) => onChange('co', event.target.value)}
          />
        </div>

        <div className="fg">
          <label htmlFor="bu">Budget</label>
          <input
            type="text"
            id="bu"
            placeholder="1500"
            autoComplete="off"
            inputMode="decimal"
            value={values.bu}
            onChange={(event) => onChange('bu', event.target.value)}
          />
        </div>

        <div className="fg">
          <label htmlFor="si">
            Service Interest <span className="rq" aria-label="required">*</span>
          </label>
          <select
            id="si"
            value={values.si}
            onChange={(event) => onChange('si', event.target.value)}
          >
            <option value="">Select a service...</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="SEO & Marketing">SEO & Marketing</option>
            <option value="Consulting">Consulting</option>
            <option value="Custom Integration">Custom Integration</option>
            <option value="help">help</option>
          </select>
        </div>

        <div className="fg">
          <label htmlFor="sr">Source</label>
          <input
            type="text"
            id="sr"
            placeholder="Google Ads"
            autoComplete="off"
            value={values.sr}
            onChange={(event) => onChange('sr', event.target.value)}
          />
        </div>

        <div className="fg fw">
          <label htmlFor="ms">Message</label>
          <textarea
            id="ms"
            placeholder="Tell us about your project..."
            rows={3}
            value={values.ms}
            onChange={(event) => onChange('ms', event.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
