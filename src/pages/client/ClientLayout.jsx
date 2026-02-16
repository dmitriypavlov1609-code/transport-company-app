import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/client', label: 'Обзор', end: true, icon: 'M3 12l2-2 7-7 7 7 2 2M5 10v10h14V10' },
  { path: '/client/calculator', label: 'Расчёт', icon: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m2 4h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01' },
  { path: '/client/orders', label: 'Заказы', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2' },
];

export default function ClientLayout() {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="ops-shell pb-24">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="ops-header max-w-5xl mx-auto rounded-xl px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/')} className="p-1.5 rounded border border-slate-500/40 hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="min-w-0">
              <p className="ops-chip text-[10px] text-slate-300">client cabinet</p>
              <p className="text-sm font-semibold truncate">{userProfile?.name || 'Демо Клиент'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="ops-chip text-[10px] text-emerald-300 border border-emerald-400/40 rounded px-2 py-1">online</span>
            <button onClick={handleLogout} className="p-1.5 rounded border border-slate-500/40 hover:bg-white/10 transition-colors" title="Выйти">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-3 left-0 right-0 z-50 px-4">
        <div className="ops-nav max-w-5xl mx-auto rounded-xl p-2 grid grid-cols-3 gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `ops-nav-item rounded-lg px-3 py-2.5 flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'ops-nav-item-active' : ''}`
              }
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
