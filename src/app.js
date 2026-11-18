import { estimate, euros as formatEuros } from './lib/pricing.mjs';
import { selectionParams, selectionFromParams } from './lib/selection.mjs';
import { initGallery, initPageInteractions } from './interactions.js';

import { language, locale, t, html } from './lib/i18n.mjs';
import { localizedPath } from './i18n/routes.mjs';
const euros = value => formatEuros(value, locale);

const siteBase = new URL('.', import.meta.url);
const siteUrl = path => new URL(localizedPath(path, language), siteBase).href;

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() { menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', t('Abrir menú')); navigation?.classList.remove('is-open'); }
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? t('Cerrar menú') : t('Abrir menú')); navigation.classList.toggle('is-open', open); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.querySelectorAll('[data-gallery]').forEach(gallery => initGallery(gallery, siteUrl));
initPageInteractions();

function download(filename, text) { const blob = new Blob([text], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function errorMessage(error) { return error instanceof Error ? t(error.message) : t('No se ha podido completar la operación. Inténtalo de nuevo.'); }
let catalogPromise;
function getCatalog() { return catalogPromise ??= fetch(siteUrl(language === 'en' ? 'data/catalog.en.json' : 'data/catalog.json')).then(response => { if (!response.ok) throw new Error(t('No se han podido cargar los precios. Recarga la página para volver a intentarlo.')); return response.json(); }); }
function selectionFrom(form) { const data = new FormData(form); return { model: data.get('model'), area: data.has('area') ? data.get('area') : undefined, finish: data.get('finish'), equipment: data.get('equipment'), extras: data.getAll('extras') }; }
function estimateText(result, catalog, context = '') {
  return `${t('EQUIHOME · ESTIMACIÓN ORIENTATIVA')}\n${new Date().toLocaleDateString(locale)}\n\n${result.model.name} · ${t('Superficie solicitada')}: ${result.area} m²\n${result.lines.map(line => `${line.name}: ${euros(line.value)}`).join('\n')}\n${t('Suplementos orientativos')}: ${euros(result.optionsTotal)}\n${t('Subtotal de vivienda y opciones')}: ${euros(result.subtotal)}${result.customArea?' '+t('(la superficie personalizada requiere estudio)'):''}\n${t('Total completo del proyecto: pendiente de presupuesto')}\n${t('IVA: pendiente de determinar')}\n${context}\n\n${t('CONCEPTOS PENDIENTES, NO INCLUIDOS EN EL SUBTOTAL')}\n${catalog.excluded.join('\n')}\n\n${t('Todos los importes son hipótesis comerciales pendientes de validación. No es una oferta contractual. Imágenes y distribuciones ilustrativas.')}`;
}
function requestText(data, configurationText) {
  return `${t('EQUIHOME · SOLICITUD PREPARADA, NO ENVIADA')}\n\n${t('Nombre')}: ${data.name}\n${t('Correo')}: ${data.email}\n${t('Teléfono')}: ${data.phone || t('No indicado')}\n${t('Modelo')}: ${data.model || t('Por definir')}\n${t('Presupuesto')}: ${data.budget || t('Por definir')}\n${t('Ubicación')}: ${data.location || t('Por definir')}\n\n${data.message}\n\n${t('Información de privacidad leída y aceptada.')}\n\n${configurationText}\n\n${t('Este archivo se ha generado en tu dispositivo. No se ha enviado a Equihome.')}`;
}
function updateLanguageLinks(params = new URLSearchParams(location.search)) {
  document.querySelectorAll('[data-language]').forEach(link => {
    const destination = new URL(link.href);
    destination.search = params.toString(); destination.hash = location.hash;
    link.href = destination.href;
  });
}
updateLanguageLinks();
addEventListener('hashchange', () => {
  document.querySelectorAll('[data-language]').forEach(link => { const url = new URL(link.href); url.hash = location.hash; link.href = url.href; });
});

async function initEstimator(root) {
  const output = root.querySelector('[data-estimate-output]');
  const form = root.querySelector('form');
  const quoteLink = root.querySelector('[data-request-quote]');
  const downloadButton = root.querySelector('[data-download-estimate]');
  const status = root.querySelector('[data-estimate-status]');
  const shareButton = root.querySelector('[data-share-estimate]');
  const mobilePrice = root.querySelector('[data-mobile-price]');
  let catalog, result, sharedUrl = '';
  let initialMessage = '';
  try { catalog = await getCatalog(); } catch (error) { output.textContent = errorMessage(error); downloadButton.disabled = true; shareButton.disabled = true; mobilePrice.textContent = t('No disponible'); return; }
  const queryModel = new URLSearchParams(location.search).get('model');
  if ([...form.elements.model.options].some(option => option.value === queryModel)) { form.elements.model.value = queryModel; if (form.elements.area) form.elements.area.value = catalog.models.find(m => m.id === queryModel).area; }
  try {
    const restored = selectionFromParams(catalog, new URLSearchParams(location.search));
    if (restored) {
      if (!form.elements.area && restored.area !== catalog.models.find(m => m.id === restored.model).area) throw new Error(t('Superficie incompatible.'));
      form.elements.model.value = restored.model;
      form.elements.finish.value = restored.finish;
      form.elements.equipment.value = restored.equipment;
      if (form.elements.area) form.elements.area.value = restored.area;
      form.querySelectorAll('[name="extras"]').forEach(input => { input.checked = restored.extras.includes(input.value); });
      initialMessage = t('Configuración del enlace recuperada.');
    }
  } catch { initialMessage = t('El enlace no contiene una configuración válida. Se muestra la selección inicial.'); }
  function update() {
    status.textContent = '';
    root.querySelector('.share-fallback').hidden = true;
    try {
      const selection = selectionFrom(form); result = estimate(catalog, selection);
      const finish = catalog.finishes.find(f=>f.id===selection.finish); const equipment = catalog.equipment.find(e=>e.id===selection.equipment);
      root.querySelector('[data-model-name]').textContent = result.model.name;
      root.querySelector('[data-selection-description]').textContent = `${result.area} m² · ${finish.name} · ${equipment.name}`;
      output.innerHTML = html(`<dl class="estimate-lines">${result.lines.map(line => `<div><dt>${line.name}</dt><dd>${euros(line.value)}</dd></div>`).join('')}<div class="options-total"><dt>Total suplementos</dt><dd>${euros(result.optionsTotal)}</dd></div></dl><div class="estimate-subtotal"><span>Subtotal orientativo de vivienda y opciones</span><strong>${euros(result.subtotal)}</strong>${result.customArea?'<p class="small">La superficie personalizada necesita un estudio. No se aplica un precio por metro cuadrado.</p>':''}</div><dl class="estimate-lines pending-lines"><div><dt>Transporte e instalación</dt><dd>Por determinar</dd></div><div><dt>IVA aplicable</dt><dd>Por determinar</dd></div><div><dt>Total del proyecto</dt><dd>Pendiente de presupuesto</dd></div></dl>`);
      const params = selectionParams(catalog, selection);
      updateLanguageLinks(params);
      sharedUrl = siteUrl((root.dataset.mode === 'calculator' ? 'calculadora/' : 'configurador/') + '?' + params);
      mobilePrice.textContent = euros(result.subtotal);
      shareButton.disabled = false;
      quoteLink.href = siteUrl('contacto/?' + params);
      quoteLink.removeAttribute('aria-disabled'); downloadButton.disabled = false;
    } catch (error) { result = null; output.textContent = errorMessage(error); quoteLink.setAttribute('aria-disabled','true'); downloadButton.disabled = true; shareButton.disabled = true; mobilePrice.textContent = t('Revisa los datos'); }
  }
  form.addEventListener('submit', event=>event.preventDefault());
  form.addEventListener('input', event=> { if (event.target.name === 'model' && form.elements.area) form.elements.area.value = catalog.models.find(m=>m.id===event.target.value).area; update(); });
  form.addEventListener('reset', () => setTimeout(update,0));
  quoteLink.addEventListener('click',event=>{if(!result) event.preventDefault();});
  downloadButton.addEventListener('click',()=>{if(result) { const context = form.elements.location ? `${t('Ubicación')}: ${form.elements.location.value || t('Por definir')}\n${t('Transporte')}: ${form.elements.transport.selectedOptions[0].textContent}` : ''; download(t('equihome-estimacion.txt'),estimateText(result,catalog,context)); status.textContent = t('Desglose descargado en tu dispositivo. No se ha enviado ninguna solicitud.'); }});
  shareButton.addEventListener('click', async () => {
    if (!result) return;
    const url = sharedUrl;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      status.textContent = t('Enlace copiado. Incluye las opciones de la vivienda, sin datos personales.');
    } catch {
      const fallback = root.querySelector('.share-fallback');
      const input = fallback.querySelector('input');
      fallback.hidden = false; input.value = url; input.focus(); input.select();
      status.textContent = t('Copia el enlace del campo para guardar o compartir esta configuración.');
    }
  });
  update();
  status.textContent = initialMessage;
}

function validateForm(form) {
  let valid = true;
  for (const field of [...form.elements]) {
    if (!['INPUT','TEXTAREA','SELECT'].includes(field.tagName)) continue;
    field.setCustomValidity('');
    if (field.name === 'name' && field.value.trim().length < 2) field.setCustomValidity(t('Introduce tu nombre (al menos 2 caracteres).'));
    if (field.name === 'message' && field.value.trim().length < 10) field.setCustomValidity(t('Cuéntanos un poco más (al menos 10 caracteres).'));
    if (field.name === 'phone' && field.value && !/^[+\d\s().-]{7,30}$/.test(field.value)) field.setCustomValidity(t('Revisa el teléfono o deja el campo vacío.'));
    const error = field.closest('label')?.querySelector('.field-error');
    if (!field.validity.valid) { valid = false; field.setAttribute('aria-invalid','true'); if (error) error.textContent = field.name === 'privacy' ? t('Debes leer y aceptar la información de privacidad.') : field.validity.typeMismatch || field.name === 'email' ? t('Introduce un correo electrónico válido.') : field.validity.valueMissing ? t('Completa este campo para continuar.') : (field.validity.customError ? field.validationMessage : t('Revisa este campo para continuar.')); }
    else { field.removeAttribute('aria-invalid'); if (error) error.textContent=''; }
  }
  if (!valid) form.querySelector('[aria-invalid="true"]')?.focus();
  return valid;
}

async function initContact(form) {
  const feedback = form.querySelector('.form-feedback');
  const button = form.querySelector('[type="submit"]');
  let catalog; let configuration = null; let configurationText = '';
  try { catalog = await getCatalog(); } catch(error) { feedback.textContent=errorMessage(error); button.disabled=true; return; }
  form.querySelectorAll('.field-error').forEach((error,i)=>{error.id=`${form.id || 'contact'}-error-${i}`; const input=error.closest('label')?.querySelector('input,textarea'); input?.setAttribute('aria-describedby',error.id);});
  const params = new URLSearchParams(location.search);
  if (catalog.models.some(m=>m.id===params.get('model'))) form.elements.model.value=params.get('model');
  if (params.has('finish')) {
    try { configuration = {model:params.get('model'),area:params.get('area'),finish:params.get('finish'),equipment:params.get('equipment'),extras:params.getAll('extra')}; const result=estimate(catalog,configuration); configurationText=estimateText(result,catalog); const context=form.querySelector('.config-context');context.hidden=false; const strong=document.createElement('strong');strong.textContent=t('Tu configuración viene contigo');const p=document.createElement('p');p.textContent=`${result.model.name} · ${result.area} m² · ${t('Subtotal orientativo')}: ${euros(result.subtotal)}. ${t('El desglose se adjuntará a tu solicitud.')}`;context.append(strong,p); } catch { feedback.textContent=t('La configuración del enlace no es válida. Puedes completar una nueva consulta.'); configuration=null; }
  }
  if (catalog.contactEndpoint) { form.querySelector('.form-notice').hidden=true;form.querySelector('.form-local').textContent=t('Tus datos se enviarán al servicio de solicitudes configurado.');button.textContent=t('Enviar solicitud ↗'); }
  form.elements.model.addEventListener('change', () => {
    if (configuration && form.elements.model.value !== configuration.model) {
      configuration = null; configurationText = '';
      form.querySelector('.config-context').hidden = true;
      feedback.textContent = t('Has cambiado el modelo. Se ha retirado la configuración anterior de esta consulta.');
    }
  });
  form.addEventListener('input',event=>{ if(event.target.hasAttribute('aria-invalid')) {event.target.removeAttribute('aria-invalid');event.target.setCustomValidity('');const error=event.target.closest('label')?.querySelector('.field-error');if(error)error.textContent='';} });
  form.addEventListener('submit',async event=> {
    event.preventDefault(); feedback.textContent=''; if(!validateForm(form)) {feedback.textContent=t('Revisa los campos indicados para continuar.');return;}
    const data=Object.fromEntries(new FormData(form)); data.name=data.name.trim();data.message=data.message.trim();data.configuration=configuration;
    if(!catalog.contactEndpoint) {download(t('equihome-solicitud.txt'),requestText(data,configurationText));feedback.textContent=t('Solicitud descargada. Tus datos no se han enviado a Equihome.');return;}
    button.disabled=true;button.textContent=t('Enviando…');form.setAttribute('aria-busy','true');
    try { const response=await fetch(catalog.contactEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error(t('No se ha podido enviar. Tus datos siguen en el formulario; inténtalo de nuevo.'));const result=await response.json();if(result.ok!==true)throw new Error(t('El servicio no ha confirmado la recepción. Inténtalo de nuevo.'));feedback.textContent=t('Solicitud recibida correctamente. Gracias por compartir tu proyecto.');form.reset(); }
    catch(error){feedback.textContent=error.name==='TimeoutError'?t('El servicio no ha respondido a tiempo. Inténtalo de nuevo.'):errorMessage(error);}
    finally{button.disabled=false;button.textContent=t('Enviar solicitud ↗');form.removeAttribute('aria-busy');}
  });
  button.disabled = false;
}
document.querySelectorAll('[data-estimator]').forEach(initEstimator);
document.querySelectorAll('[data-contact]').forEach(initContact);
