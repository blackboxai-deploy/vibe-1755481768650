import { ApiResponse, CurrencyRate, HistoricalRate } from '@/types/currency';
import { BASE_CURRENCY, API_ENDPOINTS, POPULAR_CURRENCIES } from './constants';
import { calculateChange, generateMockHistoricalData, getCurrencyInfo } from './currencyUtils';

// Mock data for demonstration - in production, you'd use real API
const generateMockRates = (): Record<string, number> => {
  const baseRates: Record<string, number> = {
    EUR: 0.85,
    GBP: 0.73,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.91,
    CNY: 7.24,
    INR: 83.15,
    KRW: 1340.25,
    SGD: 1.35,
    HKD: 7.83,
    NOK: 10.85,
    SEK: 10.45,
    DKK: 6.85,
    PLN: 4.15,
    CZK: 23.25,
    HUF: 365.50,
    RUB: 95.75,
    BRL: 5.15,
    MXN: 17.85,
    ZAR: 18.65,
    TRY: 28.45,
    NZD: 1.65,
  };

  // Add some realistic fluctuation
  const fluctuatedRates: Record<string, number> = {};
  Object.entries(baseRates).forEach(([currency, rate]) => {
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    fluctuatedRates[currency] = rate * (1 + variation);
  });

  return fluctuatedRates;
};

let previousRates: Record<string, number> = {};
let currentRates: Record<string, number> = generateMockRates();

export async function fetchCurrentRates(base: string = BASE_CURRENCY): Promise<CurrencyRate[]> {
  try {
    // Store previous rates for change calculation
    previousRates = { ...currentRates };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate new rates with realistic changes
    currentRates = generateMockRates();
    
    const mockResponse: ApiResponse = {
      success: true,
      timestamp: Date.now(),
      base: base,
      date: new Date().toISOString().split('T')[0],
      rates: currentRates,
    };

    if (!mockResponse.success) {
      throw new Error('Failed to fetch currency rates');
    }

    const currencyRates: CurrencyRate[] = [];

    // Process popular currencies
    POPULAR_CURRENCIES.forEach(currency => {
      if (currency.code !== base) {
        const rate = mockResponse.rates[currency.code];
        const previousRate = previousRates[currency.code] || rate;
        const { change, changePercent } = calculateChange(rate, previousRate);
        const currencyInfo = getCurrencyInfo(currency.code);

        currencyRates.push({
          code: currency.code,
          name: currency.name,
          rate: Number(rate.toFixed(6)),
          change,
          changePercent,
          lastUpdated: new Date().toISOString(),
          flag: currencyInfo?.flag,
        });
      }
    });

    return currencyRates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    throw new Error('Failed to fetch currency rates. Please try again.');
  }
}

export async function fetchHistoricalRates(
  base: string,
  target: string,
  days: number
): Promise<HistoricalRate[]> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get current rate for the target currency
    const currentRate = currentRates[target] || 1;
    
    // Generate mock historical data
    const historicalData = generateMockHistoricalData(currentRate, days);
    
    return historicalData;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    throw new Error('Failed to fetch historical data. Please try again.');
  }
}

export async function fetchSingleCurrencyRate(
  base: string,
  target: string
): Promise<CurrencyRate | null> {
  try {
    const allRates = await fetchCurrentRates(base);
    return allRates.find(rate => rate.code === target) || null;
  } catch (error) {
    console.error('Error fetching single currency rate:', error);
    return null;
  }
}

// Utility function to check API health
export async function checkApiHealth(): Promise<boolean> {
  try {
    // Simulate health check
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.random() > 0.1; // 90% success rate
  } catch (error) {
    return false;
  }
}