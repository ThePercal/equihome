const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

export function initGallery(gallery, siteUrl) {
  const thumbs = [...gallery.querySelectorAll('[data-gallery-index]')];
  const picture = gallery.querySelector('.gallery-main');
  const opener = gallery.querySelector('[data-gallery-open]');
  let current = 0;
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', 'Imágenes de Equi 60');
  dialog.innerHTML = `<div class="viewer-header"><span>Equi 60 <span class="viewer-separator">/</span> Galería</span><button type="button" data-viewer-close aria-label="Cerrar galería" autofocus>✕</button></div><div class="viewer-image"><img alt=""></div><div class="viewer-controls"><button type="button" data-viewer-prev aria-label="Imagen anterior">←</button><span data-viewer-count role="status"></span><button type="button" data-viewer-next aria-label="Imagen siguiente">→</button></div><p>Visualizaciones ilustrativas · No representan acabados contractuales.</p>`;
  document.body.append(dialog);
  const largeImage = dialog.querySelector('img');
  function show(index) {
    current = (index + thumbs.length) % thumbs.length;
    const name = thumbs[current].dataset.image;
    const label = current === 0 ? 'Exterior' : 'Interior';
    picture.querySelector('source').srcset = [640, 1280, 1920].map(width => `${siteUrl(`images/${name}-${width}.webp`)} ${width}w`).join(', ');
    picture.querySelector('img').src = siteUrl(`images/${name}-1280.webp`);
    picture.querySelector('img').alt = `${label} ilustrativo de Equi 60`;
    const caption = `${String(current + 1).padStart(2, '0')} / ${String(thumbs.length).padStart(2, '0')} · ${label}`;
    gallery.querySelector('[data-gallery-count]').textContent = caption;
    thumbs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    if (dialog.open) {
      largeImage.src = siteUrl(`images/${name}-1920.webp`);
      largeImage.alt = `${label} ilustrativo de Equi 60`;
      dialog.querySelector('[data-viewer-count]').textContent = caption;
    }
  }
  thumbs.forEach((button, i) => button.addEventListener('click', () => show(i)));
  gallery.querySelector('[data-gallery-prev]').addEventListener('click', () => show(current - 1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(current + 1));
  opener.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('viewer-open');
    show(current);
  });
  dialog.querySelector('[data-viewer-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-viewer-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-viewer-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    opener.focus({ preventScroll: true });
  });
  show(0);
}

export function initPageInteractions() {
  const nav = document.querySelector('.detail-nav');
  const links = [...document.querySelectorAll('.detail-nav-links a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const modelAction = document.querySelector('[data-model-action]');
  const quoteHero = document.querySelector('[data-quote-hero]');
  const quoteTarget = document.querySelector('[data-quote-target]');
  const estimateAction = document.querySelector('[data-mobile-estimate]');
  const estimateForm = document.querySelector('[data-estimate-form]');
  const estimatePanel = document.querySelector('.estimate-panel');
  if (modelAction || estimateAction) document.body.classList.add('has-mobile-action');
  let scheduled = false;
  function updateScrollState() {
    scheduled = false;
    if (nav) {
      let active = -1;
      sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= 130) active = index; });
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      nav.classList.toggle('is-stuck', nav.getBoundingClientRect().top <= 1);
    }
    if (modelAction && !modelAction.contains(document.activeElement)) {
      modelAction.hidden = quoteHero.getBoundingClientRect().bottom > 0 || quoteTarget.getBoundingClientRect().top < innerHeight;
    }
    if (estimateAction && !estimateAction.contains(document.activeElement)) {
      estimateAction.hidden = estimateForm.getBoundingClientRect().top > innerHeight || estimatePanel.getBoundingClientRect().top < innerHeight - 80;
    }
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScrollState); } }
  if (nav || modelAction || estimateAction) {
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    addEventListener('load', schedule, { once: true });
    document.addEventListener('focusout', schedule);
    updateScrollState();
  }
  estimateAction?.querySelector('a').addEventListener('click', () => {
    estimatePanel.focus({ preventScroll: true });
  });
  if (modelAction) {
    quoteTarget.tabIndex = -1;
    modelAction.querySelector('a').addEventListener('click', () => quoteTarget.focus({ preventScroll: true }));
  }

  // Content remains visible without JavaScript or when reduced motion is requested.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(({ target }) => {
        if (!reducedMotion.matches) target.animate([{ opacity: .25, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 550, easing: 'cubic-bezier(.2,.7,.3,1)' });
        observer.unobserve(target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.section-heading, .model-card, .living-copy, .sustain-copy, .benefits article, .process-short li').forEach(node => observer.observe(node));
    reducedMotion.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); document.getAnimations().forEach(animation => animation.finish()); }
    });
  }
}
