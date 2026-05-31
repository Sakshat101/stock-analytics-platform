
import { useEffect, useState } from 'react';
import { api } from '../services/api';

type Holding = {
  id: string;
  symbol: string;
  company_name: string;
  quantity: number;
  average_buy_price: number;
  current_price: number;
  unrealized_pnl: number;
};

type PortfolioResponse = {
  portfolio: {
    cash_balance: number;
    totalPortfolioValue: number;
    unrealizedPnL: number;
  };
  holdings: Holding[];
};

const STOCKS = [
  { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd.' },
  { symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd.' },
  { symbol: 'INFY', companyName: 'Infosys Ltd.' },
  { symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd.' },
  { symbol: 'ICICIBANK', companyName: 'ICICI Bank Ltd.' },
  { symbol: 'SBIN', companyName: 'State Bank of India' },
  { symbol: 'ITC', companyName: 'ITC Ltd.' },
  { symbol: 'LT', companyName: 'Larsen & Toubro Ltd.' },
  { symbol: 'BHARTIARTL', companyName: 'Bharti Airtel Ltd.' },
  { symbol: 'ASIANPAINT', companyName: 'Asian Paints Ltd.' },
];

export function PortfolioPage() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [symbol, setSymbol] = useState('RELIANCE');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(3000);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPortfolio = async () => {
    try {
      const response = await api.get('/portfolio');
      setData(response.data);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  useEffect(() => {
    const selected = STOCKS.find((stock) => stock.symbol === symbol);
    if (!selected) return;

    const defaultPriceMap: Record<string, number> = {
      RELIANCE: 3060,
      TCS: 4120,
      INFY: 1680,
      HDFCBANK: 1750,
      ICICIBANK: 1130,
      SBIN: 820,
      ITC: 490,
      LT: 3980,
      BHARTIARTL: 1580,
      ASIANPAINT: 2980,
    };

    setPrice(defaultPriceMap[symbol] || 1000);
  }, [symbol]);

  const handleTrade = async () => {
    try {
      setSubmitting(true);
      setMessage('');

      const selected = STOCKS.find((stock) => stock.symbol === symbol);

      if (!selected) {
        setMessage('Invalid stock selected');
        return;
      }

      const endpoint = side === 'BUY' ? '/portfolio/buy' : '/portfolio/sell';

      await api.post(endpoint, {
        symbol,
        companyName: selected.companyName,
        quantity: Number(quantity),
        price: Number(price),
      });

      setMessage(`${side} order executed successfully`);
      await loadPortfolio();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Trade failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        Loading portfolio...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-100">
          <div className="text-sm text-slate-500">Portfolio Value</div>
          <div className="mt-2 text-2xl font-semibold">
            ₹{data?.portfolio.totalPortfolioValue?.toLocaleString()}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-100">
          <div className="text-sm text-slate-500">Unrealized P/L</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600">
            ₹{data?.portfolio.unrealizedPnL?.toLocaleString()}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-100">
          <div className="text-sm text-slate-500">Cash Balance</div>
          <div className="mt-2 text-2xl font-semibold">
            ₹{data?.portfolio.cash_balance?.toLocaleString()}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
        <h2 className="text-xl font-semibold">Buy / Sell Stocks</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-slate-500">Side</label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as 'BUY' | 'SELL')}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Stock</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              {STOCKS.map((stock) => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Price</label>
            <input
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleTrade}
            disabled={submitting}
            className={`rounded-xl px-5 py-3 font-medium text-white transition disabled:opacity-60 ${
              side === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {submitting ? 'Processing...' : `${side} Order`}
          </button>

          {message && <div className="text-sm text-slate-600">{message}</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
        <h2 className="text-xl font-semibold">Holdings</h2>

        <div className="mt-4 space-y-3">
          {data?.holdings?.length ? (
            data.holdings.map((holding) => (
              <div
                key={holding.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
              >
                <div>
                  <div className="font-semibold">{holding.symbol}</div>
                  <div className="text-sm text-slate-500">{holding.company_name}</div>
                </div>

                <div className="text-right">
                  <div>Qty: {holding.quantity}</div>
                  <div className="text-sm text-slate-500">
                    Avg: ₹{holding.average_buy_price}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      holding.unrealized_pnl >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    P/L: ₹{holding.unrealized_pnl}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No holdings available.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}