export function getInitialAssignments(orders, drivers) {
  const driverByName = new Map((drivers || []).map((driver) => [driver.name, driver]));

  return (orders || []).reduce((acc, order) => {
    if (!order?.id || !order?.driver?.name) return acc;
    const matched = driverByName.get(order.driver.name);
    if (matched) {
      acc[order.id] = matched.id;
    }
    return acc;
  }, {});
}

export function buildTrips(orders, drivers, assignments) {
  const driverById = new Map((drivers || []).map((driver) => [driver.id, driver]));

  return (orders || []).map((order) => {
    const assignedDriverId = assignments?.[order.id] || null;
    const assignedDriver = assignedDriverId ? driverById.get(assignedDriverId) : null;

    return {
      id: `TRIP-${order.id}`,
      orderId: order.id,
      status: resolveTripStatus(order.status, assignedDriverId),
      route: `${shortLocation(order.from?.name)} -> ${shortLocation(order.to?.name)}`,
      price: Number(order.price || 0),
      pickupAt: order.dates?.pickup || '',
      deliveryAt: order.dates?.delivery || '',
      driverId: assignedDriverId,
      driverName: assignedDriver?.name || null,
      vehicle: assignedDriver?.truck || null,
    };
  });
}

export function getPlanningMetrics(trips, drivers) {
  const safeTrips = trips || [];
  const safeDrivers = drivers || [];

  const assigned = safeTrips.filter((trip) => Boolean(trip.driverId));
  const unassigned = safeTrips.filter((trip) => !trip.driverId);
  const availableDrivers = safeDrivers.filter((driver) => driver.status === 'available').length;

  return {
    totalTrips: safeTrips.length,
    assignedTrips: assigned.length,
    unassignedTrips: unassigned.length,
    availableDrivers,
    utilization: safeDrivers.length ? Math.round((assigned.length / safeDrivers.length) * 100) : 0,
  };
}

export function countTripsByDriver(trips) {
  return (trips || []).reduce((acc, trip) => {
    if (!trip.driverId) return acc;
    acc[trip.driverId] = (acc[trip.driverId] || 0) + 1;
    return acc;
  }, {});
}

export function getSlaAlerts(orders, assignments) {
  const safeOrders = orders || [];

  const alerts = safeOrders.flatMap((order) => {
    const hasDriver = Boolean(assignments?.[order.id] || order.driver);
    const progress = Number(order.progress || 0);

    if (order.status === 'pending' && !hasDriver) {
      return [makeAlert(order, 'critical', 'Нет назначенного водителя', 'Рейс не готов к подаче.')];
    }

    if (order.status === 'pending' && hasDriver) {
      return [makeAlert(order, 'high', 'Ожидает старт рейса', 'Назначение есть, но заказ еще не запущен.')];
    }

    if (order.status === 'loading' && progress < 25) {
      return [makeAlert(order, 'high', 'Риск срыва погрузки', 'Низкий прогресс при статусе погрузки.')];
    }

    if (order.status === 'in_transit' && progress < 50) {
      return [makeAlert(order, 'medium', 'Отставание в пути', 'Темп исполнения ниже целевого SLA.')];
    }

    return [];
  });

  const rank = { critical: 3, high: 2, medium: 1 };
  return alerts.sort((a, b) => (rank[b.level] || 0) - (rank[a.level] || 0));
}

export function getMarginReport(orders) {
  const rows = (orders || []).map((order) => {
    const distanceKm = estimateDistanceKm(order.from, order.to);
    const rate = getVehicleRate(order.vehicle);
    const baseCost = 3500;
    const distanceCost = distanceKm * rate;
    const weightCost = Number(order.cargo?.weight || 0) * 900;
    const riskReserve = order.status === 'delivered' ? Number(order.price || 0) * 0.03 : Number(order.price || 0) * 0.08;
    const estimatedCost = Math.round(baseCost + distanceCost + weightCost + riskReserve);
    const revenue = Number(order.price || 0);
    const margin = revenue - estimatedCost;
    const marginPct = revenue ? Math.round((margin / revenue) * 1000) / 10 : 0;

    return {
      orderId: order.id,
      route: `${shortLocation(order.from?.name)} -> ${shortLocation(order.to?.name)}`,
      status: order.status,
      revenue,
      estimatedCost,
      margin,
      marginPct,
      distanceKm: Math.round(distanceKm),
      vehicle: order.vehicle,
    };
  });

  const totals = rows.reduce((acc, row) => {
    acc.revenue += row.revenue;
    acc.cost += row.estimatedCost;
    acc.margin += row.margin;
    return acc;
  }, { revenue: 0, cost: 0, margin: 0 });

  const avgMarginPct = totals.revenue ? Math.round((totals.margin / totals.revenue) * 1000) / 10 : 0;

  return {
    rows: rows.sort((a, b) => a.margin - b.margin),
    totals: {
      revenue: totals.revenue,
      cost: totals.cost,
      margin: totals.margin,
      avgMarginPct,
    },
  };
}

function resolveTripStatus(orderStatus, hasDriver) {
  if (['in_transit', 'loading', 'loaded', 'unloading'].includes(orderStatus)) return 'active';
  if (orderStatus === 'delivered') return 'done';
  if (orderStatus === 'cancelled') return 'cancelled';
  return hasDriver ? 'assigned' : 'awaiting_assignment';
}

function makeAlert(order, level, title, detail) {
  return {
    id: `sla-${order.id}-${level}`,
    orderId: order.id,
    level,
    title,
    detail,
    route: `${shortLocation(order.from?.name)} -> ${shortLocation(order.to?.name)}`,
    pickupAt: order.dates?.pickup || '',
  };
}

function estimateDistanceKm(from, to) {
  if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) return 0;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const earth = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earth * c;
}

function getVehicleRate(vehicle) {
  const map = {
    tent: 43,
    ref: 56,
    board: 39,
  };
  return map[vehicle] || 45;
}

function shortLocation(value) {
  if (!value) return 'N/A';
  return String(value).split(',')[0].trim();
}
