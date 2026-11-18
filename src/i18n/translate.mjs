import english from './en.mjs';

export function translateText(value, missing) {
  const text = value.trim();
  if (!text) return value;
  let translation = english[text];
  if (translation === undefined) {
    if (/[a-zA-ZÀ-ÿ]/.test(text) && !/^\+?[\d\s.,–−+€]+(?:m²)?$/.test(text)) missing?.add(text);
    translation = text;
  }
  // Currency stays in EUR; only its presentation changes.
  translation = translation.replace(/([\d.]+)[\s\u00a0]*€/g, (_, amount) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(amount.replaceAll('.', ''))));
  return value.slice(0, value.indexOf(text)) + translation + value.slice(value.indexOf(text) + text.length);
}

export function translateHtml(html, missing) {
  return html.split(/(<[^>]+>)/g).map(part => {
    if (!part.startsWith('<')) return translateText(part, missing);
    return part.replace(/\b(alt|aria-label|placeholder|title)="([^"]*)"/g, (_, key, value) => `${key}="${translateText(value, missing).replaceAll('"', '&quot;')}"`)
      .replace(/(<meta\b[^>]*\bcontent=")([^"]*)(")/g, (_, start, value, end) => {
        if (!/\b(?:name|property)="(?:description|og:title|og:description)"/.test(part)) return start + value + end;
        return start + translateText(value, missing).replaceAll('"', '&quot;') + end;
      });
  }).join('');
}

export function translateCatalog(catalog) {
  const localize = value => typeof value === 'string' ? (english[value] ?? value) : Array.isArray(value) ? value.map(localize) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)])) : value;
  return { ...localize(catalog), locale: 'en' };
}
