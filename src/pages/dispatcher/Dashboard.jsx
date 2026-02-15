import { useState } from 'react';
import MapView from '../../components/MapView';
import { MOCK_ORDERS, ORDER_STATUSES, MOCK_DRIVERS } from '../../data/mockOrders';

export default function DispatcherDashboard() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState('orders');

  const stats = {
    total: MOCK_ORDERS.length,
    active: MOCK_ORDERS.filter(o => ['in_transit', 'loading'].includes(o.status)).length,
    pending: MOCK_ORDERS.filter(o => o.status === 'pending').length,
    delivered: MOCK_ORDERS.filter(o => o.status === 'delivered').length,
    revenue: MOCK_ORDERS.reduce((sum, o) => sum + o.price, 0),
    driversOnline: MOCK_DRIVERS.filter(d => d.status !== 'offline').length,
  };

  const mapPoints = MOCK_DRIVERS.filter(d => d.status !== 'offline').map(d => ({
    lat: d.location.lat,
    lng: d.location.lng,
    type: 'truck',
    popup: `<b>${d.name}</b><br/>${d.truck} ${d.plate}<br/>${d.status === 'busy' ? 'Занят' : 'Свободен'}`,
  }));

  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Всего заказов', value: stats.total, color: 'text-gray-900 dark:text-white' },
          { label: 'В пути', value: stats.active, color: 'text-accent' },
          { label: 'Новые', value: stats.pending, color: 'text-blue-600' },
          { label: 'Доставлено', value: stats.delivered, color: 'text-emerald-600' },
          { label: 'Выручка', value: `${(stats.revenue / 1000).toFixed(0)}K`, color: 'text-amber-600' },
          { label: 'Водители', value: `${stats.driversOnline}/${MOCK_DRIVERS.length}`, color: 'text-violet-600' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 space-y-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'orders', label: 'Заказы' },
              { id: 'drivers', label: 'Водители' },
              { id: 'analytics', label: 'Аналитика' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${tab === t.id ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'orders' && (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {MOCK_ORDERS.map(order => {
                const st = ORDER_STATUSES[order.status];
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <button key={order.id} onClick={() => setSelectedOrder(order)}
                    className={`card p-3 w-full text-left transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-accent' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-accent">{order.id}</span>
                      <span className={`badge-${st.color}`}>{st.label}</span>
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                      {order.from.name.split(',')[0]} &rarr; {order.to.name.split(',')[0]}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{order.cargo.type} &middot; {order.cargo.weight}&#1090;</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{order.price.toLocaleString()} &#8381;</span>
                    </div>
                    {order.driver && (
                      <div className="mt-1.5 text-xs text-gray-500">{order.driver.name} &middot; {order.driver.truck.split(',')[0]}</div>
                    )}
                    {!order.driver && order.status === 'pending' && (
                      <div className="mt-2">
                        <button className="text-xs bg-accent text-white px-3 py-1 rounded-md" onClick={e => e.stopPropagation()}>
                          Назначить водителя
                        </button>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'drivers' && (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {MOCK_DRIVERS.map(driver => (
                <div key={driver.id} className="card p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{driver.name}</span>
                        <span className={`w-2 h-2 rounded-full ${driver.status === 'available' ? 'bg-emerald-500' : driver.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                      </div>
                      <div className="text-xs text-gray-500">{driver.truck} &middot; {driver.plate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">{driver.rating}</div>
                      <div className="text-xs text-gray-500">{driver.trips} рейсов</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'analytics' && (
            <div className="space-y-3">
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Выручка по дням</h3>
                <div className="flex items-end justify-around h-32 gap-2">
                  {[85, 92, 60, 75, 95, 88, 70].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">{Math.round(v * 3.2)}K</span>
                      <div className="w-full rounded-t bg-accent transition-all" style={{ height: `${v}%` }} />
                      <span className="text-[10px] text-gray-400">{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Загрузка автопарка</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Тентованные', used: 12, total: 15 },
                    { label: 'Рефрижераторы', used: 3, total: 5 },
                    { label: 'Бортовые', used: 4, total: 8 },
                    { label: 'Малотоннажные', used: 6, total: 10 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{item.used}/{item.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(item.used / item.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="stat-card items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">98.2%</span>
                  <span className="text-xs text-gray-500">Вовремя</span>
                </div>
                <div className="stat-card items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">4.7</span>
                  <span className="text-xs text-gray-500">Средняя оценка</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="card overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                Мониторинг транспорта
                <span className="badge-success">{stats.driversOnline} онлайн</span>
              </h3>
            </div>
            <MapView points={mapPoints} height="500px" zoom={4} center={[55.75, 50]} />
          </div>

          {selectedOrder && (
            <div className="card p-4 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-500">Откуда</span>
                  <div className="text-gray-900 dark:text-white">{selectedOrder.from.name}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Куда</span>
                  <div className="text-gray-900 dark:text-white">{selectedOrder.to.name}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Груз</span>
                  <div className="text-gray-900 dark:text-white">{selectedOrder.cargo.type}, {selectedOrder.cargo.weight}&#1090;</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Стоимость</span>
                  <div className="text-gray-900 dark:text-white font-semibold">{selectedOrder.price.toLocaleString()} &#8381;</div>
                </div>
              </div>
              {selectedOrder.driver && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs text-gray-500">Водитель: </span>
                  <span className="text-sm text-gray-900 dark:text-white">{selectedOrder.driver.name} — {selectedOrder.driver.truck}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
