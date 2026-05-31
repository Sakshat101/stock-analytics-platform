
import { useEffect, useState } from 'react';
import { api } from '../services/api';

type SentimentItem = {
  symbol: string;
  title: string;
  sentimentScore: number;
  label: string;
};

export function NewsSentimentPage() {
  const [news, setNews] = useState<SentimentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSentiment = async () => {
      try {
        const response = await api.get('/analytics/sentiment');
        setNews(response.data.news || []);
      } catch (error) {
        console.error('Failed to load sentiment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSentiment();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        Loading news sentiment...
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <h2 className="text-xl font-semibold">News Sentiment</h2>
      <p className="mt-1 text-sm text-slate-500">
        Mock sentiment analysis for major Indian stocks.
      </p>

      <div className="mt-6 space-y-3">
        {news.map((item) => {
          const isPositive = item.sentimentScore >= 0.6;
          const isNegative = item.sentimentScore <= 0.45;

          return (
            <div
              key={`${item.symbol}-${item.title}`}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">{item.symbol}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {item.title}
                  </div>
                </div>

                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isPositive
                      ? 'bg-emerald-100 text-emerald-700'
                      : isNegative
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Sentiment Score</span>
                  <span>{item.sentimentScore}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className={`h-2 rounded-full ${
                      isPositive
                        ? 'bg-emerald-500'
                        : isNegative
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.round(item.sentimentScore * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}