import { Outlet, useNavigate } from 'react-router-dom';

export default function DispatcherLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-surface-card-dark/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">🖥 Панель диспетчера</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">👤</div>
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
