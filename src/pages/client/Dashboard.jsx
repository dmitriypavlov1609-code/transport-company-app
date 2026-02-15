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
        <button onClick={() => navigate('/client/calculator')} className="card p-4 text-left hover:shadow-md transition-all active:scale-[0.98]">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          </div>
          <div className="font-semibold text-sm text-gray-900 dark:text-white">Калькулятор</div>
          <div className="text-xs text-gray-500 mt-0.5">Рассчитать стоимость</div>
        </button>
        <button onClick={() => navigate('/client/order')} className="card p-4 text-left hover:shadow-md transition-all active:scale-[0.98]">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </div>
          <div className="font-semibold text-sm text-gray-900 dark:text-white">Новый заказ</div>
          <div className="text-xs text-gray-500 mt-0.5">Оформить перевозку</div>
        </button>
      </div>

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            Активные перевозки
            <span className="badge-info">{activeOrders.length}</span>
          </h2>
          <div className="space-y-3">
            {activeOrders.map(order => {
              const st = ORDER_STATUSES[order.status];
              return (
                <button
                  key={order.id}
                  onClick={() => navigate(`/client/tracking/${order.id}`)}
                  className="card p-4 w-full text-left hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-accent">{order.id}</span>
                    <span className={`badge-${st.color}`}>{st.label}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{order.from.name}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
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
                        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${order.progress}%` }} />
                      </div>
                    </div>
                  )}
                  {order.driver && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white">{order.driver.name}</div>
                        <div className="text-xs text-gray-500">{order.driver.truck}</div>
                      </div>
                      <div className="ml-auto text-xs text-gray-500">{order.driver.rating}</div>
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
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Последняя доставка</h2>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">{lastDelivered.id}</span>
              <span className="badge-success">Доставлен</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{lastDelivered.from.name} &rarr; {lastDelivered.to.name}</div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{lastDelivered.price.toLocaleString()} &#8381;</span>
              <span className="text-xs text-gray-500">{lastDelivered.dates.delivery}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Всего заказов', value: '47' },
          { label: 'км пройдено', value: '28,400' },
          { label: 'Потрачено', value: '1.2M ₽' },
        ].map(s => (
          <div key={s.label} className="stat-card items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</span>
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
