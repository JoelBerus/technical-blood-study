export function normalizePDFText(text: string): string {
  if (!text) return '';

  let normalized = text;

  normalized = normalized.replace(/x10\s*\n\s*(\d+)/g, 'x10^$1');

  normalized = normalized.replace(/x10([³²])\n\s*\//g, 'x10$1/');

  normalized = normalized.replace(/(\d+)\n\s*\//g, '$1/');

  normalized = normalized.replace(/\n\s*\//g, '/');

  normalized = normalized.replace(/(\d),(\d)/g, '$1.$2');

  normalized = normalized.replace(/ +/g, ' ');

  normalized = normalized.replace(/^\s+/gm, '');

  normalized = normalized.replace(/\s+$/gm, '');

  return normalized;
}

export function extractPageContent(text: string): string {
  const pages = text.split(/-- \d+ of \d+ --/);
  
  if (pages.length <= 1) {
    const pageMarkers = text.match(/-- \d+ of \d+ --/g);
    if (pageMarkers) {
      return text.replace(/-- \d+ of \d+ --\n*/g, '\n');
    }
    return text;
  }

  return pages
    .map(page => page.replace(/-- \d+ of \d+ --\n*/g, '').trim())
    .filter(page => page.length > 0)
    .join('\n\n');
}