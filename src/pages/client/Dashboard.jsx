import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS, ORDER_STATUSES } from '../../data/mockOrders';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const activeOrders = MOCK_ORDERS.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const lastDelivered = MOCK_ORDERS.find(o => o.status === 'delivered');

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/client/calculator')} className="card p-4 text-left hover:shadow-lg transition-all active:scale-95">
          <div className="text-3xl mb-2">🧮</div>
          <div className="font-bold text-sm text-gray-900 dark:text-white">Калькулятор</div>
          <div className="text-xs text-gray-500 mt-1">Рассчитать стоимость</div>
        </button>
        <button onClick={() => navigate('/client/order')} className="card p-4 text-left hover:shadow-lg transition-all active:scale-95">
          <div className="text-3xl mb-2">📝</div>
          <div className="font-bold text-sm text-gray-900 dark:text-white">Новый заказ</div>
          <div className="text-xs text-gray-500 mt-1">Оформить перевозку</div>
        </button>
      </div>

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            🚛 Активные перевозки
            <span className="badge-info">{activeOrders.length}</span>
          </h2>
          <div className="space-y-3">
            {activeOrders.map(order => {
              const st = ORDER_STATUSES[order.status];
              return (
                <button
                  key={order.id}
                  onClick={() => navigate(`/client/tracking/${order.id}`)}
                  className="card p-4 w-full text-left hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-primary">{order.id}</span>
                    <span className={`badge-${st.color}`}>{st.icon} {st.label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{order.from.name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{order.to.name}</span>
                    </div>
                  </div>
                  {order.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{order.cargo.type}</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${order.progress}%` }} />
                      </div>
                    </div>
                  )}
                  {order.driver && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">👤</div>
                      <div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white">{order.driver.name}</div>
                        <div className="text-xs text-gray-500">{order.driver.truck}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-xs text-yellow-600">
                        ⭐ {order.driver.rating}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Last delivered */}
      {lastDelivered && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">✅ Последняя доставка</h2>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500">{lastDelivered.id}</span>
              <span className="badge-success">Доставлен</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{lastDelivered.from.name} → {lastDelivered.to.name}</div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-bold text-gray-900 dark:text-white">{lastDelivered.price.toLocaleString()} ₽</span>
              <span className="text-xs text-gray-500">{lastDelivered.dates.delivery}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card items-center">
          <span className="text-2xl">📦</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">47</span>
          <span className="text-xs text-gray-500">Всего заказов</span>
        </div>
        <div className="stat-card items-center">
          <span className="text-2xl">🛣</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">28,400</span>
          <span className="text-xs text-gray-500">км пройдено</span>
        </div>
        <div className="stat-card items-center">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">1.2М</span>
          <span className="text-xs text-gray-500">Потрачено ₽</span>
        </div>
      </div>
    </div>
  );
}
