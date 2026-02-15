import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';

const ROLES = [
  {
    id: 'client',
    path: '/client',
    icon: '📱',
    title: 'Клиент',
    subtitle: 'Заказать перевозку',
    description: 'Калькулятор стоимости, оформление заказа, отслеживание груза в реальном времени',
    color: 'from-blue-500 to-blue-600',
    features: ['Калькулятор стоимости', 'Отслеживание на карте', 'Онлайн-оплата', 'Документооборот'],
  },
  {
    id: 'driver',
    path: '/driver',
    icon: '🚛',
    title: 'Водитель',
    subtitle: 'Найти заказ',
    description: 'Лента заказов, навигация, управление рейсом, финансы',
    color: 'from-orange-500 to-orange-600',
    features: ['Лента заказов', 'Навигация', 'Фотофиксация', 'Вывод средств'],
  },
  {
    id: 'dispatcher',
    path: '/dispatcher',
    icon: '🖥',
    title: 'Диспетчер',
    subtitle: 'Управление',
    description: 'Дашборд, мониторинг автопарка, аналитика, CRM',
    color: 'from-emerald-500 to-emerald-600',
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 pt-12 pb-16 text-center">
          <div className="flex justify-end mb-4">
            <button onClick={() => setDarkMode(!darkMode)} className="text-white/60 hover:text-white p-2 rounded-lg transition-colors">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="text-6xl mb-4">🚚</div>
          <h1 className="text-3xl font-bold mb-2">TransPort Pro</h1>
          <p className="text-blue-200 text-lg">Современная платформа грузоперевозок</p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-blue-200">
            <span className="flex items-center gap-1">✅ OSRM маршруты</span>
            <span className="flex items-center gap-1">✅ Реальные дороги</span>
            <span className="flex items-center gap-1">✅ GPS трекинг</span>
          </div>
        </div>
      </div>

      {/* Role cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-12 w-full">
        <div className="grid md:grid-cols-3 gap-4">
          {ROLES.map((role, i) => (
            <button
              key={role.id}
              onClick={() => selectRole(role)}
              className="card p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {role.icon}
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{role.title}</h2>
              <p className="text-sm text-primary font-medium mb-2">{role.subtitle}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{role.description}</p>
              <div className="space-y-1.5">
                {role.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-primary text-sm font-medium group-hover:underline">
                  Войти как {role.title.toLowerCase()} →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Перевозок', value: '12,450+', icon: '📦' },
            { label: 'Водителей', value: '890', icon: '🚛' },
            { label: 'Городов', value: '340+', icon: '🏙' },
            { label: 'Клиентов', value: '3,200+', icon: '👥' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
