export function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

export function shipmentStatusLabel(status) {
  const map = {
    new: 'Новая',
    bidding: 'Торги',
    assigned: 'Назначена',
    in_transit: 'В пути',
    delivered: 'Доставлена',
  };
  return map[status] || status;
}

export function vehicleLabel(vehicle) {
  const map = {
    tent: 'Тент',
    ref: 'Рефрижератор',
    board: 'Борт',
  };
  return map[vehicle] || vehicle;
}

export function getMarketplaceMetrics(shipments, bids) {
  const safeShipments = shipments || [];
  const safeBids = bids || [];

  const activeTenders = safeShipments.filter((s) => s.status === 'bidding').length;
  const inTransit = safeShipments.filter((s) => s.status === 'in_transit').length;
  const totalBudget = safeShipments.reduce((sum, s) => sum + Number(s.budget || 0), 0);
  const avgBid = safeBids.length
    ? Math.round(safeBids.reduce((sum, bid) => sum + Number(bid.amount || 0), 0) / safeBids.length)
    : 0;

  return {
    activeTenders,
    inTransit,
    totalBudget,
    avgBid,
  };
}

export function generateBidId(bids) {
  const next = (bids || []).length + 1;
  return `BID-${String(next).padStart(2, '0')}`;
}
