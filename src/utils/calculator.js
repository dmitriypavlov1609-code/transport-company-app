// ─── Vehicle types ──────────────────────────────────────────────
export const VEHICLE_TYPES = [
  { id: 'tent',    name: 'Тент',           maxWeight: 20, maxVolume: 82, pricePerKm: 32 },
  { id: 'ref',     name: 'Рефрижератор',   maxWeight: 20, maxVolume: 76, pricePerKm: 45 },
  { id: 'board',   name: 'Бортовой',       maxWeight: 20, maxVolume: 60, pricePerKm: 28 },
  { id: 'cont20',  name: 'Контейнер 20\'',  maxWeight: 24, maxVolume: 33, pricePerKm: 38 },
  { id: 'cont40',  name: 'Контейнер 40\'',  maxWeight: 24, maxVolume: 67, pricePerKm: 48 },
  { id: 'isotherm',name: 'Изотерм',        maxWeight: 20, maxVolume: 76, pricePerKm: 38 },
  { id: 'mega',    name: 'Мега-тент',      maxWeight: 20, maxVolume: 100, pricePerKm: 36 },
  { id: 'small',   name: 'Малотоннажный',  maxWeight: 3,  maxVolume: 16, pricePerKm: 22 },
];

// ─── Cargo types ────────────────────────────────────────────────
export const CARGO_TYPES = [
  'Стройматериалы', 'Продукты питания', 'Оборудование', 'Мебель',
  'Бытовая техника', 'Одежда и текстиль', 'Химия', 'Металлопрокат',
  'Автозапчасти', 'Товары народного потребления', 'Другое',
];

// ─── Additional services ───────────────────────────────────────
export const SERVICES = [
  { id: 'loading',    name: 'Погрузка/разгрузка', price: 5000 },
  { id: 'insurance',  name: 'Страхование груза',  pricePercent: 0.5 },
  { id: 'packing',    name: 'Упаковка',           price: 3000 },
  { id: 'expedition', name: 'Экспедирование',     pricePercent: 5 },
  { id: 'rigid',      name: 'Жёсткая сцепка',     price: 8000 },
  { id: 'docs',       name: 'Оформление документов', price: 2000 },
];

// ─── Urgency ────────────────────────────────────────────────────
export const URGENCY = [
  { id: 'economy',  name: 'Эконом',    multiplier: 0.85, days: '+1-2 дня' },
  { id: 'standard', name: 'Стандарт',  multiplier: 1.0,  days: 'по графику' },
  { id: 'express',  name: 'Экспресс',  multiplier: 1.4,  days: 'срочная' },
];

// ─── Calculate fare ─────────────────────────────────────────────
export function calculateFare({ distanceKm, vehicleType, weight, volume, urgency, services = [], cargoValue = 0 }) {
  const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleType) || VEHICLE_TYPES[0];
  const urg = URGENCY.find(u => u.id === urgency) || URGENCY[1];

  // Base: per-km rate
  let base = vehicle.pricePerKm * distanceKm;

  // Min price for short distances
  base = Math.max(base, 3000);

  // Weight surcharge if > 50% capacity
  if (weight > vehicle.maxWeight * 0.5) {
    base *= 1 + (weight / vehicle.maxWeight) * 0.2;
  }

  // Apply urgency
  base *= urg.multiplier;

  // Additional services
  let extras = 0;
  services.forEach(sId => {
    const svc = SERVICES.find(s => s.id === sId);
    if (!svc) return;
    if (svc.price) extras += svc.price;
    if (svc.pricePercent) extras += (cargoValue || base) * svc.pricePercent / 100;
  });

  const total = Math.round((base + extras) / 100) * 100;

  return {
    base: Math.round(base / 100) * 100,
    extras: Math.round(extras / 100) * 100,
    total,
    vehicle,
    urgency: urg,
    perKm: Math.round(total / distanceKm),
  };
}
