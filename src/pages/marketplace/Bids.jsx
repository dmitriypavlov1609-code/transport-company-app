import { useOutletContext } from 'react-router-dom';
import { formatMoney } from '../../utils/marketplace';

const STATUS_TEXT = {
  pending: 'Ожидает',
  accepted: 'Принята',
  rejected: 'Отклонена',
};

const STATUS_CLASS = {
  pending: 'badge-warning',
  accepted: 'badge-success',
  rejected: 'badge-danger',
};

export default function MarketplaceBids() {
  const { bids, shipments, acceptBid } = useOutletContext();

  function getShipment(shipmentId) {
    return shipments.find((shipment) => shipment.id === shipmentId);
  }

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">marketplace / bids desk</p>
        <h2 className="text-2xl font-semibold mt-1">Управление ставками</h2>
        <p className="text-sm text-slate-300 mt-3">Выберите лучшую ставку и зафиксируйте исполнителя.</p>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <div className="space-y-2">
          {bids.map((bid) => {
            const shipment = getShipment(bid.shipmentId);
            return (
              <div key={bid.id} className="ops-soft-card rounded-lg p-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{bid.id} · {bid.carrierName}</p>
                  <p className="text-xs text-slate-500 mt-1">Заявка: {bid.shipmentId} · {shipment?.from} {'->'} {shipment?.to}</p>
                  <p className="text-xs text-slate-500">Срок: {bid.etaHours} ч · {bid.note}</p>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-sm font-semibold text-slate-900">{formatMoney(bid.amount)}</p>
                  <span className={STATUS_CLASS[bid.status] || 'badge-info'}>{STATUS_TEXT[bid.status] || bid.status}</span>
                  {bid.status === 'pending' && shipment?.status === 'bidding' && (
                    <div>
                      <button onClick={() => acceptBid(bid.id)} className="btn-primary py-1.5 px-3">Принять</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
