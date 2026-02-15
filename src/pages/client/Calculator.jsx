import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressInput from '../../components/AddressInput';
import MapView from '../../components/MapView';
import { getRoute } from '../../utils/routing';
import { VEHICLE_TYPES, URGENCY, SERVICES, calculateFare } from '../../utils/calculator';

export default function Calculator() {
  const navigate = useNavigate();
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [vehicleType, setVehicleType] = useState('tent');
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [urgency, setUrgency] = useState('standard');
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState(null);

  const toggleService = (id) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const calculate = useCallback(async () => {
    if (!from || !to) return;
    setLoading(true);
    try {
      const route = await getRoute(from.lat, from.lng, to.lat, to.lng);
      if (route) {
        setRouteGeometry(route.geometry);
        const fare = calculateFare({
          distanceKm: route.distanceKm,
          vehicleType,
          weight: parseFloat(weight) || 1,
          volume: parseFloat(volume) || 1,
          urgency,
          services: selectedServices,
        });
        setResult({ ...fare, distance: route.distanceKm, duration: route.durationHours, durationMin: route.durationMin });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [from, to, vehicleType, weight, volume, urgency, selectedServices]);

  const mapPoints = [];
  if (from) mapPoints.push({ lat: from.lat, lng: from.lng, color: '#1A73E8', label: 'А', popup: from.name });
  if (to) mapPoints.push({ lat: to.lat, lng: to.lng, color: '#00C853', label: 'Б', popup: to.name });

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">🧮 Калькулятор стоимости</h2>

      <div className="card overflow-hidden">
        <MapView points={mapPoints} routeGeometry={routeGeometry} height="200px" />
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Маршрут</h3>
        <AddressInput label="Откуда" value={from} onChange={setFrom} color="#1A73E8" />
        <AddressInput label="Куда" value={to} onChange={setTo} color="#00C853" />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Тип транспорта</h3>
        <div className="grid grid-cols-4 gap-2">
          {VEHICLE_TYPES.map(v => (
            <button key={v.id} onClick={() => setVehicleType(v.id)}
              className={`py-2 px-1 rounded-xl text-center transition-all text-xs ${vehicleType === v.id ? 'bg-primary text-white shadow-lg ring-2 ring-primary/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'}`}>
              <div className="text-lg mb-0.5">{v.icon}</div>
              <div className="font-medium leading-tight">{v.name}</div>
              <div className="text-[10px] mt-0.5 opacity-70">до {v.maxWeight}т</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Параметры груза</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Вес, тонн</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Объём, м³</label>
            <input type="number" value={volume} onChange={e => setVolume(e.target.value)} placeholder="0" className="input-field" />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Срочность</h3>
        <div className="grid grid-cols-3 gap-2">
          {URGENCY.map(u => (
            <button key={u.id} onClick={() => setUrgency(u.id)}
              className={`py-3 px-2 rounded-xl text-center transition-all ${urgency === u.id ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
              <div className="text-sm font-medium">{u.name}</div>
              <div className="text-xs mt-0.5 opacity-70">{u.days}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Доп. услуги</h3>
        <div className="space-y-2">
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => toggleService(s.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm ${selectedServices.includes(s.id) ? 'bg-primary/10 border-2 border-primary text-primary' : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent text-gray-600 dark:text-gray-400'}`}>
              <span>{s.name}</span>
              <span className="text-xs font-medium">{s.price ? `${s.price.toLocaleString()} ₽` : `${s.pricePercent}%`}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={calculate} disabled={!from || !to || loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>🧮 Рассчитать стоимость</>}
      </button>

      {result && (
        <div className="card p-5 space-y-4 animate-slide-up">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">Стоимость перевозки</div>
            <div className="text-4xl font-bold text-primary">{result.total.toLocaleString()} ₽</div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{result.distance}</div>
              <div className="text-xs text-gray-500">км</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{result.duration}</div>
              <div className="text-xs text-gray-500">часов</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{result.perKm}</div>
              <div className="text-xs text-gray-500">₽/км</div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Базовая стоимость</span><span>{result.base.toLocaleString()} ₽</span>
            </div>
            {result.extras > 0 && (
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Доп. услуги</span><span>{result.extras.toLocaleString()} ₽</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Итого</span><span>{result.total.toLocaleString()} ₽</span>
            </div>
          </div>
          <button onClick={() => navigate('/client/order')} className="btn-accent w-full">📝 Оформить заказ</button>
        </div>
      )}
    </div>
  );
}
