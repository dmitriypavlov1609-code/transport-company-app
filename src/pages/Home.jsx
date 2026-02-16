import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../App';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {
    id: 'client',
    path: '/client',
    title: 'Клиент',
    subtitle: 'Планирование перевозок',
    description: 'Расчет стоимости, запуск заказа и контроль статуса в реальном времени.',
    features: ['Расчет маршрута', 'Онлайн-оформление', 'Контроль статуса'],
    code: 'OPS-CL',
  },
  {
    id: 'driver',
    path: '/driver',
    title: 'Водитель',
    subtitle: 'Исполнение рейсов',
    description: 'Лента доступных заявок, активный рейс и финансовые показатели.',
    features: ['Лента заявок', 'Навигация', 'Отчет по рейсу'],
    code: 'OPS-DR',
  },
  {
    id: 'dispatcher',
    path: '/dispatcher',
    title: 'Диспетчер',
    subtitle: 'Операционный контроль',
    description: 'Мониторинг автопарка, загрузки и SLA в едином дашборде.',
    features: ['Мониторинг рейсов', 'Управление нагрузкой', 'Контроль SLA'],
    code: 'OPS-DP',
  },
];

const KPI = [
  { label: 'Активных рейсов', value: '148', change: '+12%' },
  { label: 'Среднее время подачи', value: '18 мин', change: '-6%' },
  { label: 'Выполнение SLA', value: '97.2%', change: '+1.4%' },
  { label: 'Свободных машин', value: '64', change: '+9%' },
];

export default function Home() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useApp();
  const { userProfile } = useAuth();

  if (userProfile?.role) {
    const roleData = ROLES.find((r) => r.id === userProfile.role);
    if (roleData) return <Navigate to={roleData.path} />;
  }

  return (
    <div className="min-h-screen executive-bg px-4 py-6 sm:px-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-5 executive-enter">
        <section className="executive-panel rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="executive-chip text-[11px] text-slate-300">Transport Pro / Operations</p>
              <h1 className="text-3xl sm:text-4xl font-semibold mt-2 tracking-tight">Центр управления перевозками</h1>
              <p className="mt-4 text-sm text-slate-300 max-w-2xl">
                Выберите роль для входа в демо-кабинет и проверьте рабочие сценарии от заказа до мониторинга исполнения.
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="executive-chip text-[11px] text-slate-200 border border-slate-400/40 rounded px-3 py-2 hover:bg-white/10 transition-colors self-start"
            >
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {KPI.map((item) => (
              <div key={item.label} className="executive-kpi rounded-lg p-3">
                <p className="executive-chip text-[10px] text-slate-400">{item.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-lg sm:text-xl font-semibold">{item.value}</p>
                  <p className="text-xs text-emerald-300">{item.change}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {ROLES.map((role, i) => (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className="executive-role-card rounded-xl p-5 text-left"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="executive-chip text-[10px] text-slate-500">{role.code}</p>
                  <h2 className="text-xl font-semibold text-slate-900 mt-2">{role.title}</h2>
                  <p className="text-sm text-slate-700 mt-1">{role.subtitle}</p>
                </div>
                <span className="executive-chip text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">Demo</span>
              </div>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed">{role.description}</p>

              <div className="mt-5 space-y-2">
                {role.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-sm bg-slate-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">Открыть кабинет</span>
                <span className="executive-chip text-[10px] text-slate-500">Enter</span>
              </div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
