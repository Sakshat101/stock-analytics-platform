
import { useMarketStore } from '../../store/marketStore';

export function WatchlistPanel() {
  const stocks = useMarketStore((state) => state.stocks);
  const selectSymbol = useMarketStore(
    (state) => state.selectSymbol
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">
          Watchlist
        </h3>

        <span className="text-xs text-slate-500">
          {stocks.length} Stocks
        </span>
      </div>

      <div className="space-y-2">
        {stocks.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() =>
              selectSymbol(stock.symbol)
            }
            className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-left transition hover:bg-slate-100"
          >
            <div>
              <div className="font-medium">
                {stock.symbol}
              </div>

              <div className="text-xs text-slate-500">
                {stock.companyName}
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium">
                ₹{stock.currentPrice}
              </div>

              <div
                className={
                  stock.percentChange >= 0
                    ? 'text-xs text-emerald-600'
                    : 'text-xs text-red-600'
                }
              >
                {stock.percentChange >= 0
                  ? '+'
                  : ''}
                {stock.percentChange}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}