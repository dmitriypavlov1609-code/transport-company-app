import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEMO_ROLES = [
  { id: 'client', label: 'Клиент', description: 'Калькулятор, заказы и трекинг', access: 'OPS-CL' },
  { id: 'driver', label: 'Водитель', description: 'Лента заказов и активный рейс', access: 'OPS-DR' },
  { id: 'dispatcher', label: 'Диспетчер', description: 'Панель мониторинга и управление', access: 'OPS-DP' },
  { id: 'admin', label: 'Администратор', description: 'Финансовая аналитика и экспорт данных', access: 'OPS-AD' },
];

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('');
  const { loginDemo } = useAuth();
  const navigate = useNavigate();

  async function handleDemoEnter(role) {
    setError('');
    setActiveRole(role);
    setLoading(true);
    try {
      const roleLabel = DEMO_ROLES.find((item) => item.id === role)?.label || 'Demo User';
      await loginDemo(role, `Демо ${roleLabel}`);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err?.code));
    }
    setLoading(false);
    setActiveRole('');
  }

  return (
    <div className="min-h-screen executive-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-5 executive-enter">
        <section className="executive-panel rounded-xl p-7 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="executive-chip text-[11px] text-slate-300">Transport Pro / Command Desk</p>
              <h1 className="text-3xl sm:text-4xl font-semibold mt-3 tracking-tight">Операционный контроль перевозок</h1>
            </div>
            <div className="executive-chip text-[11px] text-emerald-300 border border-emerald-400/30 rounded px-2 py-1">System Online</div>
          </div>

          <p className="text-slate-300 text-sm mt-5 max-w-xl">
            Единый вход в демо-контур. Выберите роль, чтобы открыть соответствующий кабинет с рабочими сценариями.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-7">
            <div className="executive-kpi rounded-lg p-3">
              <p className="executive-chip text-[10px] text-slate-400">Routes/day</p>
              <p className="text-xl font-semibold mt-1">12,450</p>
            </div>
            <div className="executive-kpi rounded-lg p-3">
              <p className="executive-chip text-[10px] text-slate-400">Fleet readiness</p>
              <p className="text-xl font-semibold mt-1">97.2%</p>
            </div>
            <div className="executive-kpi rounded-lg p-3">
              <p className="executive-chip text-[10px] text-slate-400">Live incidents</p>
              <p className="text-xl font-semibold mt-1 text-amber-300">03</p>
            </div>
          </div>
        </section>

        <section className="executive-card rounded-xl p-6">
          <div className="mb-5">
            <p className="executive-chip text-[11px] text-slate-500">Access mode</p>
            <h2 className="text-xl font-semibold text-slate-900 mt-2">Демо авторизация</h2>
            <p className="text-xs text-slate-500 mt-1">Регистрация отключена. Доступ предоставляется по роли.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md border border-red-300 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {DEMO_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => handleDemoEnter(role.id)}
                disabled={loading}
                className="executive-role-card w-full rounded-lg px-4 py-3 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activeRole === role.id ? 'Вход...' : `Войти как ${role.label}`}</p>
                    <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                  </div>
                  <span className="executive-chip text-[10px] text-slate-500">{role.access}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function getErrorMessage(code) {
  const messages = {
    'auth/invalid-email': 'Неверный формат email',
    'auth/user-disabled': 'Аккаунт заблокирован',
    'auth/user-not-found': 'Пользователь не найден',
    'auth/wrong-password': 'Неверный пароль',
    'auth/invalid-credential': 'Неверный email или пароль',
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    'auth/network-request-failed': 'Ошибка сети. Проверьте подключение',
  };
  return messages[code] || 'Ошибка входа. Попробуйте снова';
}
