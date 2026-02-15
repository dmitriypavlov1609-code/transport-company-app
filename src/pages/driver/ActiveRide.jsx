import { useState, useEffect } from 'react';
import MapView from '../../components/MapView';
import { MOCK_ORDERS } from '../../data/mockOrders';
import { getRoute } from '../../utils/routing';

const STATUSES = [
  { id: 'departed', label: 'Выехал на погрузку', next: 'На погрузке' },
  { id: 'at_loading', label: 'На погрузке', next: 'Загружен' },
  { id: 'loaded', label: 'Загружен', next: 'В пути' },
  { id: 'in_transit', label: 'В пути', next: 'На выгрузке' },
  { id: 'at_unloading', label: 'На выгрузке', next: 'Выгружен' },
  { id: 'unloaded', label: 'Выгружен', next: 'Завершить' },
  { id: 'completed', label: 'Завершён', next: null },
];

export default function ActiveRide() {
  const order = MOCK_ORDERS.find(o => o.status === 'in_transit');
  const [statusIdx, setStatusIdx] = useState(3); // in_transit
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [showPhoto, setShowPhoto] = useState(false);
  const [idleTimer, setIdleTimer] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (!order) return;
    getRoute(order.from.lat, order.from.lng, order.to.lat, order.to.lng).then(route => {
      if (route) setRouteGeometry(route.geometry);
    });
  }, []);

  useEffect(() => {
    if (!isIdle) return;
    const interval = setInterval(() => setIdleTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isIdle]);

  if (!order) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Нет активных рейсов</h2>
        <p className="text-sm text-gray-500">Примите заказ из ленты</p>
      </div>
    );
  }

  const currentStatus = STATUSES[statusIdx];
  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const mapPoints = [
    { lat: order.from.lat, lng: order.from.lng, color: '#1A73E8', label: 'А' },
    { lat: order.to.lat, lng: order.to.lng, color: '#00C853', label: 'Б' },
  ];
  if (order.currentLocation) {
    mapPoints.push({ lat: order.currentLocation.lat, lng: order.currentLocation.lng, type: 'truck' });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Order info */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary">{order.id}</span>
          <span className="text-lg font-bold text-accent">{order.price.toLocaleString()} ₽</span>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {order.from.name.split(',')[0]} → {order.to.name.split(',')[0]}
        </div>
        <div className="text-xs text-gray-500 mt-1">{order.cargo.type} • {order.cargo.weight} т</div>
      </div>

      {/* Map */}
      <div className="card overflow-hidden">
        <MapView points={mapPoints} routeGeometry={routeGeometry} height="250px" />
      </div>

      {/* Status progress */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Статус рейса</h3>
        <div className="flex gap-1 mb-3">
          {STATUSES.map((s, i) => (
            <div key={s.id} className={`flex-1 h-2 rounded-full transition-all ${i <= statusIdx ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{currentStatus.label}</div>
        </div>

        {statusIdx < STATUSES.length - 1 && (
          <button
            onClick={() => setStatusIdx(statusIdx + 1)}
            className="btn-primary w-full mt-4"
          >
            → {STATUSES[statusIdx].next}
          </button>
        )}
        {statusIdx === STATUSES.length - 1 && (
          <div className="text-center mt-4 text-success font-semibold text-lg">Рейс завершён</div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setShowPhoto(!showPhoto)} className="card p-3 text-center hover:shadow-lg transition-all active:scale-95">
          <div className="flex justify-center mb-1 text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Фотофиксация</div>
        </button>
        <button onClick={() => setIsIdle(!isIdle)} className={`card p-3 text-center hover:shadow-lg transition-all active:scale-95 ${isIdle ? 'border-2 border-warning' : ''}`}>
          <div className="flex justify-center mb-1 text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {isIdle ? `Простой ${formatTime(idleTimer)}` : 'Простой'}
          </div>
        </button>
        <button className="card p-3 text-center hover:shadow-lg transition-all active:scale-95">
          <div className="flex justify-center mb-1 text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Чат</div>
        </button>
        <button className="card p-3 text-center hover:shadow-lg transition-all active:scale-95 border-2 border-danger">
          <div className="flex justify-center mb-1 text-danger"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <div className="text-xs font-medium text-danger">SOS</div>
        </button>
      </div>

      {/* Photo capture UI */}
      {showPhoto && (
        <div className="card p-4 animate-slide-up">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Фотофиксация</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {['Груз', 'Пломба', 'ТС'].map(label => (
              <button key={label} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-primary transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Client info */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Клиент</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{order.client.name}</div>
            <div className="text-xs text-gray-500">{order.client.contact}</div>
          </div>
          <button className="btn-primary py-2 px-4 text-sm">Позвонить</button>
        </div>
      </div>
    </div>
  );
}
