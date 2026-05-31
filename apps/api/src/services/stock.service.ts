type StockSeed = {
  symbol: string;
  companyName: string;
  sector: string;
  basePrice: number;
};

export type StockPoint = {
  time: string;
  price: number;
};

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
  historicalData: StockPoint[];
  miniChartData: { time: string; value: number }[];
};

const INDIAN_STOCKS: StockSeed[] = [
  { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd.', sector: 'Energy', basePrice: 2950 },
  { symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd.', sector: 'IT Services', basePrice: 4120 },
  { symbol: 'INFY', companyName: 'Infosys Ltd.', sector: 'IT Services', basePrice: 1625 },
  { symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd.', sector: 'Banking', basePrice: 1710 },
  { symbol: 'ICICIBANK', companyName: 'ICICI Bank Ltd.', sector: 'Banking', basePrice: 1045 },
  { symbol: 'SBIN', companyName: 'State Bank of India', sector: 'Banking', basePrice: 835 },
  { symbol: 'ITC', companyName: 'ITC Ltd.', sector: 'FMCG', basePrice: 462 },
  { symbol: 'LT', companyName: 'Larsen & Toubro Ltd.', sector: 'Infrastructure', basePrice: 3920 },
  { symbol: 'BHARTIARTL', companyName: 'Bharti Airtel Ltd.', sector: 'Telecom', basePrice: 1465 },
  { symbol: 'ASIANPAINT', companyName: 'Asian Paints Ltd.', sector: 'Consumer Goods', basePrice: 3055 },
];

const round2 = (value: number) => Math.round(value * 100) / 100;

const randomBetween = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

const generateHistory = (basePrice: number, points = 48): StockPoint[] => {
  let current = basePrice;
  const history: StockPoint[] = [];

  for (let i = points; i >= 1; i--) {
    const drift = randomBetween(-0.012, 0.012) * basePrice;
    current = Math.max(10, current + drift);

    history.push({
      time: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      price: round2(current),
    });
  }

  return history;
};

export const buildMarketSnapshot = (): StockQuote[] => {
  return INDIAN_STOCKS.map((stock) => {
    const historicalData = generateHistory(stock.basePrice, 48);

    const currentPrice = historicalData[historicalData.length - 1]?.price ?? stock.basePrice;
    const previousClose = historicalData[historicalData.length - 2]?.price ?? stock.basePrice;

    const priceChange = round2(currentPrice - previousClose);
    const percentChange = previousClose === 0 ? 0 : round2((priceChange / previousClose) * 100);

    const dayHigh = round2(Math.max(...historicalData.map((point) => point.price)));
    const dayLow = round2(Math.min(...historicalData.map((point) => point.price)));

    const volume = Math.floor(randomBetween(1500000, 11000000));

    return {
      symbol: stock.symbol,
      companyName: stock.companyName,
      sector: stock.sector,
      currentPrice: round2(currentPrice),
      previousClose: round2(previousClose),
      priceChange,
      percentChange,
      dayHigh,
      dayLow,
      volume,
      historicalData,
      miniChartData: historicalData.slice(-10).map((point) => ({
        time: point.time,
        value: point.price,
      })),
    };
  });
};

export const getStockBySymbol = (symbol: string): StockQuote | undefined => {
  return buildMarketSnapshot().find(
    (stock) => stock.symbol.toUpperCase() === symbol.toUpperCase()
  );
};

export const getTopGainers = (quotes: StockQuote[]) => {
  return [...quotes]
    .sort((a, b) => b.percentChange - a.percentChange)
    .slice(0, 4);
};

export const getTopLosers = (quotes: StockQuote[]) => {
  return [...quotes]
    .sort((a, b) => a.percentChange - b.percentChange)
    .slice(0, 4);
};

export const getMarketOverview = () => {
  const quotes = buildMarketSnapshot();
  const gainers = getTopGainers(quotes);
  const losers = getTopLosers(quotes);

  const nifty50Base = 22500;
  const nifty50Change = quotes.reduce((sum, stock) => sum + stock.priceChange, 0) / 10;
  const nifty50Value = round2(nifty50Base + nifty50Change);

  return {
    nifty50: {
      value: nifty50Value,
      change: round2(nifty50Change),
      percentChange: round2((nifty50Change / nifty50Base) * 100),
    },
    gainers,
    losers,
    marketSummary: {
      advancers: quotes.filter((stock) => stock.priceChange >= 0).length,
      decliners: quotes.filter((stock) => stock.priceChange < 0).length,
      unchanged: 0,
      marketBreadth:
        quotes.filter((stock) => stock.priceChange >= 0).length >=
        quotes.filter((stock) => stock.priceChange < 0).length
          ? 'Positive'
          : 'Negative',
    },
  };
};