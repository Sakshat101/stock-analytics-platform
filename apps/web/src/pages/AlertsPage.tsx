import { useEffect, useState } from 'react';
import { api } from '../services/api';

type AlertItem = {
  id: string;
  symbol: string;
  condition: 'ABOVE' | 'BELOW';
  target_price: number;
  is_active: boolean;
  created_at: string;
};

const STOCKS = [
  'RELIANCE',
  'TCS',
  'INFY',
  'HDFCBANK',
  'ICICIBANK',
  'SBIN',
  'ITC',
  'LT',
  'BHARTIARTL',
  'ASIANPAINT',
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [symbol, setSymbol] = useState('RELIANCE');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState(3200);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadAlerts = async () => {
    try {
      const response = await api.get('/alerts');
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const createAlert = async () => {
    try {
      setSubmitting(true);
      setMessage('');

      await api.post('/alerts', {
        symbol,
        condition,
        targetPrice: Number(targetPrice),
      });

      setMessage('Alert created successfully');
      await loadAlerts();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Failed to create alert');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await api.delete(`/alerts/${id}`);
      setMessage('Alert deleted successfully');
      await loadAlerts();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Failed to delete alert');
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
        <h2 className="text-xl font-semibold">Create Alert</h2>
        <p className="mt-1 text-sm text-slate-500">
          Create real-time stock price alerts for Indian stocks.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-slate-500">Stock</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              {STOCKS.map((stock) => (
                <option key={stock} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'ABOVE' | 'BELOW')}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="ABOVE">ABOVE</option>
              <option value="BELOW">BELOW</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500">Target Price</label>
            <input
              type="number"
              min="1"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={createAlert}
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? 'Creating...' : 'Create Alert'}
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            {message}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
        <h2 className="text-xl font-semibold">Your Alerts</h2>

        <div className="mt-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No alerts yet. Create one for stocks like RELIANCE or TCS.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
              >
                <div>
                  <div className="font-semibold">{alert.symbol}</div>
                  <div className="text-sm text-slate-500">
                    {alert.condition} ₹{alert.target_price}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={
                      alert.is_active
                        ? 'text-sm font-medium text-emerald-600'
                        : 'text-sm font-medium text-slate-500'
                    }
                  >
                    {alert.is_active ? 'Active' : 'Inactive'}
                  </div>

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}