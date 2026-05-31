import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../../services/api';
import { useMarketStore } from '../../store/marketStore';

const ranges = ['1D', '1W', '1M', '1Y'] as const;
type Range = (typeof ranges)[number];

type ChartPoint = {
  time: string;
  price: number;
};

export function StockChartPanel() {
  const stocks = useMarketStore((state) => state.stocks);
  const selectedSymbol = useMarketStore((state) => state.selectedSymbol);

  const [range, setRange] = useState<Range>('1W');
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedStock = stocks.find(
    (stock) => stock.symbol === selectedSymbol
  );

  useEffect(() => {
    const loadStock = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/stocks/${selectedSymbol}`);
        const historicalData = response.data.stock.historicalData as ChartPoint[];

        const sliceSize =
          range === '1D'
            ? 12
            : range === '1W'
              ? 20
              : range === '1M'
                ? 30
                : 48;

        setData(historicalData.slice(-sliceSize));
      } catch (error) {
        console.error('Failed to load chart data:', error);

        if (selectedStock?.historicalData?.length) {
          const sliceSize =
            range === '1D'
              ? 12
              : range === '1W'
                ? 20
                : range === '1M'
                  ? 30
                  : 48;

          setData(selectedStock.historicalData.slice(-sliceSize));
        } else {
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStock();
  }, [selectedSymbol, range, selectedStock]);

  const chartData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      label: new Date(point.time).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
    }));
  }, [data]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Interactive Stock Chart</h3>
          <p className="text-sm text-slate-500">
            {selectedStock?.symbol || 'Select a stock'} • Live market style chart
          </p>

          {selectedStock && (
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-slate-500">Price: </span>
                <span className="font-medium">₹{selectedStock.currentPrice}</span>
              </div>
              <div>
                <span className="text-slate-500">Day High: </span>
                <span className="font-medium">₹{selectedStock.dayHigh}</span>
              </div>
              <div>
                <span className="text-slate-500">Day Low: </span>
                <span className="font-medium">₹{selectedStock.dayLow}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {ranges.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                range === item
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-72">
        {loading ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            Loading chart...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            No chart data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip
                formatter={(value: number) => [`₹${value}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
