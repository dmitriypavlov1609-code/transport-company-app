import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const ROLES = [
  {
    id: 'client',
    path: '/client',
    title: 'Клиент',
    subtitle: 'Заказать перевозку',
    description: 'Калькулятор стоимости, оформление заказа, отслеживание груза в реальном времени',
    features: ['Калькулятор стоимости', 'Отслеживание на карте', 'Онлайн-оплата', 'Документооборот'],
  },
  {
    id: 'driver',
    path: '/driver',
    title: 'Водитель',
    subtitle: 'Найти заказ',
    description: 'Лента заказов, навигация, управление рейсом, финансы',
    features: ['Лента заказов', 'Навигация', 'Фотофиксация', 'Вывод средств'],
  },
  {
    id: 'dispatcher',
    path: '/dispatcher',
    title: 'Диспетчер',
    subtitle: 'Управление',
    description: 'Дашборд, мониторинг автопарка, аналитика, CRM',
    features: ['Мониторинг рейсов', 'Управление автопарком', 'Аналитика', 'CRM'],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { setUser, darkMode, setDarkMode } = useApp();

  const selectRole = (role) => {
    setUser({ role: role.id, name: 'Demo User' });
    navigate(role.path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark">
      <div className="bg-primary text-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
          <div className="flex justify-end mb-8">
            <button onClick={() => setDarkMode(!darkMode)} className="text-white/50 hover:text-white p-2 transition-colors">
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">TransPort Pro</h1>
          <p className="text-gray-400 text-base max-w-md">Платформа управления грузоперевозками. Маршрутизация по реальным дорогам, отслеживание в реальном времени.</p>
          <div className="flex items-center gap-6 mt-8 text-xs text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              OSRM маршруты
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Яндекс Карты
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              GPS трекинг
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 pb-16 w-full">
        <div className="grid md:grid-cols-3 gap-4">
          {ROLES.map((role, i) => (
            <button
              key={role.id}
              onClick={() => selectRole(role)}
              className="card p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-slide-up group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                  {role.id === 'client' && <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>}
                  {role.id === 'driver' && <><path d="M10 17h4V5l-2-2-2 2v12z"/><path d="M6 17h12v4H6z"/><path d="M2 21h20"/></>}
                  {role.id === 'dispatcher' && <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>}
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">{role.title}</h2>
              <p className="text-sm text-accent font-medium mb-2">{role.subtitle}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{role.description}</p>
              <div className="space-y-1.5">
                {role.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <span className="text-accent text-sm font-medium group-hover:underline">
                  Войти &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Перевозок', value: '12,450+' },
            { label: 'Водителей', value: '890' },
            { label: 'Городов', value: '340+' },
            { label: 'Клиентов', value: '3,200+' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
