import { CurrencyInfo, CurrencyRate, HistoricalRate, ChartData } from '@/types/currency';
import { ALL_CURRENCIES } from './constants';

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = getCurrencyInfo(currency);
  
  if (currency === 'JPY' || currency === 'KRW') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatRate(rate: number): string {
  if (rate >= 1000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(rate);
  }
  
  if (rate >= 100) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(rate);
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(4)}`;
}

export function formatChangePercent(changePercent: number): string {
  const sign = changePercent >= 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
}

export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return ALL_CURRENCIES.find(currency => currency.code === code);
}

export function calculateChange(currentRate: number, previousRate: number): {
  change: number;
  changePercent: number;
} {
  const change = currentRate - previousRate;
  const changePercent = (change / previousRate) * 100;
  
  return {
    change: Number(change.toFixed(6)),
    changePercent: Number(changePercent.toFixed(2)),
  };
}

export function generateMockHistoricalData(baseRate: number, days: number): HistoricalRate[] {
  const data: HistoricalRate[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic rate fluctuation (±2% daily variation)
    const variation = (Math.random() - 0.5) * 0.04; // ±2%
    const rate = baseRate * (1 + variation * (i / days));
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: Number(rate.toFixed(6)),
    });
  }
  
  return data;
}

export function convertHistoricalToChartData(historical: HistoricalRate[]): ChartData[] {
  return historical.map(item => ({
    date: item.date,
    rate: item.rate,
    timestamp: new Date(item.date).getTime(),
  }));
}

export function formatDateForChart(dateString: string, timeFrame: string): string {
  const date = new Date(dateString);
  
  switch (timeFrame) {
    case '1D':
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    case '7D':
      return date.toLocaleDateString('en-US', { 
        weekday: 'short' 
      });
    case '30D':
    case '3M':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    default:
      return date.toLocaleDateString('en-US');
  }
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  return date.toLocaleDateString('en-US');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}