interface SectionLabelProps {
  children: string;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return <div className="section-label">{children}</div>;
}
