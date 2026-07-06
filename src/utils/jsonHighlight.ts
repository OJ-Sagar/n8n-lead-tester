const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const highlightJson = (json: unknown): string => {
  const source = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  const escaped = escapeHtml(source);

  return escaped.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        return /:$/.test(match)
          ? `<span class="jk">${match.slice(0, -1)}</span>:`
          : `<span class="js">${match}</span>`;
      }

      if (/null/.test(match)) {
        return `<span class="jn" style="color:var(--txt3)">${match}</span>`;
      }

      return `<span class="jn">${match}</span>`;
    },
  );
};
