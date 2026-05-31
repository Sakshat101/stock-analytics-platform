
export function MarketOverviewCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">NIFTY 50</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            22,518.40
          </h2>
          <p className="mt-1 text-sm text-emerald-600">
            +142.20 (+0.64%)
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs text-slate-500">Market Breadth</p>
          <p className="text-sm font-medium text-slate-900">
            Positive
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Advancers</p>
          <p className="mt-1 text-lg font-semibold text-emerald-600">
            31
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Decliners</p>
          <p className="mt-1 text-lg font-semibold text-red-600">
            19
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Unchanged</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">
            0
          </p>
        </div>
      </div>
    </section>
  );
}
