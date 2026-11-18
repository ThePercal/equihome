export const euros = (value, locale = 'es-ES') => value == null ? (locale.startsWith('en') ? 'To be confirmed' : 'Por definir') : new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export function estimate(catalog, selection = {}) {
  const model = catalog.models.find(item => item.id === selection.model);
  const finish = catalog.finishes.find(item => item.id === selection.finish);
  const equipment = catalog.equipment.find(item => item.id === selection.equipment);
  if (!model || !finish || !equipment) throw new Error('Selecciona un modelo, acabado y equipamiento válidos.');
  const area = Number(selection.area ?? model.area);
  if (!Number.isFinite(area) || area < 30 || area > 200) throw new Error('La superficie debe estar entre 30 y 200 m².');
  const extraIds = [...new Set(selection.extras ?? [])];
  if (extraIds.some(id => !catalog.extras.some(extra => extra.id === id))) throw new Error('Hay un extra no válido.');
  const extras = catalog.extras.filter(extra => extraIds.includes(extra.id));
  const lines = [{ name: model.name + ' · ' + model.area + ' m²', value: model.basePrice }, { name: (catalog.locale === 'en' ? 'Finish: ' : 'Acabado ') + finish.name, value: finish.price }, { name: (catalog.locale === 'en' ? 'Equipment: ' : 'Equipamiento ') + equipment.name, value: equipment.price }, ...extras.map(extra => ({ name: extra.name, value: extra.price }))];
  const optionsTotal = finish.price + equipment.price + extras.reduce((sum, extra) => sum + extra.price, 0);
  const customArea = area !== model.area;
  const subtotal = model.basePrice == null || customArea ? null : model.basePrice + optionsTotal;
  return { model, area, customArea, lines, optionsTotal, subtotal, tax: null, transport: null, installation: null, total: null };
}
