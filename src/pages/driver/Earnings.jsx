import { useState } from 'react';

const EARNINGS_DATA = {
  balance: 145600,
  pending: 32000,
  thisMonth: 285400,
  lastMonth: 312000,
  trips: 23,
  history: [
    { id: 1, order: 'TRN-001', route: 'Москва → СПб', date: '16.01.2025', amount: 45000, status: 'paid' },
    { id: 2, order: 'TRN-004', route: 'Н.Новгород → Самара', date: '14.01.2025', amount: 28000, status: 'paid' },
    { id: 3, order: 'TRN-008', route: 'Казань → Уфа', date: '12.01.2025', amount: 18000, status: 'paid' },
    { id: 4, order: 'TRN-009', route: 'Москва → Тула', date: '10.01.2025', amount: 12000, status: 'paid' },
    { id: 5, order: 'TRN-003', route: 'Уфа → Челябинск', date: '17.01.2025', amount: 32000, status: 'pending' },
  ],
};

export default function Earnings() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">💰 Финансы</h2>

      {/* Balance card */}
      <div className="card bg-gradient-to-br from-primary to-blue-700 text-white p-5">
        <div className="text-sm opacity-80 mb-1">Доступный баланс</div>
        <div className="text-3xl font-bold mb-4">{EARNINGS_DATA.balance.toLocaleString()} ₽</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-70">Ожидает</div>
            <div className="text-sm font-medium">{EARNINGS_DATA.pending.toLocaleString()} ₽</div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-xl text-sm font-medium transition-all">
            💳 Вывести
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card items-center">
          <span className="text-2xl">📊</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{EARNINGS_DATA.thisMonth.toLocaleString()}</span>
          <span className="text-xs text-gray-500">Этот месяц</span>
        </div>
        <div className="stat-card items-center">
          <span className="text-2xl">🚛</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{EARNINGS_DATA.trips}</span>
          <span className="text-xs text-gray-500">Рейсов</span>
        </div>
        <div className="stat-card items-center">
          <span className="text-2xl">⭐</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">4.8</span>
          <span className="text-xs text-gray-500">Рейтинг</span>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">📈 Доходы</h3>
          <div className="flex gap-1">
            {['week', 'month', 'year'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${period === p ? 'bg-primary text-white' : 'text-gray-500'}`}>
                {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
        </div>
        {/* Simple bar chart */}
        <div className="flex items-end justify-around h-32 gap-2">
          {[65, 42, 78, 55, 90, 45, 72].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primary/20 rounded-t-md relative" style={{ height: `${v}%` }}>
                <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all" style={{ height: `${v * 0.7}%` }} />
              </div>
              <span className="text-[10px] text-gray-400">{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="card p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">📜 История</h3>
        <div className="space-y-3">
          {EARNINGS_DATA.history.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{tx.route}</div>
                <div className="text-xs text-gray-500">{tx.order} • {tx.date}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">+{tx.amount.toLocaleString()} ₽</div>
                <span className={tx.status === 'paid' ? 'badge-success' : 'badge-warning'}>
                  {tx.status === 'paid' ? 'Выплачено' : 'Ожидание'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Self-employed */}
      <div className="card p-4 border-l-4 border-l-accent">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧾</span>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">Самозанятость</div>
            <div className="text-xs text-gray-500">Формирование чеков через «Мой налог»</div>
          </div>
          <button className="ml-auto text-xs text-primary font-medium">Настроить</button>
        </div>
      </div>
    </div>
  );
}
