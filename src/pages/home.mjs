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
          <p>Un hogar bien pensado no necesita más metros. Necesita espacio para lo que de verdad importa.</p>
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
    <section class="intro-section section container">
      <span class="eyebrow">01 / NUESTRA FORMA DE ENTENDER EL HOGAR</span>
      <div><h2>Menos complicaciones.<br><em>Más vida dentro.</em></h2><div class="intro-bottom"><p>En Equihome creemos en una vivienda accesible, funcional y diseñada con intención. Una casa que aprovecha cada metro y deja sitio a tu forma de vivir.</p><a class="text-link" href="/nosotros/">Conoce Equihome ${arrow}</a></div></div>
    </section>
    <section class="models-section section container">
      <div class="section-heading"><div><span class="eyebrow">02 / UN MODELO, TU PROPIO HOGAR</span><h2>Lo esencial.<br><em>Bien resuelto.</em></h2><p>Una planta, espacios abiertos y decisiones que marcan la diferencia en el día a día.</p></div></div>
      ${modelCard(model)}
    </section>
    <section class="living-section section container">
      <div class="living-copy"><span class="eyebrow">PENSADO PARA HABITARLO</span><h2>La vida sucede<br><em>en los detalles.</em></h2><p>Una cocina abierta. Luz en la zona de estar. Un dormitorio que también puede ser tu espacio de trabajo. El diseño tiene sentido cuando encaja contigo.</p><a class="text-link" href="/viviendas/equi-60/#distribucion">Explora la distribución ${arrow}</a></div>
      <div class="image-frame">${picture('interior','Visualización del interior de Equi 60 con cocina abierta, salón y acabados cálidos')}<span class="image-caption">Interior ilustrativo · Acabados sujetos a proyecto</span></div>
    </section>
    <section class="difference section"><div class="container">
      <div class="section-heading"><div><span class="eyebrow">03 / CONSTRUIR CON CRITERIO</span><h2>Bien pensado desde<br><em>el primer paso.</em></h2></div><p>La construcción industrializada empieza mucho antes de llegar a tu parcela: en el diseño, los materiales y la planificación.</p></div>
      <div class="benefits"><article><span class="number">01</span><h3>Diseño funcional</h3><p>Cada espacio tiene una razón de ser. Distribuciones compactas que dan prioridad a cómo se vive.</p></article><article><span class="number">02</span><h3>Proceso planificado</h3><p>Un proyecto definido para coordinar fabricación, preparación de la parcela y montaje.</p></article><article><span class="number">03</span><h3>Cuentas claras</h3><p>Un presupuesto que distingue la vivienda, tus opciones y los conceptos que necesitan estudio.</p></article></div>
    </div></section>
    <section class="sustain-preview section container"><div class="image-frame">${picture('workshop','Visualización ilustrativa de madera, aislamiento y montaje de un panel; no representa instalaciones de Equihome')}<span class="image-caption">Materiales y construcción · Imagen ilustrativa</span></div><div class="sustain-copy"><span class="eyebrow">UNA MIRADA AL ENTORNO</span><h2>Elegir mejor.<br><em>Construir con sentido.</em></h2><p>Estudiar materiales recuperados cuando sean técnicamente adecuados. Planificar para evitar residuos. Diseñar teniendo en cuenta el uso y el mantenimiento.</p><p>Sin cifras de impacto ni certificaciones que no podamos demostrar.</p><a class="text-link" href="/sostenibilidad/">Nuestro enfoque ${arrow}</a></div></section>
    <section class="process-preview section container"><div class="section-heading"><div><span class="eyebrow">04 / DE LA IDEA A TU CASA</span><h2>Un camino claro.<br><em>Contigo, paso a paso.</em></h2></div><a class="text-link" href="/proceso/">Conoce el proceso completo ${arrow}</a></div><ol class="process-short"><li><span>01</span><h3>Tu idea</h3><p>Cuéntanos cómo imaginas tu Equi 60 y qué necesitas.</p></li><li><span>02</span><h3>El estudio</h3><p>Parcela, viabilidad, alcance y presupuesto.</p></li><li><span>03</span><h3>La construcción</h3><p>Proyecto, permisos y fabricación coordinados.</p></li><li><span>04</span><h3>Tu hogar</h3><p>Transporte, instalación y entrega planificados.</p></li></ol></section>
    <section class="trust container"><span class="eyebrow">ANTES DE DECIDIR, TODA LA INFORMACIÓN</span><div><h2>Lo importante,<br><em>desde el principio.</em></h2><p>Las imágenes y distribuciones son ilustrativas. Los precios son orientativos. Cada parcela necesita un estudio. Queremos que sepas qué estás eligiendo.</p><a class="text-link" href="/viviendas/#precios">Qué debe confirmar tu presupuesto ${arrow}</a></div></section>
    ${cta()}`;
}
