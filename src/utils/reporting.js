export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

export function getRevenueMetrics(orders) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const total = safeOrders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  const deliveredRevenue = safeOrders
    .filter((order) => order.status === 'delivered')
    .reduce((sum, order) => sum + Number(order.price || 0), 0);

  const byStatus = aggregateBy(safeOrders, (order) => order.status || 'unknown');
  const byVehicle = aggregateBy(safeOrders, (order) => order.vehicle || 'unknown');
  const byClient = aggregateBy(safeOrders, (order) => order.client?.name || 'Без клиента');
  const byDate = aggregateBy(safeOrders, (order) => order.dates?.created || 'Без даты');

  return {
    total,
    deliveredRevenue,
    average: safeOrders.length ? Math.round(total / safeOrders.length) : 0,
    byStatus,
    byVehicle,
    byClient,
    byDate,
  };
}

export function ordersToRows(orders) {
  return (orders || []).map((order) => ({
    id: order.id,
    status: order.status,
    created_at: order.dates?.created || '',
    pickup_at: order.dates?.pickup || '',
    delivery_at: order.dates?.delivery || '',
    client: order.client?.name || '',
    from: order.from?.name || '',
    to: order.to?.name || '',
    cargo_type: order.cargo?.type || '',
    cargo_weight_t: order.cargo?.weight ?? '',
    vehicle: order.vehicle || '',
    price: order.price ?? 0,
    driver: order.driver?.name || '',
  }));
}

export function revenueRowsByGroup(groupedRevenue, groupKey) {
  return groupedRevenue.map((item) => ({
    [groupKey]: item.label,
    orders: item.orders,
    revenue: item.revenue,
  }));
}

export function downloadCsv(filename, rows) {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
  ].join('\n');

  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function aggregateBy(items, getLabel) {
  const bucket = new Map();

  items.forEach((item) => {
    const label = getLabel(item);
    const current = bucket.get(label) || { label, revenue: 0, orders: 0 };
    current.revenue += Number(item.price || 0);
    current.orders += 1;
    bucket.set(label, current);
  });

  return [...bucket.values()].sort((a, b) => b.revenue - a.revenue);
}

function escapeCsvValue(value) {
  const str = String(value ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
