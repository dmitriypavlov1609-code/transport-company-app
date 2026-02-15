import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MOCK_ORDERS, ORDER_STATUSES } from '../../data/mockOrders';

export default function Orders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? MOCK_ORDERS
    : filter === 'active'
      ? MOCK_ORDERS.filter(o => !['delivered', 'cancelled'].includes(o.status))
      : MOCK_ORDERS.filter(o => o.status === 'delivered');

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">📋 Мои заказы</h2>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'Все' },
          { id: 'active', label: 'Активные' },
          { id: 'delivered', label: 'Завершённые' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map(order => {
          const st = ORDER_STATUSES[order.status];
          return (
            <button
              key={order.id}
              onClick={() => navigate(`/client/tracking/${order.id}`)}
              className="card p-4 w-full text-left hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">{order.id}</span>
                  <span className={`badge-${st.color}`}>{st.icon} {st.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{order.price.toLocaleString()} ₽</span>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{order.from.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{order.to.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{order.cargo.type} • {order.cargo.weight} т</span>
                <span>{order.dates.pickup?.split(' ')[0]}</span>
              </div>

              {order.progress > 0 && order.progress < 100 && (
                <div className="mt-2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${order.progress}%` }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
