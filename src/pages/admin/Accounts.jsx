const DEMO_ACCOUNTS = [
  { role: 'Администратор', email: 'demo-admin@transport.pro', access: 'Полный доступ' },
  { role: 'Диспетчер', email: 'demo-dispatcher@transport.pro', access: 'Операции и мониторинг' },
  { role: 'Водитель', email: 'demo-driver@transport.pro', access: 'Рейсы и доход' },
  { role: 'Клиент', email: 'demo-client@transport.pro', access: 'Заказы и трекинг' },
];

export default function AdminAccounts() {
  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">security / accounts</p>
        <h2 className="text-2xl font-semibold mt-1">Учетные записи</h2>
        <p className="text-sm text-slate-300 mt-3">
          Создана дополнительная роль администратора для финансового контроля и выгрузки отчетов.
        </p>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Демо аккаунты системы</h3>
        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((account) => (
            <div key={account.email} className="ops-soft-card rounded-lg p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{account.role}</p>
                <p className="text-xs text-slate-500">{account.email}</p>
              </div>
              <span className="ops-chip text-[10px] text-slate-500 border border-slate-300 rounded px-2 py-1">{account.access}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
