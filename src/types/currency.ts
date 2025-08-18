export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  flag?: string;
}

export interface CurrencyPair {
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface ChartData {
  date: string;
  rate: number;
  timestamp: number;
}

export interface ApiResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export type TimeFrame = '1D' | '7D' | '30D' | '3M';

export interface RefreshState {
  isRefreshing: boolean;
  lastRefresh: Date | null;
  error: string | null;
}