import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS, ORDER_STATUSES } from '../../data/mockOrders';
import { VEHICLE_TYPES } from '../../utils/calculator';

export default function DriverFeed() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all');
  const [showAccepted, setShowAccepted] = useState(null);

  const availableOrders = MOCK_ORDERS.filter((o) => o.status === 'pending' && (filterType === 'all' || o.vehicle === filterType));
  const myOrders = MOCK_ORDERS.filter((o) => o.driver && ['loading', 'in_transit'].includes(o.status));

  const accept = (orderId) => {
    setShowAccepted(orderId);
    setTimeout(() => {
      setShowAccepted(null);
      navigate('/driver/active');
    }, 1100);
  };

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">driver operations</p>
        <h2 className="text-2xl font-semibold mt-1">Рабочая лента водителя</h2>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="ops-kpi rounded-lg p-3">
            <p className="ops-chip text-[10px] text-slate-400">active trips</p>
            <p className="text-lg font-semibold mt-1">{myOrders.length}</p>
          </div>
          <div className="ops-kpi rounded-lg p-3">
            <p className="ops-chip text-[10px] text-slate-400">open orders</p>
            <p className="text-lg font-semibold mt-1">{availableOrders.length}</p>
          </div>
          <div className="ops-kpi rounded-lg p-3">
            <p className="ops-chip text-[10px] text-slate-400">rating</p>
            <p className="text-lg font-semibold mt-1">4.8</p>
          </div>
        </div>
      </section>

      {myOrders.length > 0 && (
        <section className="ops-panel rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Мои текущие рейсы</h3>
          <div className="space-y-2">
            {myOrders.map((order) => {
              const st = ORDER_STATUSES[order.status];
              return (
                <button key={order.id} onClick={() => navigate('/driver/active')} className="ops-soft-card rounded-lg p-3 w-full text-left border-l-4 border-l-blue-800">
                  <div className="flex items-center justify-between">
                    <span className="ops-chip text-[10px] text-blue-900">{order.id}</span>
                    <span className={`badge-${st.color}`}>{st.label}</span>
                  </div>
                  <p className="text-sm text-slate-800 mt-2">{order.from.name.split(',')[0]} → {order.to.name.split(',')[0]}</p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="ops-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Новые доступные заказы</h3>
          <span className="ops-chip text-[10px] text-slate-500">{availableOrders.length} items</span>
        </div>

        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {['all', 'tent', 'ref', 'board'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border ${filterType === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300'}`}
            >
              {t === 'all' ? 'Все типы' : VEHICLE_TYPES.find((v) => v.id === t)?.name || t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {availableOrders.map((order) => {
            const vehicle = VEHICLE_TYPES.find((v) => v.id === order.vehicle);
            if (showAccepted === order.id) {
              return <div key={order.id} className="ops-soft-card rounded-lg p-3 text-sm text-emerald-700 font-medium">Заказ принят. Переход к рейсу...</div>;
            }
            return (
              <div key={order.id} className="ops-soft-card rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="ops-chip text-[10px] text-blue-900">{order.id}</span>
                  <span className="text-sm font-semibold text-slate-900">{order.price.toLocaleString()} ₽</span>
                </div>
                <p className="text-sm text-slate-800 mt-2">{order.from.name.split(',')[0]} → {order.to.name.split(',')[0]}</p>
                <p className="text-xs text-slate-500 mt-1">{vehicle?.name} • {order.cargo.weight} т • {order.cargo.volume} м³</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={() => accept(order.id)} className="bg-slate-900 hover:bg-black text-white text-sm rounded-md py-2 transition-colors">Принять</button>
                  <button className="border border-slate-300 text-slate-700 text-sm rounded-md py-2 hover:bg-slate-50 transition-colors">Предложить цену</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
