
import { useEffect, useState } from 'react';
import { api } from '../services/api';

type AnalyticsData = {
  sectorAllocation: {
    sector: string;
    value: number;
  }[];
  riskScore: number;
  monthlyReturn: number;
  portfolioHealth: string;
};

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAnalytics();
  }, []);

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">
          Portfolio Analytics
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Risk Score
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              {data.riskScore}/100
            </h3>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Monthly Return
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-emerald-600">
              +{data.monthlyReturn}%
            </h3>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Portfolio Health
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              {data.portfolioHealth}
            </h3>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">
          Sector Allocation
        </h2>

        <div className="mt-4 space-y-3">
          {data.sectorAllocation.map((sector) => (
            <div
              key={sector.sector}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
            >
              <span>{sector.sector}</span>
              <span className="font-medium">
                {sector.value}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
