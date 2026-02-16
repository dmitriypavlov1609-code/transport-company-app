import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/driver', label: 'Лента', end: true, icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2' },
  { path: '/driver/active', label: 'Рейс', icon: 'M3 13h14l2 3h2v3h-1a2 2 0 1 1-4 0H8a2 2 0 1 1-4 0H3zm2-6h8v6H5zM13 9h3l2 2v2h-5z' },
  { path: '/driver/earnings', label: 'Доход', icon: 'M12 1v22M17 5H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H7' },
];

export default function DriverLayout() {
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
              <p className="ops-chip text-[10px] text-slate-300">driver station</p>
              <p className="text-sm font-semibold truncate">{userProfile?.name || 'Демо Водитель'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="ops-chip text-[10px] text-emerald-300 border border-emerald-400/40 rounded px-2 py-1">active</span>
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
