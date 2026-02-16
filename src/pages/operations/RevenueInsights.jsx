import { MOCK_ORDERS } from '../../data/mockOrders';
import { formatCurrency, getRevenueMetrics } from '../../utils/reporting';

const STATUS_LABELS = {
  pending: 'Новый',
  loading: 'Погрузка',
  in_transit: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
};

const VEHICLE_LABELS = {
  tent: 'Тентованные',
  ref: 'Рефрижераторы',
  board: 'Бортовые',
};

export default function RevenueInsights() {
  const metrics = getRevenueMetrics(MOCK_ORDERS);
  const maxRevenue = metrics.byDate[0]?.revenue || 1;

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">finance / revenue insights</p>
        <h2 className="text-2xl font-semibold mt-1">Детальная аналитика выручки</h2>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Metric label="Общая выручка" value={formatCurrency(metrics.total)} />
          <Metric label="Закрытые заказы" value={formatCurrency(metrics.deliveredRevenue)} />
          <Metric label="Средний чек" value={formatCurrency(metrics.average)} />
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="ops-panel rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Выручка по датам создания</h3>
          <div className="space-y-2">
            {metrics.byDate.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>{item.label}</span>
                  <span>{formatCurrency(item.revenue)}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-800"
                    style={{ width: `${Math.max(8, Math.round((item.revenue / maxRevenue) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ops-panel rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Выручка по типу транспорта</h3>
          <div className="space-y-2">
            {metrics.byVehicle.map((item) => (
              <RevenueRow
                key={item.label}
                label={VEHICLE_LABELS[item.label] || item.label}
                revenue={item.revenue}
                orders={item.orders}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Выручка по статусам заказов</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {metrics.byStatus.map((item) => (
            <RevenueRow
              key={item.label}
              label={STATUS_LABELS[item.label] || item.label}
              revenue={item.revenue}
              orders={item.orders}
            />
          ))}
        </div>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Топ клиентов по выручке</h3>
        <div className="space-y-2">
          {metrics.byClient.slice(0, 5).map((item, idx) => (
            <div key={item.label} className="ops-soft-card rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">#{idx + 1}</p>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.revenue)}</p>
                <p className="text-xs text-slate-500">{item.orders} заказ(ов)</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="ops-kpi rounded-lg p-3">
      <p className="ops-chip text-[10px] text-slate-400">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}

function RevenueRow({ label, revenue, orders }) {
  return (
    <div className="ops-soft-card rounded-lg p-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{orders} заказ(ов)</p>
      </div>
      <p className="text-sm font-semibold text-slate-900">{formatCurrency(revenue)}</p>
    </div>
  );
}
