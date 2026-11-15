import test from 'node:test';
import assert from 'node:assert/strict';
import { relativeSitePath, portableHtml } from '../scripts/portable-paths.mjs';

test('Recursos y navegación permanecen en la subcarpeta donde se sirve la web', () => {
  for (const mount of ['/', '/equihome/dist/']) {
    for (const page of ['/', '/calculadora/', '/viviendas/equi-60/']) {
      for (const target of ['/styles.css', '/images/exterior-640.webp', '/app.js', '/', '/viviendas/', '/contacto/?model=equi-60', '/viviendas/#precios']) {
        const resolved = new URL(relativeSitePath(target, page), `https://example.test${mount}${page.slice(1)}`);
        assert.equal(resolved.href, `https://example.test${mount}${target.slice(1)}`);
      }
    }
  }
});

test('Las imágenes responsive se adaptan sin cambiar metadatos externos ni anclas', () => {
  const html = '<a href="#contenido">Saltar</a><link href="https://example.test/viviendas/"><img src="/images/a.webp" srcset="/images/a.webp 640w, /images/b.webp 1280w">';
  const result = portableHtml(html, '/viviendas/equi-60/');
  assert.ok(result.includes('href="#contenido"'));
  assert.ok(result.includes('href="https://example.test/viviendas/"'));
  assert.ok(result.includes('src="../../images/a.webp"'));
  assert.ok(result.includes('srcset="../../images/a.webp 640w, ../../images/b.webp 1280w"'));
});

test('El 404 servido desde URLs inexistentes conserva recursos desde la raíz', () => {
  const html='<link href="/styles.css"><a href="/">Inicio</a>';
  assert.equal(portableHtml(html, '/404.html'),html);
});
