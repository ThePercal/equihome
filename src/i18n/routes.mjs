export const routes = {
  '/': '/en/',
  '/viviendas/': '/en/homes/',
  '/viviendas/equi-60/': '/en/homes/equi-60/',
  '/configurador/': '/en/configurator/',
  '/calculadora/': '/en/calculator/',
  '/sostenibilidad/': '/en/sustainability/',
  '/proceso/': '/en/process/',
  '/nosotros/': '/en/about/',
  '/contacto/': '/en/contact/',
  '/aviso-legal/': '/en/legal-notice/',
  '/privacidad/': '/en/privacy/',
  '/cookies/': '/en/cookies/',
  '/404.html': '/en/404.html'
};

export function localizedPath(path, language) {
  if (language !== 'en') return path;
  const [, pathname, suffix] = path.match(/^([^?#]*)(.*)$/);
  const absolute = pathname.startsWith('/') ? pathname : '/' + pathname;
  const translated = routes[absolute];
  return translated ? (pathname.startsWith('/') ? translated : translated.slice(1)) + suffix : path;
}
