"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CurrencyRate, RefreshState } from '@/types/currency';
import { fetchCurrentRates, checkApiHealth } from '@/lib/currencyApi';
import { REFRESH_INTERVAL, BASE_CURRENCY, POPULAR_CURRENCIES } from '@/lib/constants';
import { debounce } from '@/lib/currencyUtils';

import HeaderSection from './HeaderSection';
import CurrencyCard from './CurrencyCard';
import CurrencySelector from './CurrencySelector';
import CurrencyChart from './CurrencyChart';
import RefreshButton from './RefreshButton';

export default function CurrencyDashboard() {
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(
    POPULAR_CURRENCIES.slice(0, 6).map(c => c.code) // Default to first 6 popular currencies
  );
  const [selectedChartCurrency, setSelectedChartCurrency] = useState<string>('EUR');
  const [refreshState, setRefreshState] = useState<RefreshState>({
    isRefreshing: false,
    lastRefresh: null,
    error: null,
  });
  const [apiHealth, setApiHealth] = useState(true);

  // Debounced API health check
  const debouncedHealthCheck = useCallback(
    debounce(async () => {
      const health = await checkApiHealth();
      setApiHealth(health);
    }, 5000),
    []
  );

  // Fetch currency rates
  const fetchRates = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setRefreshState(prev => ({ ...prev, isRefreshing: true, error: null }));
    }

    try {
      const rates = await fetchCurrentRates(BASE_CURRENCY);
      
      // Filter rates to only show selected currencies
      const filteredRates = rates.filter(rate => 
        selectedCurrencies.includes(rate.code)
      );
      
      setCurrencyRates(filteredRates);
      setRefreshState(prev => ({
        ...prev,
        isRefreshing: false,
        lastRefresh: new Date(),
        error: null,
      }));
      
      // Check API health
      debouncedHealthCheck();
    } catch (error) {
      console.error('Error fetching rates:', error);
      setRefreshState(prev => ({
        ...prev,
        isRefreshing: false,
        error: error instanceof Error ? error.message : 'Failed to fetch rates',
      }));
    }
  }, [selectedCurrencies, debouncedHealthCheck]);

  // Manual refresh handler
  const handleManualRefresh = useCallback(() => {
    fetchRates(true);
  }, [fetchRates]);

  // Auto-refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (selectedCurrencies.length > 0) {
      // Initial fetch
      fetchRates(true);
      
      // Set up auto-refresh
      intervalId = setInterval(() => {
        if (apiHealth) {
          fetchRates(false); // Silent refresh
        }
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedCurrencies, fetchRates, apiHealth]);

  // Handle currency selection changes
  const handleCurrencyToggle = useCallback((currencyCode: string) => {
    setSelectedCurrencies(prev => {
      const isSelected = prev.includes(currencyCode);
      if (isSelected) {
        return prev.filter(code => code !== currencyCode);
      } else {
        return [...prev, currencyCode];
      }
    });
  }, []);

  // Handle chart currency change
  const handleChartCurrencyChange = useCallback((currency: string) => {
    setSelectedChartCurrency(currency);
  }, []);

  // Get available currencies for chart (from selected currencies)
  const availableChartCurrencies = selectedCurrencies.length > 0 
    ? selectedCurrencies 
    : ['EUR', 'GBP', 'JPY'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <HeaderSection 
        lastUpdated={refreshState.lastRefresh}
        isRefreshing={refreshState.isRefreshing}
      />

      {/* Main content */}
      <main className="container mx-auto px-4 pb-12 -mt-16 relative z-10">
        {/* Controls section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <RefreshButton 
              onRefresh={handleManualRefresh}
              isRefreshing={refreshState.isRefreshing}
            />
            
            {/* API Status indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${apiHealth ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600">
                API: {apiHealth ? 'Healthy' : 'Issues detected'}
              </span>
            </div>
          </div>

          {/* Error message */}
          {refreshState.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {refreshState.error}
            </div>
          )}
        </div>

        {/* Currency Selection */}
        <div className="mb-8">
          <CurrencySelector
            selectedCurrencies={selectedCurrencies}
            onCurrencyToggle={handleCurrencyToggle}
            maxSelections={8}
          />
        </div>

        {/* Currency Cards Grid */}
        {selectedCurrencies.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Exchange Rates</h2>
            
            {currencyRates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currencyRates.map((currency) => (
                  <CurrencyCard
                    key={currency.code}
                    currency={currency}
                    baseCurrency={BASE_CURRENCY}
                    onClick={() => setSelectedChartCurrency(currency.code)}
                    isSelected={selectedChartCurrency === currency.code}
                  />
                ))}
              </div>
            ) : refreshState.isRefreshing ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: selectedCurrencies.length }).map((_, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">Unable to load currency rates</p>
                <RefreshButton 
                  onRefresh={handleManualRefresh}
                  isRefreshing={refreshState.isRefreshing}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Currencies to Monitor</h3>
              <p className="text-gray-600">Choose from the available currencies above to start monitoring live exchange rates.</p>
            </div>
          </div>
        )}

        {/* Interactive Chart */}
        {selectedCurrencies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historical Trends</h2>
            <CurrencyChart
              baseCurrency={BASE_CURRENCY}
              targetCurrency={selectedChartCurrency}
              onCurrencyChange={handleChartCurrencyChange}
              availableCurrencies={availableChartCurrencies}
            />
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
          <p className="mb-2">
            Exchange rates are updated every {REFRESH_INTERVAL / 1000} seconds from multiple financial data sources.
          </p>
          <p>
            Rates are indicative and may vary from actual trading rates. For real-time trading, please consult your financial institution.
          </p>
        </div>
      </main>
    </div>
  );
}