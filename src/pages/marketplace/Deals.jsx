import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { formatMoney, shipmentStatusLabel } from '../../utils/marketplace';

export default function MarketplaceDeals() {
  const { shipments, bids, moveDealToTransit } = useOutletContext();

  const deals = useMemo(() => {
    const acceptedByShipment = bids.reduce((acc, bid) => {
      if (bid.status === 'accepted') {
        acc[bid.shipmentId] = bid;
      }
      return acc;
    }, {});

    return shipments.filter((shipment) => ['assigned', 'in_transit', 'delivered'].includes(shipment.status))
      .map((shipment) => ({
        shipment,
        bid: acceptedByShipment[shipment.id] || null,
      }));
  }, [shipments, bids]);

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">marketplace / deals control</p>
        <h2 className="text-2xl font-semibold mt-1">Сделки и исполнение</h2>
      </section>

      <section className="ops-panel rounded-xl p-4">
        {deals.length === 0 ? (
          <div className="ops-soft-card rounded-lg p-4 text-sm text-slate-600">Сделок пока нет.</div>
        ) : (
          <div className="space-y-2">
            {deals.map(({ shipment, bid }) => (
              <div key={shipment.id} className="ops-soft-card rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{shipment.id} · {shipment.from} {'->'} {shipment.to}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Перевозчик: {bid?.carrierName || 'Не определен'} · Груз: {shipment.cargo}
                    </p>
                    <p className="text-xs text-slate-500">Сумма: {formatMoney(bid?.amount || shipment.budget)}</p>
                  </div>

                  <div className="text-right">
                    <span className="badge-info">{shipmentStatusLabel(shipment.status)}</span>
                    {shipment.status === 'assigned' && (
                      <div className="mt-2">
                        <button onClick={() => moveDealToTransit(shipment.id)} className="btn-outline py-1.5 px-3">Перевести в путь</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
