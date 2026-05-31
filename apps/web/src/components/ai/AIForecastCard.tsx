import { useEffect, useState } from 'react';
import axios from 'axios';

type Prediction = {
  day: number;
  predicted_price: number;
};

export function AIForecastCard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/predict',
          {
            symbol: 'RELIANCE',
            historical_prices: [3000, 3020, 3015, 3040, 3060],
          }
        );

        setPredictions(response.data.predictions);
      } catch (error) {
        console.error('AI forecast failed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-100">
      <h3 className="text-lg font-semibold">7-Day AI Forecast</h3>

      {loading ? (
        <div className="mt-4 text-sm text-slate-500">
          Loading AI prediction...
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {predictions.map((item) => (
            <div
              key={item.day}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2"
            >
              <span>Day {item.day}</span>
              <span className="font-medium">
                ₹{item.predicted_price}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}