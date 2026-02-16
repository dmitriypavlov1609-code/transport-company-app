import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Обзор', end: true },
  { path: '/admin/planning', label: 'Планирование' },
  { path: '/admin/performance', label: 'SLA/Маржа' },
  { path: '/admin/revenue', label: 'Выручка' },
  { path: '/admin/export', label: 'Выгрузка' },
  { path: '/admin/accounts', label: 'Аккаунты' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="ops-shell pb-24">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="ops-header max-w-7xl mx-auto rounded-xl px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/')} className="p-1.5 rounded border border-slate-500/40 hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="min-w-0">
              <p className="ops-chip text-[10px] text-slate-300">admin center</p>
              <p className="text-sm font-semibold truncate">{userProfile?.name || 'Демо Администратор'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="ops-chip text-[10px] text-amber-300 border border-amber-400/40 rounded px-2 py-1">full access</span>
            <button onClick={handleLogout} className="p-1.5 rounded border border-slate-500/40 hover:bg-white/10 transition-colors" title="Выйти">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-3 left-0 right-0 z-50 px-4">
        <div className="ops-nav max-w-7xl mx-auto rounded-xl p-2 grid grid-cols-6 gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `ops-nav-item rounded-lg px-3 py-2.5 flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'ops-nav-item-active' : ''}`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
