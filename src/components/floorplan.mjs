// Esquemas conceptuales, no planos de ejecución. Cada estancia tiene acceso al paso.
export function floorplan(model) {
  return `<svg class="floorplan" viewBox="0 0 720 450" role="img" aria-labelledby="plan-title-${model.id} plan-desc-${model.id}">
    <title id="plan-title-${model.id}">Distribución conceptual de ${model.name}</title>
    <desc id="plan-desc-${model.id}">Propuesta de ${model.bedrooms} dormitorios, ${model.bathrooms} baños y salón con cocina conectados por una zona de paso. Sin escala ni validez técnica.</desc>
    <rect x="35" y="35" width="650" height="355" fill="#f7f7f3" stroke="#294b3b" stroke-width="7"/>
    <g stroke="#294b3b" stroke-width="5" fill="none">
      <path d="M400 35v140M400 240v150M400 175h285M400 240h285M540 35v140M525 240v150"/>
      <path d="M445 175h35M585 175h35M440 240h35M585 240h35" stroke="#f7f7f3" stroke-width="9"/>
      <path d="M445 175v-35a35 35 0 0 1 35 35M585 175v-35a35 35 0 0 1 35 35M440 240v35a35 35 0 0 0 35-35" stroke-width="1"/>
    </g>
    <g stroke="#adc0b1" stroke-width="8"><path d="M110 390h180M35 100v145M440 35h65M580 35h65"/></g>
    <g fill="#d9d7c8"><rect x="60" y="60" width="180" height="40"/><rect x="60" y="60" width="40" height="130"/></g>
    <g fill="#d4dacd" stroke="#84947e" stroke-width="1"><rect x="105" y="285" width="160" height="58" rx="5"/><rect x="430" y="60" width="80" height="60"/><rect x="570" y="60" width="80" height="60"/></g>
    <circle cx="265" cy="155" r="43" fill="#e4ded0" stroke="#9a9a87"/>
    <g fill="#294b3b" font-family="Arial,sans-serif" font-size="13" text-anchor="middle"><text x="245" y="240">SALÓN · COCINA</text><text x="470" y="150">DORM. 1</text><text x="610" y="150">DORM. 2</text><text x="540" y="214">PASO · ACCESO</text><text x="460" y="335">BAÑO</text></g>
    <g stroke="#294b3b" stroke-width="5" fill="none" font-family="Arial,sans-serif" font-size="12" text-anchor="middle"><rect x="590" y="265" width="65" height="35" fill="#d9d7c8" stroke="none"/><text x="620" y="345" fill="#294b3b" stroke="none">ALMACÉN</text></g>
    <path d="M685 185v43" stroke="#f7f7f3" stroke-width="10"/><path d="M685 185h-43a43 43 0 0 0 43 43" fill="none" stroke="#294b3b"/>
    <text x="360" y="432" fill="#666c64" font-family="Arial,sans-serif" font-size="11" text-anchor="middle">ESQUEMA CONCEPTUAL · SIN ESCALA · SUJETO A PROYECTO TÉCNICO</text>
  </svg>`;
}
