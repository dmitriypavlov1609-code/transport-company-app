import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS, ORDER_STATUSES } from '../../data/mockOrders';
import { VEHICLE_TYPES } from '../../utils/calculator';

export default function DriverFeed() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all');
  const [showAccepted, setShowAccepted] = useState(null);

  const availableOrders = MOCK_ORDERS.filter(o => o.status === 'pending');
  const myOrders = MOCK_ORDERS.filter(o => o.driver && ['loading', 'in_transit'].includes(o.status));

  const accept = (orderId) => {
    setShowAccepted(orderId);
    setTimeout(() => {
      setShowAccepted(null);
      navigate('/driver/active');
    }, 2000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* My active orders */}
      {myOrders.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            🚛 Мои рейсы <span className="badge-success">{myOrders.length}</span>
          </h2>
          {myOrders.map(order => {
            const st = ORDER_STATUSES[order.status];
            return (
              <button key={order.id} onClick={() => navigate('/driver/active')}
                className="card p-4 w-full text-left mb-2 border-l-4 border-l-primary hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary">{order.id}</span>
                  <span className={`badge-${st.color}`}>{st.icon} {st.label}</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {order.from.name.split(',')[0]} → {order.to.name.split(',')[0]}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{order.cargo.type} • {order.cargo.weight} т</span>
                  <span className="text-sm font-bold text-accent">{order.price.toLocaleString()} ₽</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Available orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📋 Доступные заказы <span className="badge-info">{availableOrders.length}</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {['all', 'tent', 'ref', 'board'].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filterType === t ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
              {t === 'all' ? 'Все' : VEHICLE_TYPES.find(v => v.id === t)?.name || t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {availableOrders.map(order => {
            const vehicle = VEHICLE_TYPES.find(v => v.id === order.vehicle);
            const isAccepted = showAccepted === order.id;

            if (isAccepted) {
              return (
                <div key={order.id} className="card p-6 text-center animate-fade-in">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="font-bold text-gray-900 dark:text-white">Заказ принят!</div>
                  <div className="text-sm text-gray-500 mt-1">Переход к управлению рейсом...</div>
                </div>
              );
            }

            return (
              <div key={order.id} className="card p-4 animate-slide-up">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{order.id}</span>
                    <span className="badge-info">{vehicle?.icon} {vehicle?.name}</span>
                  </div>
                  <span className="text-lg font-bold text-accent">{order.price.toLocaleString()} ₽</span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{order.from.name}</div>
                      <div className="text-xs text-gray-500">{order.dates.pickup}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{order.to.name}</div>
                      <div className="text-xs text-gray-500">{order.dates.delivery}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span>📦 {order.cargo.type}</span>
                  <span>⚖️ {order.cargo.weight} т</span>
                  <span>📐 {order.cargo.volume} м³</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => accept(order.id)} className="btn-primary flex-1 py-2 text-sm">
                    ✅ Принять
                  </button>
                  <button className="btn-outline flex-1 py-2 text-sm">
                    💬 Предложить цену
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
