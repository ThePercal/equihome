import { estimate } from './pricing.mjs';

// Share only product choices. Contact details and installation locations stay out of URLs.
export function selectionParams(catalog, selection) {
  const result = estimate(catalog, selection);
  const params = new URLSearchParams({ model: result.model.id, area: String(result.area), finish: selection.finish, equipment: selection.equipment });
  [...new Set(selection.extras ?? [])].forEach(extra => params.append('extra', extra));
  return params;
}

export function selectionFromParams(catalog, params) {
  if (!params.has('finish')) return null;
  const selection = { model: params.get('model'), area: params.get('area') ?? undefined, finish: params.get('finish'), equipment: params.get('equipment'), extras: params.getAll('extra') };
  const result = estimate(catalog, selection);
  return { ...selection, area: result.area, extras: [...new Set(selection.extras)] };
}
