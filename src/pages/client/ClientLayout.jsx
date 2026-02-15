import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/client', label: 'Главная', end: true, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/client/calculator', label: 'Калькулятор', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { path: '/client/orders', label: 'Заказы', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { path: '/client', label: 'Профиль', end: true, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function ClientLayout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-surface-dark pb-16">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-surface-card-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">TransPort Pro</h1>
          <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-surface-card-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700/50 z-40">
        <div className="max-w-2xl mx-auto flex justify-around py-1.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item-inactive'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
