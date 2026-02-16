import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS, ORDER_STATUSES } from '../../data/mockOrders';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const activeOrders = MOCK_ORDERS.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const lastDelivered = MOCK_ORDERS.find((o) => o.status === 'delivered');

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">client overview</p>
        <h2 className="text-2xl font-semibold mt-1">Личный кабинет клиента</h2>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Активных', value: activeOrders.length },
            { label: 'Доставлено', value: MOCK_ORDERS.filter((o) => o.status === 'delivered').length },
            { label: 'Сумма', value: '1.2M ₽' },
          ].map((k) => (
            <div key={k.label} className="ops-kpi rounded-lg p-3">
              <p className="ops-chip text-[10px] text-slate-400">{k.label}</p>
              <p className="text-lg font-semibold mt-1">{k.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-3">
        <button onClick={() => navigate('/client/calculator')} className="ops-panel rounded-xl p-4 text-left hover:-translate-y-0.5 transition">
          <p className="ops-chip text-[10px] text-slate-500">action / calc</p>
          <p className="text-lg font-semibold text-slate-900 mt-2">Рассчитать перевозку</p>
          <p className="text-sm text-slate-600 mt-1">Подобрать стоимость и сроки доставки.</p>
        </button>
        <button onClick={() => navigate('/client/order')} className="ops-panel rounded-xl p-4 text-left hover:-translate-y-0.5 transition">
          <p className="ops-chip text-[10px] text-slate-500">action / order</p>
          <p className="text-lg font-semibold text-slate-900 mt-2">Создать заказ</p>
          <p className="text-sm text-slate-600 mt-1">Оформить новую заявку на перевозку.</p>
        </button>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Активные перевозки</h3>
          <span className="ops-chip text-[10px] text-slate-500">{activeOrders.length} open</span>
        </div>
        <div className="space-y-3">
          {activeOrders.map((order) => {
            const st = ORDER_STATUSES[order.status];
            return (
              <button key={order.id} onClick={() => navigate(`/client/tracking/${order.id}`)} className="ops-soft-card rounded-lg p-3 w-full text-left hover:shadow transition">
                <div className="flex items-center justify-between">
                  <span className="ops-chip text-[10px] text-blue-900">{order.id}</span>
                  <span className={`badge-${st.color}`}>{st.label}</span>
                </div>
                <p className="text-sm text-slate-800 mt-2">{order.from.name.split(',')[0]} → {order.to.name.split(',')[0]}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>{order.cargo.type}</span>
                  <span>{order.price.toLocaleString()} ₽</span>
                </div>
                {order.progress > 0 && (
                  <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-800" style={{ width: `${order.progress}%` }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {lastDelivered && (
        <section className="ops-panel rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Последняя завершенная доставка</h3>
            <span className="badge-success">закрыт</span>
          </div>
          <p className="text-sm text-slate-700 mt-2">{lastDelivered.from.name.split(',')[0]} → {lastDelivered.to.name.split(',')[0]}</p>
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-slate-500">{lastDelivered.dates.delivery}</span>
            <span className="font-semibold text-slate-900">{lastDelivered.price.toLocaleString()} ₽</span>
          </div>
        </section>
      )}
    </div>
  );
}
