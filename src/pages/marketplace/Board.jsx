import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  formatMoney,
  getMarketplaceMetrics,
  shipmentStatusLabel,
  vehicleLabel,
} from '../../utils/marketplace';

export default function MarketplaceBoard() {
  const { shipments, bids, bidMapByShipment, carriers, placeBid } = useOutletContext();
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [activeBidForm, setActiveBidForm] = useState('');
  const [form, setForm] = useState({ carrierId: '', amount: '', etaHours: '', note: '' });

  const metrics = useMemo(() => getMarketplaceMetrics(shipments, bids), [shipments, bids]);

  const visibleShipments = shipments.filter((shipment) => {
    if (filterVehicle !== 'all' && shipment.vehicle !== filterVehicle) return false;
    return ['bidding', 'new', 'assigned', 'in_transit'].includes(shipment.status);
  });

  function submitBid(shipmentId) {
    const carrier = carriers.find((item) => item.id === form.carrierId);
    const amount = Number(form.amount || 0);
    const etaHours = Number(form.etaHours || 0);

    if (!carrier || amount <= 0 || etaHours <= 0) return;

    placeBid({
      shipmentId,
      carrierId: carrier.id,
      carrierName: carrier.name,
      amount,
      etaHours,
      note: form.note || 'Без комментария',
    });

    setForm({ carrierId: '', amount: '', etaHours: '', note: '' });
    setActiveBidForm('');
  }

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">marketplace / load board</p>
        <h2 className="text-2xl font-semibold mt-1">Биржа грузов</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <Metric label="Активные торги" value={String(metrics.activeTenders)} />
          <Metric label="Ставок всего" value={String(bids.length)} />
          <Metric label="Бюджет пула" value={formatMoney(metrics.totalBudget)} />
          <Metric label="Средняя ставка" value={formatMoney(metrics.avgBid)} />
        </div>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Лента заявок</h3>
          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="input-field max-w-48"
          >
            <option value="all">Все типы авто</option>
            <option value="tent">Тент</option>
            <option value="ref">Рефрижератор</option>
            <option value="board">Борт</option>
          </select>
        </div>

        <div className="space-y-3">
          {visibleShipments.map((shipment) => {
            const bidsCount = bidMapByShipment[shipment.id]?.length || 0;
            const isOpen = activeBidForm === shipment.id;

            return (
              <div key={shipment.id} className="ops-soft-card rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{shipment.id} · {shipment.from} {'->'} {shipment.to}</p>
                    <p className="text-xs text-slate-500 mt-1">{shipment.cargo} · {shipment.weightT} т · {vehicleLabel(shipment.vehicle)}</p>
                    <p className="text-xs text-slate-500">Погрузка: {shipment.pickupDate} · Заказчик: {shipment.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatMoney(shipment.budget)}</p>
                    <span className="badge-info">{shipmentStatusLabel(shipment.status)}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Ставок: {bidsCount}</p>
                  {shipment.status === 'bidding' && (
                    <button onClick={() => setActiveBidForm(isOpen ? '' : shipment.id)} className="btn-outline py-1.5 px-3">
                      {isOpen ? 'Скрыть форму' : 'Подать ставку'}
                    </button>
                  )}
                </div>

                {isOpen && (
                  <div className="grid sm:grid-cols-2 gap-2 mt-3">
                    <select
                      className="input-field"
                      value={form.carrierId}
                      onChange={(e) => setForm((prev) => ({ ...prev, carrierId: e.target.value }))}
                    >
                      <option value="">Выберите перевозчика</option>
                      {carriers.map((carrier) => (
                        <option key={carrier.id} value={carrier.id}>{carrier.name} ({carrier.rating})</option>
                      ))}
                    </select>
                    <input
                      className="input-field"
                      type="number"
                      placeholder="Ставка, ₽"
                      value={form.amount}
                      onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                    />
                    <input
                      className="input-field"
                      type="number"
                      placeholder="ETA, часы"
                      value={form.etaHours}
                      onChange={(e) => setForm((prev) => ({ ...prev, etaHours: e.target.value }))}
                    />
                    <input
                      className="input-field"
                      placeholder="Комментарий"
                      value={form.note}
                      onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                    />
                    <button onClick={() => submitBid(shipment.id)} className="btn-primary sm:col-span-2">Отправить ставку</button>
                  </div>
                )}
              </div>
            );
          })}
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
