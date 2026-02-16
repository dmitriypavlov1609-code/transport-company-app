import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DispatcherLayout() {
  const navigate = useNavigate();
  const { logout, userProfile } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="ops-shell">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="ops-header max-w-7xl mx-auto rounded-xl px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/')} className="p-1.5 rounded border border-slate-500/40 hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="min-w-0">
              <p className="ops-chip text-[10px] text-slate-300">dispatch center</p>
              <p className="text-sm font-semibold truncate">{userProfile?.name || 'Демо Диспетчер'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="ops-chip text-[10px] text-slate-300 border border-slate-400/40 rounded px-2 py-1">
              {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <button onClick={handleLogout} className="p-1.5 rounded border border-slate-500/40 hover:bg-white/10 transition-colors" title="Выйти">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}
