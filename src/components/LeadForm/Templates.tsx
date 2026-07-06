import { useState, type MouseEvent } from 'react';
import { templateButtons } from '../../data/templates';
import type { TemplateKey } from '../../types/lead';
import { SectionLabel } from '../ui/SectionLabel';

interface RippleState {
  id: string;
  x: number;
  y: number;
}

interface TemplatesProps {
  onSelect: (template: TemplateKey) => void;
}

export function Templates({ onSelect }: TemplatesProps) {
  const [ripples, setRipples] = useState<Partial<Record<TemplateKey, RippleState>>>({});

  const handleClick = (event: MouseEvent<HTMLButtonElement>, key: TemplateKey) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple: RippleState = {
      id: `${Date.now()}-${Math.random()}`,
      x: event.clientX - rect.left - 10,
      y: event.clientY - rect.top - 10,
    };

    setRipples((current) => ({ ...current, [key]: ripple }));
    window.setTimeout(() => {
      setRipples((current) => ({ ...current, [key]: undefined }));
    }, 520);

    onSelect(key);
  };

  return (
    <section className="templates">
      <SectionLabel>Quick Fill Templates</SectionLabel>
      <div className="tpl-grid" id="tplGrid">
        {templateButtons.map((template) => (
          <button
            key={template.key}
            className="tpl-btn"
            data-t={template.key}
            type="button"
            onClick={(event) => handleClick(event, template.key)}
          >
            {template.label}
            {ripples[template.key] ? (
              <span
                className="rp"
                style={{ left: ripples[template.key]?.x, top: ripples[template.key]?.y }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
