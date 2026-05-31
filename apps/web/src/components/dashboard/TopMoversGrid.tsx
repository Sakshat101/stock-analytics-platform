import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type Stock = {
  symbol: string;
  companyName: string;
  percentChange: number;
};

export function TopMoversGrid() {
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get('/stocks/overview');

        setGainers(response.data.gainers || []);
        setLosers(response.data.losers || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
        <h3 className="text-base font-semibold">
          Top Gainers
        </h3>

        <div className="mt-4 space-y-2">
          {gainers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
            >
              <div>
                <div className="font-medium">
                  {stock.symbol}
                </div>

                <div className="text-xs text-slate-500">
                  {stock.companyName}
                </div>
              </div>

              <div className="font-medium text-emerald-600">
                +{stock.percentChange}%
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
        <h3 className="text-base font-semibold">
          Top Losers
        </h3>

        <div className="mt-4 space-y-2">
          {losers.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3"
            >
              <div>
                <div className="font-medium">
                  {stock.symbol}
                </div>

                <div className="text-xs text-slate-500">
                  {stock.companyName}
                </div>
              </div>

              <div className="font-medium text-red-600">
                {stock.percentChange}%
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}