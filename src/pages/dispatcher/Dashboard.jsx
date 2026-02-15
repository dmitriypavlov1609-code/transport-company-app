import { useState } from 'react';
import MapView from '../../components/MapView';
import { MOCK_ORDERS, ORDER_STATUSES, MOCK_DRIVERS } from '../../data/mockOrders';

export default function DispatcherDashboard() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState('orders'); // 'orders' | 'drivers' | 'analytics'

  const stats = {
    total: MOCK_ORDERS.length,
    active: MOCK_ORDERS.filter(o => ['in_transit', 'loading'].includes(o.status)).length,
    pending: MOCK_ORDERS.filter(o => o.status === 'pending').length,
    delivered: MOCK_ORDERS.filter(o => o.status === 'delivered').length,
    revenue: MOCK_ORDERS.reduce((sum, o) => sum + o.price, 0),
    driversOnline: MOCK_DRIVERS.filter(d => d.status !== 'offline').length,
  };

  // Map points: all drivers + order points
  const mapPoints = MOCK_DRIVERS.filter(d => d.status !== 'offline').map(d => ({
    lat: d.location.lat,
    lng: d.location.lng,
    type: 'truck',
    popup: `<b>${d.name}</b><br/>${d.truck} ${d.plate}<br/>⭐ ${d.rating} • ${d.status === 'busy' ? '🔴 Занят' : '🟢 Свободен'}`,
  }));

  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Всего заказов', value: stats.total, icon: '📦', color: 'text-primary' },
          { label: 'В пути', value: stats.active, icon: '🚛', color: 'text-accent' },
          { label: 'Новые', value: stats.pending, icon: '📋', color: 'text-blue-500' },
          { label: 'Доставлено', value: stats.delivered, icon: '✅', color: 'text-success' },
          { label: 'Выручка', value: `${(stats.revenue / 1000).toFixed(0)}K`, icon: '💰', color: 'text-yellow-600' },
          { label: 'Водители', value: `${stats.driversOnline}/${MOCK_DRIVERS.length}`, icon: '👥', color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-xl">{s.icon}</span>
              <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left: Orders / Drivers list */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {[
              { id: 'orders', label: '📋 Заказы' },
              { id: 'drivers', label: '🚛 Водители' },
              { id: 'analytics', label: '📊 Аналитика' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Orders tab */}
          {tab === 'orders' && (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {MOCK_ORDERS.map(order => {
                const st = ORDER_STATUSES[order.status];
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <button key={order.id} onClick={() => setSelectedOrder(order)}
                    className={`card p-3 w-full text-left transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-primary">{order.id}</span>
                      <span className={`badge-${st.color}`}>{st.icon} {st.label}</span>
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                      {order.from.name.split(',')[0]} → {order.to.name.split(',')[0]}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{order.cargo.type} • {order.cargo.weight}т</span>
                      <span className="font-bold text-gray-900 dark:text-white">{order.price.toLocaleString()} ₽</span>
                    </div>
                    {order.driver && (
                      <div className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                        👤 {order.driver.name} • {order.driver.truck.split(',')[0]}
                      </div>
                    )}
                    {!order.driver && order.status === 'pending' && (
                      <div className="mt-2 flex gap-2">
                        <button className="text-xs bg-primary text-white px-3 py-1 rounded-lg" onClick={e => e.stopPropagation()}>
                          Назначить водителя
                        </button>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Drivers tab */}
          {tab === 'drivers' && (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {MOCK_DRIVERS.map(driver => (
                <div key={driver.id} className="card p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">👤</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{driver.name}</span>
                        <span className={`w-2 h-2 rounded-full ${driver.status === 'available' ? 'bg-success' : driver.status === 'busy' ? 'bg-accent' : 'bg-gray-400'}`} />
                      </div>
                      <div className="text-xs text-gray-500">{driver.truck} • {driver.plate}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-yellow-600">⭐ {driver.rating}</div>
                      <div className="text-xs text-gray-500">{driver.trips} рейсов</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics tab */}
          {tab === 'analytics' && (
            <div className="space-y-3">
              <div className="card p-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">📊 Выручка по дням</h3>
                <div className="flex items-end justify-around h-32 gap-2">
                  {[85, 92, 60, 75, 95, 88, 70].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">{Math.round(v * 3.2)}K</span>
                      <div className="w-full rounded-t-md bg-primary transition-all" style={{ height: `${v}%` }} />
                      <span className="text-[10px] text-gray-400">{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">🚛 Загрузка автопарка</h3>
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
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(item.used / item.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="stat-card items-center">
                  <span className="text-xl">⏱</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">98.2%</span>
                  <span className="text-xs text-gray-500">Вовремя</span>
                </div>
                <div className="stat-card items-center">
                  <span className="text-xl">⭐</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">4.7</span>
                  <span className="text-xs text-gray-500">Средняя оценка</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🗺 Мониторинг транспорта
                <span className="badge-success">{stats.driversOnline} онлайн</span>
              </h3>
            </div>
            <MapView points={mapPoints} height="500px" zoom={4} center={[55.75, 50]} />
          </div>

          {/* Selected order details */}
          {selectedOrder && (
            <div className="card p-4 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
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
                  <div className="text-gray-900 dark:text-white">{selectedOrder.cargo.type}, {selectedOrder.cargo.weight}т</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Стоимость</span>
                  <div className="text-gray-900 dark:text-white font-bold">{selectedOrder.price.toLocaleString()} ₽</div>
                </div>
              </div>
              {selectedOrder.driver && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
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
