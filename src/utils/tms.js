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

function resolveTripStatus(orderStatus, hasDriver) {
  if (['in_transit', 'loading', 'loaded', 'unloading'].includes(orderStatus)) return 'active';
  if (orderStatus === 'delivered') return 'done';
  if (orderStatus === 'cancelled') return 'cancelled';
  return hasDriver ? 'assigned' : 'awaiting_assignment';
}

function shortLocation(value) {
  if (!value) return 'N/A';
  return String(value).split(',')[0].trim();
}
