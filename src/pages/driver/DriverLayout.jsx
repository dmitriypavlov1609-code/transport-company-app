import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/driver', icon: '📋', label: 'Заказы', end: true },
  { path: '/driver/active', icon: '🚛', label: 'Рейс' },
  { path: '/driver/earnings', icon: '💰', label: 'Финансы' },
  { path: '/driver', icon: '👤', label: 'Профиль', end: true },
];

export default function DriverLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark pb-20">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-surface-card-dark/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">🚛 Кабинет водителя</h1>
          <div className="flex items-center gap-1 text-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-gray-500">Онлайн</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-surface-card-dark/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="max-w-2xl mx-auto flex justify-around py-1">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path + item.label} to={item.path} end={item.end}
              className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item-inactive'}>
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
