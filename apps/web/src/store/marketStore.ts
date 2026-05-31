
import { create } from 'zustand';

export type StockQuote = {
  symbol: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  priceChange: number;
  percentChange: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  historicalData: Array<{
    time: string;
    price: number;
  }>;
  miniChartData: Array<{
    time: string;
    value: number;
  }>;
};

type MarketState = {
  stocks: StockQuote[];
  selectedSymbol: string;
  lastUpdated: string | null;

  setSnapshot: (stocks: StockQuote[]) => void;
  setLiveUpdate: (stocks: StockQuote[]) => void;
  selectSymbol: (symbol: string) => void;

  getSelectedStock: () => StockQuote | undefined;
};

export const useMarketStore = create<MarketState>((set, get) => ({
  stocks: [],
  selectedSymbol: 'RELIANCE',
  lastUpdated: null,

  setSnapshot: (stocks) => {
    set({
      stocks,
      lastUpdated: new Date().toISOString(),
    });
  },

  setLiveUpdate: (stocks) => {
    set({
      stocks,
      lastUpdated: new Date().toISOString(),
    });
  },

  selectSymbol: (symbol) => {
    set({ selectedSymbol: symbol });
  },

  getSelectedStock: () => {
    const { stocks, selectedSymbol } = get();
    return stocks.find((stock) => stock.symbol === selectedSymbol);
  },
}));