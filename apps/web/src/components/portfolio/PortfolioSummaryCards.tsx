
export function PortfolioSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
        <p className="text-sm text-slate-500">Portfolio Value</p>
        <h3 className="mt-2 text-2xl font-semibold">₹1,24,560</h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
        <p className="text-sm text-slate-500">Unrealized P/L</p>
        <h3 className="mt-2 text-2xl font-semibold text-emerald-600">
          +₹8,240
        </h3>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
        <p className="text-sm text-slate-500">Cash Balance</p>
        <h3 className="mt-2 text-2xl font-semibold">₹54,200</h3>
      </div>
    </div>
  );
}