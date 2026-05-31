import { AIForecastCard } from '../components/ai/AIForecastCard';
import { useEffect } from 'react';
import { useMarketSocket } from '../hooks/useMarketSocket';
import { MarketOverviewCard } from '../components/dashboard/MarketOverviewCard';
import { StockChartPanel } from '../components/charts/StockChartPanel';
import { WatchlistPanel } from '../components/watchlist/WatchlistPanel';
import { TopMoversGrid } from '../components/dashboard/TopMoversGrid';
import { PortfolioSummaryCards } from '../components/portfolio/PortfolioSummaryCards';
import { useMarketStore } from '../store/marketStore';

export function DashboardPage() {
  useMarketSocket();

  const lastUpdated = useMarketStore((state) => state.lastUpdated);

  useEffect(() => {
    document.title = 'Dashboard | KiteView';
  }, []);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-100">
          <div>
            <div className="text-sm text-slate-500">Live Updates</div>
            <div className="text-base font-medium text-slate-900">
              {lastUpdated
                ? `Updated at ${new Date(lastUpdated).toLocaleTimeString('en-IN')}`
                : 'Connecting to live market feed...'}
            </div>
          </div>
          <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            Socket.IO
          </div>
        </div>

        <MarketOverviewCard />
        <PortfolioSummaryCards />
        <TopMoversGrid />
        <StockChartPanel />
        <AIForecastCard />
      </div>

      <div className="space-y-4">
        <WatchlistPanel />
      </div>
    </div>
  );
}