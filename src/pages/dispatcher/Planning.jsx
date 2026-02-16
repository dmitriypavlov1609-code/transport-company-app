import { useMemo, useState } from 'react';
import { MOCK_ORDERS, MOCK_DRIVERS } from '../../data/mockOrders';
import { formatCurrency } from '../../utils/reporting';
import {
  buildTrips,
  countTripsByDriver,
  getInitialAssignments,
  getPlanningMetrics,
} from '../../utils/tms';

export default function Planning() {
  const [assignments, setAssignments] = useState(() => getInitialAssignments(MOCK_ORDERS, MOCK_DRIVERS));
  const [driverChoice, setDriverChoice] = useState({});

  const trips = useMemo(() => buildTrips(MOCK_ORDERS, MOCK_DRIVERS, assignments), [assignments]);
  const metrics = useMemo(() => getPlanningMetrics(trips, MOCK_DRIVERS), [trips]);
  const driverLoad = useMemo(() => countTripsByDriver(trips), [trips]);

  const waitingTrips = trips.filter((trip) => trip.status === 'awaiting_assignment');

  function assignTrip(orderId) {
    const selectedDriver = Number(driverChoice[orderId]);
    if (!selectedDriver) return;

    setAssignments((prev) => ({ ...prev, [orderId]: selectedDriver }));
  }

  function unassignTrip(orderId) {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
  }

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">dispatch / planning board</p>
        <h2 className="text-2xl font-semibold mt-1">Планирование рейсов</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          <Metric label="Рейсов всего" value={String(metrics.totalTrips)} />
          <Metric label="Назначено" value={String(metrics.assignedTrips)} />
          <Metric label="Без водителя" value={String(metrics.unassignedTrips)} />
          <Metric label="Свободные водители" value={String(metrics.availableDrivers)} />
          <Metric label="Утилизация" value={`${metrics.utilization}%`} />
        </div>
      </section>

      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
        <div className="ops-panel rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Рейсы без назначения</h3>
            <span className="ops-chip text-[10px] text-slate-500">{waitingTrips.length} pending</span>
          </div>

          {waitingTrips.length === 0 ? (
            <div className="ops-soft-card rounded-lg p-4 text-sm text-emerald-700">Все рейсы уже назначены.</div>
          ) : (
            <div className="space-y-3">
              {waitingTrips.map((trip) => (
                <div key={trip.id} className="ops-soft-card rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{trip.orderId}</p>
                    <span className="text-xs text-slate-500">{formatCurrency(trip.price)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{trip.route}</p>
                  <p className="text-xs text-slate-500 mt-1">Подача: {trip.pickupAt || 'N/A'}</p>

                  <div className="grid sm:grid-cols-[1fr_auto] gap-2 mt-3">
                    <select
                      value={driverChoice[trip.orderId] || ''}
                      onChange={(e) => setDriverChoice((prev) => ({ ...prev, [trip.orderId]: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Выберите водителя</option>
                      {MOCK_DRIVERS.filter((driver) => driver.status !== 'offline').map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.truck})
                        </option>
                      ))}
                    </select>
                    <button onClick={() => assignTrip(trip.orderId)} className="btn-primary">Назначить</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ops-panel rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Загрузка водителей</h3>
          <div className="space-y-2">
            {MOCK_DRIVERS.map((driver) => (
              <div key={driver.id} className="ops-soft-card rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{driver.name}</p>
                    <p className="text-xs text-slate-500">{driver.truck} · {driver.status}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{driverLoad[driver.id] || 0} рейс(ов)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Реестр рейсов и назначений</h3>
        <div className="space-y-2">
          {trips.map((trip) => (
            <div key={trip.id} className="ops-soft-card rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{trip.orderId} · {trip.route}</p>
                <p className="text-xs text-slate-500">
                  {trip.driverName ? `Водитель: ${trip.driverName}` : 'Водитель не назначен'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="ops-chip text-[10px] text-slate-500 border border-slate-300 rounded px-2 py-1">{trip.status}</span>
                {trip.driverId && (
                  <button onClick={() => unassignTrip(trip.orderId)} className="btn-outline py-1.5 px-3">Снять</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="ops-kpi rounded-lg p-3">
      <p className="ops-chip text-[10px] text-slate-400">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
