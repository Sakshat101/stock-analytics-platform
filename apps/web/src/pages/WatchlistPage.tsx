
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useMarketStore } from '../store/marketStore';

type WatchlistItem = {
  symbol: string;
  company_name?: string;
  companyName?: string;
};

export function WatchlistPage() {
  const stocks = useMarketStore((state) => state.stocks);
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const response = await api.get('/watchlist');
        setItems(response.data.items || []);
      } catch (error) {
        console.error('Failed to load watchlist:', error);
      }
    };

    loadWatchlist();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Watchlist</h2>
        <span className="text-sm text-slate-500">
          {items.length} Saved Stocks
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        {items.map((item) => {
          const liveStock = stocks.find(
            (stock) => stock.symbol === item.symbol
          );

          return (
            <div
              key={item.symbol}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div>
                <div className="font-medium">{item.symbol}</div>
                <div className="text-xs text-slate-500">
                  {item.company_name || item.companyName || 'Company'}
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium">
                  ₹{liveStock?.currentPrice ?? '--'}
                </div>
                <div
                  className={
                    liveStock && liveStock.percentChange >= 0
                      ? 'text-xs text-emerald-600'
                      : 'text-xs text-red-600'
                  }
                >
                  {liveStock
                    ? `${liveStock.percentChange >= 0 ? '+' : ''}${liveStock.percentChange}%`
                    : 'Live'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
