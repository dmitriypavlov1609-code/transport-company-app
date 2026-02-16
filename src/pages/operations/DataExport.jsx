import { useMemo, useState } from 'react';
import { MOCK_ORDERS, MOCK_DRIVERS } from '../../data/mockOrders';
import {
  downloadCsv,
  formatCurrency,
  getRevenueMetrics,
  ordersToRows,
  revenueRowsByGroup,
} from '../../utils/reporting';

export default function DataExport() {
  const [lastExport, setLastExport] = useState('');
  const metrics = useMemo(() => getRevenueMetrics(MOCK_ORDERS), []);

  function handleExportOrders() {
    downloadCsv('orders-export.csv', ordersToRows(MOCK_ORDERS));
    setLastExport('orders-export.csv');
  }

  function handleExportRevenue() {
    downloadCsv('revenue-by-status.csv', revenueRowsByGroup(metrics.byStatus, 'status'));
    setLastExport('revenue-by-status.csv');
  }

  function handleExportDrivers() {
    const rows = MOCK_DRIVERS.map((driver) => ({
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      truck: driver.truck,
      plate: driver.plate,
      type: driver.type,
      status: driver.status,
      rating: driver.rating,
      trips: driver.trips,
    }));
    downloadCsv('drivers-export.csv', rows);
    setLastExport('drivers-export.csv');
  }

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">data / export center</p>
        <h2 className="text-2xl font-semibold mt-1">Выгрузка данных</h2>
        <p className="text-sm text-slate-300 mt-3">
          Экспортируйте операционные данные для бухгалтерии и управленческой отчетности.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        <button onClick={handleExportOrders} className="ops-panel rounded-xl p-4 text-left hover:-translate-y-0.5 transition">
          <p className="ops-chip text-[10px] text-slate-500">CSV / orders</p>
          <p className="text-lg font-semibold text-slate-900 mt-2">Экспорт заказов</p>
          <p className="text-sm text-slate-600 mt-1">Полная таблица по маршрутам, грузам и стоимости.</p>
        </button>

        <button onClick={handleExportRevenue} className="ops-panel rounded-xl p-4 text-left hover:-translate-y-0.5 transition">
          <p className="ops-chip text-[10px] text-slate-500">CSV / revenue</p>
          <p className="text-lg font-semibold text-slate-900 mt-2">Экспорт выручки</p>
          <p className="text-sm text-slate-600 mt-1">Сводка выручки по статусам заказов.</p>
        </button>

        <button onClick={handleExportDrivers} className="ops-panel rounded-xl p-4 text-left hover:-translate-y-0.5 transition">
          <p className="ops-chip text-[10px] text-slate-500">CSV / drivers</p>
          <p className="text-lg font-semibold text-slate-900 mt-2">Экспорт водителей</p>
          <p className="text-sm text-slate-600 mt-1">Список водителей с загрузкой и рейтингом.</p>
        </button>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Контрольные метрики перед выгрузкой</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Metric label="Всего заказов" value={String(MOCK_ORDERS.length)} />
          <Metric label="Сумма выручки" value={formatCurrency(metrics.total)} />
          <Metric label="Последний экспорт" value={lastExport || 'Пока нет'} />
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="ops-soft-card rounded-lg p-3">
      <p className="ops-chip text-[10px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900 mt-1 break-all">{value}</p>
    </div>
  );
}
