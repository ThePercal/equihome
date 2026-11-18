import { posix } from 'node:path';

// Las mismas páginas pueden servirse en / o en /equihome/dist/ con Live Server.
export function relativeSitePath(value, pagePath) {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const [, target, suffix] = value.match(/^([^?#]*)(.*)$/);
  const directory = pagePath.endsWith('/') ? pagePath : posix.dirname(pagePath);
  let relative = posix.relative(directory, target);
  if (!relative) relative = '.';
  if (target.endsWith('/')) relative += '/';
  return relative + suffix;
}

export function portableHtml(html, pagePath) {
  // Un 404 de hosting puede responder en cualquier URL: mantiene rutas de origen.
  if (pagePath.endsWith('/404.html')) return html;
  return html
    .replace(/\b(href|src)="([^"]*)"/g, (_, attr, value) => `${attr}="${relativeSitePath(value, pagePath)}"`)
    .replace(/\bsrcset="([^"]*)"/g, (_, value) => `srcset="${value.split(',').map(candidate => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      return [relativeSitePath(url, pagePath), ...descriptor].join(' ');
    }).join(', ')}"`);
}
