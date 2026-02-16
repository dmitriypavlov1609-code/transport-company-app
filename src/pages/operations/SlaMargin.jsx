import { useMemo } from 'react';
import { MOCK_DRIVERS, MOCK_ORDERS } from '../../data/mockOrders';
import { downloadCsv, formatCurrency } from '../../utils/reporting';
import { getInitialAssignments, getMarginReport, getSlaAlerts } from '../../utils/tms';

const LEVEL_STYLES = {
  critical: 'badge-danger',
  high: 'badge-warning',
  medium: 'badge-info',
};

const LEVEL_LABELS = {
  critical: 'Критично',
  high: 'Высокий',
  medium: 'Средний',
};

const STATUS_LABELS = {
  pending: 'Новый',
  loading: 'Погрузка',
  in_transit: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
};

export default function SlaMargin() {
  const assignments = useMemo(() => getInitialAssignments(MOCK_ORDERS, MOCK_DRIVERS), []);
  const slaAlerts = useMemo(() => getSlaAlerts(MOCK_ORDERS, assignments), [assignments]);
  const margin = useMemo(() => getMarginReport(MOCK_ORDERS), []);

  function exportMarginCsv() {
    const rows = margin.rows.map((row) => ({
      order_id: row.orderId,
      route: row.route,
      status: row.status,
      distance_km: row.distanceKm,
      vehicle: row.vehicle,
      revenue: row.revenue,
      estimated_cost: row.estimatedCost,
      margin: row.margin,
      margin_pct: row.marginPct,
    }));

    downloadCsv('trip-margin-report.csv', rows);
  }

  return (
    <div className="space-y-4 executive-enter">
      <section className="ops-header rounded-xl p-5 text-white">
        <p className="ops-chip text-[11px] text-slate-300">control / sla and margin</p>
        <h2 className="text-2xl font-semibold mt-1">SLA-алерты и маржа по рейсам</h2>
        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <Metric label="SLA-алертов" value={String(slaAlerts.length)} />
          <Metric label="Выручка" value={formatCurrency(margin.totals.revenue)} />
          <Metric label="Себестоимость" value={formatCurrency(margin.totals.cost)} />
          <Metric label="Средняя маржа" value={`${margin.totals.avgMarginPct}%`} />
        </div>
      </section>

      <section className="ops-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">SLA-риски</h3>
          <span className="ops-chip text-[10px] text-slate-500">monitoring</span>
        </div>

        {slaAlerts.length === 0 ? (
          <div className="ops-soft-card rounded-lg p-4 text-sm text-emerald-700">Нарушений SLA не обнаружено.</div>
        ) : (
          <div className="space-y-2">
            {slaAlerts.map((alert) => (
              <div key={alert.id} className="ops-soft-card rounded-lg p-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{alert.orderId} · {alert.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{alert.route}</p>
                  <p className="text-xs text-slate-500 mt-1">{alert.detail}</p>
                </div>
                <span className={LEVEL_STYLES[alert.level] || 'badge-info'}>{LEVEL_LABELS[alert.level] || alert.level}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="ops-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Маржа по рейсам</h3>
          <button onClick={exportMarginCsv} className="btn-outline py-1.5 px-3">Выгрузить CSV</button>
        </div>

        <div className="space-y-2">
          {margin.rows.map((row) => (
            <div key={row.orderId} className="ops-soft-card rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{row.orderId} · {row.route}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {STATUS_LABELS[row.status] || row.status} · {row.distanceKm} км · {row.vehicle}
                  </p>
                </div>
                <span className={`ops-chip text-[10px] border rounded px-2 py-1 ${row.margin >= 0 ? 'text-emerald-700 border-emerald-300' : 'text-red-700 border-red-300'}`}>
                  {row.marginPct}%
                </span>
              </div>
              <div className="grid sm:grid-cols-3 gap-2 mt-3 text-xs">
                <div className="rounded border border-slate-200 bg-white px-2 py-1.5">
                  <p className="text-slate-500">Выручка</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(row.revenue)}</p>
                </div>
                <div className="rounded border border-slate-200 bg-white px-2 py-1.5">
                  <p className="text-slate-500">Себестоимость</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(row.estimatedCost)}</p>
                </div>
                <div className="rounded border border-slate-200 bg-white px-2 py-1.5">
                  <p className="text-slate-500">Маржа</p>
                  <p className={`font-semibold ${row.margin >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {formatCurrency(row.margin)}
                  </p>
                </div>
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
