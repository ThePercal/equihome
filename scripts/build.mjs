import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { portableHtml } from './portable-paths.mjs';
import { layout } from '../src/components/shared.mjs';
import { home } from '../src/pages/home.mjs';
import { catalogPage, modelPage } from '../src/pages/catalog.mjs';
import { toolPage } from '../src/pages/tools.mjs';
import { sustainability, processPage, about, contact, legalPage, notFound } from '../src/pages/content.mjs';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function build() {
  const catalog = JSON.parse(await readFile(resolve(root, 'src/data/catalog.json'), 'utf8'));
  const pages = [
    ['/', 'Tu casa. Tu forma de vivir.', 'Viviendas modulares accesibles, funcionales y sostenibles. Descubre Equi 60, configura tu hogar y prepara un presupuesto orientativo.', home(catalog)],
    ['/viviendas/', 'Equi 60 · Vivienda modular de 60 m²', 'Conoce Equi 60, nuestra propuesta de vivienda modular de 60 m². Distribuciones, materiales y precios orientativos explicados con transparencia.', catalogPage(catalog)],
    ...catalog.models.map(model => [`/viviendas/${model.id}/`, `${model.name} · Vivienda modular de ${model.area} m²`, model.description, modelPage(catalog,model)]),
    ['/configurador/', 'Configura tu Equi 60', 'Elige acabados, equipamiento y extras para el Equi 60. Consulta un desglose orientativo y prepara tu solicitud.', toolPage(catalog)],
    ['/calculadora/', 'Calculadora de presupuesto', 'Estima la vivienda y sus opciones. Distingue los importes orientativos de impuestos, transporte y costes de instalación pendientes.', toolPage(catalog,true)],
    ['/sostenibilidad/', 'Construir con conciencia', 'Nuestro enfoque sobre materiales, recursos, eficiencia y economía circular. Compromisos explicados sin cifras ni certificaciones no verificadas.', sustainability()],
    ['/proceso/', 'Cómo funciona · Proceso de compra', 'Conoce las siete etapas: selección, presupuesto, terreno, proyecto y licencias, fabricación, transporte e instalación.', processPage()],
    ['/nosotros/', 'Nuestra forma de pensar', 'Equihome: una propuesta de vivienda modular accesible, funcional y sostenible, con diseño pensado para la vida real.', about()],
    ['/contacto/', 'Hablemos de tu proyecto', 'Prepara tu consulta sobre una vivienda Equihome. Formulario validado con descarga local mientras el canal de envío está pendiente de activación.', contact(catalog)],
    ...['aviso-legal','privacidad','cookies'].map(kind=>[`/${kind}/`,{ 'aviso-legal':'Aviso legal',privacidad:'Privacidad',cookies:'Cookies'}[kind],'Información sobre el sitio Equihome y el estado de sus servicios.',legalPage(kind,catalog)]),
    ['/404.html','Página no encontrada','La página que buscas no existe. Explora las viviendas Equihome o vuelve al inicio.',notFound()]
  ];
  await rm(resolve(root,'dist'),{recursive:true,force:true});
  await mkdir(resolve(root,'dist'),{recursive:true});
  await cp(resolve(root,'public'),resolve(root,'dist'),{recursive:true});
  await mkdir(resolve(root,'dist/lib'),{recursive:true});
  await mkdir(resolve(root,'dist/data'),{recursive:true});
  await cp(resolve(root,'src/app.js'),resolve(root,'dist/app.js'));
  await cp(resolve(root,'src/interactions.js'),resolve(root,'dist/interactions.js'));
  await cp(resolve(root,'src/lib/selection.mjs'),resolve(root,'dist/lib/selection.mjs'));
  await cp(resolve(root,'src/lib/pricing.mjs'),resolve(root,'dist/lib/pricing.mjs'));
  await cp(resolve(root,'src/styles/main.css'),resolve(root,'dist/styles.css'));
  await cp(resolve(root,'src/data/catalog.json'),resolve(root,'dist/data/catalog.json'));
  for(const [path,title,description,body] of pages) {
    const file=resolve(root,'dist',path.slice(1),path.endsWith('/')?'index.html':'');
    await mkdir(dirname(file),{recursive:true});
    await writeFile(file,portableHtml(layout({title,description,path,body,catalog,noindex:path==='/404.html'}),path));
  }
  const origin=catalog.siteUrl?.replace(/\/$/,'');
  await writeFile(resolve(root,'dist/robots.txt'),`User-agent: *\nAllow: /\n${origin?`Sitemap: ${origin}/sitemap.xml\n`:''}`);
  await writeFile(resolve(root,'dist/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin?pages.filter(([path])=>path!=='/404.html').map(([path])=>`<url><loc>${origin}${path}</loc></url>`).join(''):''}</urlset>`);
  console.log(`Equihome: ${pages.length} páginas generadas en dist/.`);
  return pages;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) await build();
