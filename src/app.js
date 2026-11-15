import { estimate, euros } from './lib/pricing.mjs';

const siteBase = new URL('.', import.meta.url);
const siteUrl = path => new URL(path, siteBase).href;

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() { menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', 'Abrir menú'); navigation?.classList.remove('is-open'); }
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); navigation.classList.toggle('is-open', open); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const thumbs = [...gallery.querySelectorAll('[data-gallery-index]')]; let current = 0;
  function show(index) {
    current = (index + thumbs.length) % thumbs.length;
    const picture = gallery.querySelector('.gallery-main');
    const name = thumbs[current].dataset.image;
    picture.querySelector('source').srcset = [640, 1280, 1920].map(width => `${siteUrl(`images/${name}-${width}.webp`)} ${width}w`).join(', ');
    picture.querySelector('img').src = siteUrl(`images/${name}-1280.webp`);
    picture.querySelector('img').alt = `${current === 0 ? 'Exterior' : 'Interior'} ilustrativo de la vivienda`;
    gallery.querySelector('[data-gallery-count]').textContent = `${current + 1} / ${thumbs.length} · ${current === 0 ? 'Exterior' : 'Interior'}`;
    thumbs.forEach((button,i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  thumbs.forEach((button,i) => button.addEventListener('click', () => show(i)));
  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
});

function download(filename, text) { const blob = new Blob([text], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function errorMessage(error) { return error instanceof Error ? error.message : 'No se ha podido completar la operación. Inténtalo de nuevo.'; }
let catalogPromise;
function getCatalog() { return catalogPromise ??= fetch(siteUrl('data/catalog.json')).then(response => { if (!response.ok) throw new Error('No se han podido cargar los precios. Recarga la página para volver a intentarlo.'); return response.json(); }); }
function selectionFrom(form) { const data = new FormData(form); return { model: data.get('model'), area: data.has('area') ? data.get('area') : undefined, finish: data.get('finish'), equipment: data.get('equipment'), extras: data.getAll('extras') }; }
function estimateText(result, catalog, context = '') { return `EQUIHOME · ESTIMACIÓN ORIENTATIVA\n${new Date().toLocaleDateString('es-ES')}\n\n${result.model.name} · Superficie solicitada: ${result.area} m²\n${result.lines.map(line => `${line.name}: ${euros(line.value)}`).join('\n')}\nSuplementos orientativos: ${euros(result.optionsTotal)}\nSubtotal de vivienda y opciones: ${euros(result.subtotal)}${result.customArea?' (la superficie personalizada requiere estudio)':''}\nTotal completo del proyecto: pendiente de presupuesto\nIVA: pendiente de determinar\n${context}\n\nCONCEPTOS PENDIENTES, NO INCLUIDOS EN EL SUBTOTAL\n${catalog.excluded.join('\n')}\n\nTodos los importes son hipótesis comerciales pendientes de validación. No es una oferta contractual. Imágenes y distribuciones ilustrativas.`; }

async function initEstimator(root) {
  const output = root.querySelector('[data-estimate-output]');
  const form = root.querySelector('form');
  const quoteLink = root.querySelector('[data-request-quote]');
  const downloadButton = root.querySelector('[data-download-estimate]');
  const status = root.querySelector('[data-estimate-status]');
  let catalog, result;
  try { catalog = await getCatalog(); } catch (error) { output.textContent = errorMessage(error); downloadButton.disabled = true; return; }
  const queryModel = new URLSearchParams(location.search).get('model');
  if ([...form.elements.model.options].some(option => option.value === queryModel)) { form.elements.model.value = queryModel; if (form.elements.area) form.elements.area.value = catalog.models.find(m => m.id === queryModel).area; }
  function update() {
    status.textContent = '';
    try {
      const selection = selectionFrom(form); result = estimate(catalog, selection);
      const finish = catalog.finishes.find(f=>f.id===selection.finish); const equipment = catalog.equipment.find(e=>e.id===selection.equipment);
      root.querySelector('[data-model-name]').textContent = result.model.name;
      root.querySelector('[data-selection-description]').textContent = `${result.area} m² · ${finish.name} · ${equipment.name}`;
      output.innerHTML = `<dl class="estimate-lines">${result.lines.map(line => `<div><dt>${line.name}</dt><dd>${euros(line.value)}</dd></div>`).join('')}<div class="options-total"><dt>Total suplementos</dt><dd>${euros(result.optionsTotal)}</dd></div></dl><div class="estimate-subtotal"><span>Subtotal orientativo de vivienda y opciones</span><strong>${euros(result.subtotal)}</strong>${result.customArea?'<p class="small">La superficie personalizada necesita un estudio. No se aplica un precio por metro cuadrado.</p>':''}</div><dl class="estimate-lines pending-lines"><div><dt>Transporte e instalación</dt><dd>Por determinar</dd></div><div><dt>IVA aplicable</dt><dd>Por determinar</dd></div><div><dt>Total del proyecto</dt><dd>Pendiente de presupuesto</dd></div></dl>`;
      const params = new URLSearchParams({ model: selection.model, area: String(result.area), finish: selection.finish, equipment: selection.equipment });
      selection.extras.forEach(extra=>params.append('extra',extra));
      quoteLink.href = siteUrl('contacto/?' + params);
      quoteLink.removeAttribute('aria-disabled'); downloadButton.disabled = false;
    } catch (error) { result = null; output.textContent = errorMessage(error); quoteLink.setAttribute('aria-disabled','true'); downloadButton.disabled = true; }
  }
  form.addEventListener('submit', event=>event.preventDefault());
  form.addEventListener('input', event=> { if (event.target.name === 'model' && form.elements.area) form.elements.area.value = catalog.models.find(m=>m.id===event.target.value).area; update(); });
  form.addEventListener('reset', () => setTimeout(update,0));
  quoteLink.addEventListener('click',event=>{if(!result) event.preventDefault();});
  downloadButton.addEventListener('click',()=>{if(result) { const context = form.elements.location ? `Ubicación: ${form.elements.location.value || 'Por definir'}\nTransporte: ${form.elements.transport.selectedOptions[0].textContent}` : ''; download('equihome-estimacion.txt',estimateText(result,catalog,context)); status.textContent = 'Desglose descargado en tu dispositivo. No se ha enviado ninguna solicitud.'; }});
  update();
}

function validateForm(form) {
  let valid = true;
  for (const field of [...form.elements]) {
    if (!['INPUT','TEXTAREA','SELECT'].includes(field.tagName)) continue;
    field.setCustomValidity('');
    if (field.name === 'name' && field.value.trim().length < 2) field.setCustomValidity('Introduce tu nombre (al menos 2 caracteres).');
    if (field.name === 'message' && field.value.trim().length < 10) field.setCustomValidity('Cuéntanos un poco más (al menos 10 caracteres).');
    if (field.name === 'phone' && field.value && !/^[+\d\s().-]{7,30}$/.test(field.value)) field.setCustomValidity('Revisa el teléfono o deja el campo vacío.');
    const error = field.closest('label')?.querySelector('.field-error');
    if (!field.validity.valid) { valid = false; field.setAttribute('aria-invalid','true'); if (error) error.textContent = field.name === 'privacy' ? 'Debes leer y aceptar la información de privacidad.' : field.validity.typeMismatch || field.name === 'email' ? 'Introduce un correo electrónico válido.' : field.validity.valueMissing ? 'Completa este campo para continuar.' : field.validationMessage; }
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
    try { configuration = {model:params.get('model'),area:params.get('area'),finish:params.get('finish'),equipment:params.get('equipment'),extras:params.getAll('extra')}; const result=estimate(catalog,configuration); configurationText=estimateText(result,catalog); const context=form.querySelector('.config-context');context.hidden=false; const strong=document.createElement('strong');strong.textContent='Tu configuración viene contigo';const p=document.createElement('p');p.textContent=`${result.model.name} · ${result.area} m² · Subtotal orientativo: ${euros(result.subtotal)}. El desglose se adjuntará a tu solicitud.`;context.append(strong,p); } catch { feedback.textContent='La configuración del enlace no es válida. Puedes completar una nueva consulta.'; configuration=null; }
  }
  if (catalog.contactEndpoint) { form.querySelector('.form-notice').hidden=true;form.querySelector('.form-local').textContent='Tus datos se enviarán al servicio de solicitudes configurado.';button.textContent='Enviar solicitud ↗'; }
  form.elements.model.addEventListener('change', () => {
    if (configuration && form.elements.model.value !== configuration.model) {
      configuration = null; configurationText = '';
      form.querySelector('.config-context').hidden = true;
      feedback.textContent = 'Has cambiado el modelo. Se ha retirado la configuración anterior de esta consulta.';
    }
  });
  form.addEventListener('input',event=>{ if(event.target.hasAttribute('aria-invalid')) {event.target.removeAttribute('aria-invalid');event.target.setCustomValidity('');const error=event.target.closest('label')?.querySelector('.field-error');if(error)error.textContent='';} });
  form.addEventListener('submit',async event=> {
    event.preventDefault(); feedback.textContent=''; if(!validateForm(form)) {feedback.textContent='Revisa los campos indicados para continuar.';return;}
    const data=Object.fromEntries(new FormData(form)); data.name=data.name.trim();data.message=data.message.trim();data.configuration=configuration;
    if(!catalog.contactEndpoint) {download('equihome-solicitud.txt',`EQUIHOME · SOLICITUD PREPARADA, NO ENVIADA\n\nNombre: ${data.name}\nCorreo: ${data.email}\nTeléfono: ${data.phone || 'No indicado'}\nModelo: ${data.model || 'Por definir'}\nPresupuesto: ${data.budget || 'Por definir'}\nUbicación: ${data.location || 'Por definir'}\n\n${data.message}\n\nInformación de privacidad leída y aceptada.\n\n${configurationText}\n\nEste archivo se ha generado en tu dispositivo. No se ha enviado a Equihome.`);feedback.textContent='Solicitud descargada. Tus datos no se han enviado a Equihome.';return;}
    button.disabled=true;button.textContent='Enviando…';form.setAttribute('aria-busy','true');
    try { const response=await fetch(catalog.contactEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('No se ha podido enviar. Tus datos siguen en el formulario; inténtalo de nuevo.');const result=await response.json();if(result.ok!==true)throw new Error('El servicio no ha confirmado la recepción. Inténtalo de nuevo.');feedback.textContent='Solicitud recibida correctamente. Gracias por compartir tu proyecto.';form.reset(); }
    catch(error){feedback.textContent=error.name==='TimeoutError'?'El servicio no ha respondido a tiempo. Inténtalo de nuevo.':errorMessage(error);}
    finally{button.disabled=false;button.textContent='Enviar solicitud ↗';form.removeAttribute('aria-busy');}
  });
  button.disabled = false;
}
document.querySelectorAll('[data-estimator]').forEach(initEstimator);
document.querySelectorAll('[data-contact]').forEach(initContact);
