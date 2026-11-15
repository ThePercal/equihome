import { euros } from '../lib/pricing.mjs';
import { arrow, picture, modelCard, cta } from '../components/shared.mjs';

export function home(catalog) {
  const model = catalog.models[0];
  return `
    <section class="home-hero container">
      <span class="eyebrow">EQUIHOME — VIVIENDA MODULAR CON SENTIDO</span>
      <div class="hero-top">
        <h1>Tu espacio.<br><em>Tu manera de vivir.</em></h1>
        <div class="hero-intro">
          <p>Equi 60: 60 m², dos dormitorios y una zona de día abierta. Tu casa, con lo esencial bien resuelto.</p>
          <a class="button" href="/viviendas/equi-60/">Descubre Equi 60 ${arrow}</a>
          <a class="text-link" href="/calculadora/">Calcula tu presupuesto ${arrow}</a>
        </div>
      </div>
      <div class="hero-visual">
        ${picture('exterior','Visualización ilustrativa de Equi 60, una vivienda modular de madera en un paisaje mediterráneo','hero-picture',true)}
        <div class="hero-image-label"><span>EL HOGAR EMPIEZA AQUÍ</span><a href="/viviendas/equi-60/">Equi 60 <span aria-hidden="true">↗</span></a></div>
      </div>
      <div class="hero-caption"><span>Diseño compacto. Materiales cálidos. Posibilidades reales.</span><span>Visualización ilustrativa</span></div>
      <dl class="home-facts">
        <div><dt>Superficie propuesta</dt><dd>${model.area}<span> m²</span></dd></div>
        <div><dt>Dormitorios</dt><dd>0${model.bedrooms}</dd></div>
        <div><dt>Baño</dt><dd>0${model.bathrooms}</dd></div>
        <div><dt>Hipótesis de precio base</dt><dd>${euros(model.basePrice)}<sup>*</sup></dd></div>
      </dl>
      <p class="small pricing-note">* Importe orientativo pendiente de validación comercial. IVA, terreno, licencias, cimentación, transporte e instalación por determinar.</p>
    </section>
    <section class="models-section section container">
      <div class="section-heading"><div><span class="eyebrow">01 / UN MODELO, TU PROPIO HOGAR</span><h2>Conoce tu Equi 60.</h2><p>Una planta, espacios abiertos y decisiones que marcan la diferencia en el día a día.</p></div></div>
      ${modelCard(model)}
    </section>
    <section class="living-section section container">
      <div class="living-copy"><span class="eyebrow">PENSADO PARA HABITARLO</span><h2>Espacio para tu día a día.</h2><p>Una cocina abierta. Luz en la zona de estar. Un dormitorio que también puede ser tu espacio de trabajo. El diseño tiene sentido cuando encaja contigo.</p><a class="text-link" href="/viviendas/equi-60/#distribucion">Explora la distribución ${arrow}</a></div>
      <div class="image-frame">${picture('interior','Visualización del interior de Equi 60 con cocina abierta, salón y acabados cálidos')}<span class="image-caption">Interior ilustrativo · Acabados sujetos a proyecto</span></div>
    </section>
    <section class="difference section"><div class="container">
      <div class="section-heading"><div><span class="eyebrow">02 / CONSTRUIR CON CRITERIO</span><h2>Bien pensado desde el principio.</h2></div><p>La construcción industrializada empieza mucho antes de llegar a tu parcela: en el diseño, los materiales y la planificación.</p></div>
      <div class="benefits"><article><span class="number">01</span><h3>Diseño funcional</h3><p>Cada espacio tiene una razón de ser. Distribuciones compactas que dan prioridad a cómo se vive.</p></article><article><span class="number">02</span><h3>Proceso planificado</h3><p>Un proyecto definido para coordinar fabricación, preparación de la parcela y montaje.</p></article><article><span class="number">03</span><h3>Cuentas claras</h3><p>Un presupuesto que distingue la vivienda, tus opciones y los conceptos que necesitan estudio.</p></article></div>
    </div></section>
    <section class="sustain-preview section container"><div class="image-frame">${picture('workshop','Visualización ilustrativa de madera, aislamiento y montaje de un panel; no representa instalaciones de Equihome')}<span class="image-caption">Materiales y construcción · Imagen ilustrativa</span></div><div class="sustain-copy"><span class="eyebrow">UNA MIRADA AL ENTORNO</span><h2>Construir con sentido.</h2><p>Estudiar materiales recuperados cuando sean técnicamente adecuados. Planificar para evitar residuos. Diseñar teniendo en cuenta el uso y el mantenimiento.</p><p>Sin cifras de impacto ni certificaciones que no podamos demostrar.</p><a class="text-link" href="/sostenibilidad/">Nuestro enfoque ${arrow}</a></div></section>
    <section class="process-preview section container"><div class="section-heading"><div><span class="eyebrow">03 / DE LA IDEA A TU CASA</span><h2>De la idea a tu hogar.</h2></div><a class="text-link" href="/proceso/">Conoce el proceso completo ${arrow}</a></div><ol class="process-short"><li><span>01</span><h3>Tu idea</h3><p>Cuéntanos cómo imaginas tu Equi 60 y qué necesitas.</p></li><li><span>02</span><h3>El estudio</h3><p>Parcela, viabilidad, alcance y presupuesto.</p></li><li><span>03</span><h3>La construcción</h3><p>Proyecto, permisos y fabricación coordinados.</p></li><li><span>04</span><h3>Tu hogar</h3><p>Transporte, instalación y entrega planificados.</p></li></ol></section>
    ${cta()}`;
}
