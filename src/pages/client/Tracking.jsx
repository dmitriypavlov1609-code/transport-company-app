import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MapView from '../../components/MapView';
import { MOCK_ORDERS, ORDER_STATUSES } from '../../data/mockOrders';
import { getRoute } from '../../utils/routing';

export default function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = MOCK_ORDERS.find(o => o.id === id);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [tab, setTab] = useState('map'); // 'map' | 'timeline' | 'details'

  useEffect(() => {
    if (!order) return;
    getRoute(order.from.lat, order.from.lng, order.to.lat, order.to.lng).then(route => {
      if (route) setRouteGeometry(route.geometry);
    });
  }, [order]);

  if (!order) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <p className="text-gray-500">Заказ не найден</p>
        <button onClick={() => navigate('/client/orders')} className="btn-primary mt-4">К заказам</button>
      </div>
    );
  }

  const st = ORDER_STATUSES[order.status];
  const mapPoints = [
    { lat: order.from.lat, lng: order.from.lng, color: '#1A73E8', label: 'А', popup: `<b>Погрузка</b><br/>${order.from.name}` },
    { lat: order.to.lat, lng: order.to.lng, color: '#00C853', label: 'Б', popup: `<b>Выгрузка</b><br/>${order.to.name}` },
  ];
  if (order.currentLocation) {
    mapPoints.push({ lat: order.currentLocation.lat, lng: order.currentLocation.lng, type: 'truck', popup: `<b>${order.driver?.name}</b><br/>${order.driver?.truck}` });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{order.id}</h2>
          <span className={`badge-${st.color}`}>{st.label}</span>
        </div>
        <span className="text-2xl font-semibold text-primary">{order.price.toLocaleString()} ₽</span>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{order.from.name.split(',')[0]}</span>
          <span>{order.to.name.split(',')[0]}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000" style={{ width: `${order.progress}%` }} />
        </div>
        <div className="text-center mt-2 text-sm font-medium text-gray-900 dark:text-white">{order.progress}% выполнено</div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[
          { id: 'map', label: 'Карта' },
          { id: 'timeline', label: 'Статусы' },
          { id: 'details', label: 'Детали' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Map tab */}
      {tab === 'map' && (
        <div className="card overflow-hidden animate-fade-in">
          <MapView points={mapPoints} routeGeometry={routeGeometry} height="350px" />
        </div>
      )}

      {/* Timeline tab */}
      {tab === 'timeline' && (
        <div className="card p-4 animate-fade-in">
          <div className="space-y-0">
            {order.timeline.map((event, i) => {
              const isLast = i === order.timeline.length - 1;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isLast ? 'bg-primary animate-pulse-dot' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    {i < order.timeline.length - 1 && <div className="w-0.5 h-full min-h-[40px] bg-gray-200 dark:bg-gray-700" />}
                  </div>
                  <div className="pb-4">
                    <div className={`text-sm font-medium ${isLast ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>{event.text}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{event.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Details tab */}
      {tab === 'details' && (
        <div className="space-y-3 animate-fade-in">
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Груз</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Тип</span><span className="text-gray-900 dark:text-white">{order.cargo.type}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Вес</span><span className="text-gray-900 dark:text-white">{order.cargo.weight} т</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Объём</span><span className="text-gray-900 dark:text-white">{order.cargo.volume} м³</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Описание</span><span className="text-gray-900 dark:text-white text-right">{order.cargo.description}</span></div>
            </div>
          </div>

          {order.driver && (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Водитель</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{order.driver.name}</div>
                  <div className="text-xs text-gray-500">{order.driver.truck}</div>
                  <div className="flex items-center gap-1 text-xs text-yellow-600 mt-0.5">{order.driver.rating}</div>
                </div>
                <button className="btn-primary py-2 px-4 text-sm">Звонок</button>
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Документы</h3>
            <div className="space-y-2">
              {['Транспортная накладная', 'Договор-заявка', 'Акт выполненных работ'].map(doc => (
                <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                  <button className="text-xs text-primary font-medium">Скачать</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
