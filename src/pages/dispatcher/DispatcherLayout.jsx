import { Outlet, useNavigate } from 'react-router-dom';

export default function DispatcherLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-surface-card-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">Панель диспетчера</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Диспетчер</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}
