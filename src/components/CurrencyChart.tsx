"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartData, TimeFrame } from '@/types/currency';
import { TIME_FRAMES } from '@/lib/constants';
import { formatDateForChart, convertHistoricalToChartData } from '@/lib/currencyUtils';
import { fetchHistoricalRates } from '@/lib/currencyApi';

interface CurrencyChartProps {
  baseCurrency: string;
  targetCurrency: string;
  onCurrencyChange?: (currency: string) => void;
  availableCurrencies?: string[];
}

export default function CurrencyChart({ 
  baseCurrency, 
  targetCurrency, 
  onCurrencyChange,
  availableCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']
}: CurrencyChartProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('7D');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  // Calculate days based on timeframe
  const getDaysFromTimeFrame = (timeFrame: TimeFrame): number => {
    switch (timeFrame) {
      case '1D': return 1;
      case '7D': return 7;
      case '30D': return 30;
      case '3M': return 90;
      default: return 7;
    }
  };

  // Fetch historical data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const days = getDaysFromTimeFrame(selectedTimeFrame);
        const historicalData = await fetchHistoricalRates(baseCurrency, targetCurrency, days);
        const chartData = convertHistoricalToChartData(historicalData);
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [baseCurrency, targetCurrency, selectedTimeFrame]);

  // Calculate price change for the period
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return { change: 0, changePercent: 0 };
    
    const firstPrice = chartData[0]?.rate || 0;
    const lastPrice = chartData[chartData.length - 1]?.rate || 0;
    const change = lastPrice - firstPrice;
    const changePercent = firstPrice !== 0 ? (change / firstPrice) * 100 : 0;
    
    return { change, changePercent };
  }, [chartData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-1">
            {formatDateForChart(label, selectedTimeFrame)}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            1 {baseCurrency} = {data.value?.toFixed(6)} {targetCurrency}
          </p>
        </div>
      );
    }
    return null;
  };

  const isPositiveChange = priceChange.changePercent >= 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Chart title */}
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-1">
              {baseCurrency}/{targetCurrency} Exchange Rate
            </CardTitle>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600">
                Current: {chartData[chartData.length - 1]?.rate?.toFixed(6) || '0.000000'}
              </span>
              <span className={`flex items-center gap-1 font-medium ${
                isPositiveChange ? 'text-green-600' : 'text-red-600'
              }`}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${isPositiveChange ? 'rotate-0' : 'rotate-180'}`}
                >
                  <path d="m7 14 5-5 5 5" />
                </svg>
                {isPositiveChange ? '+' : ''}{priceChange.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Currency selector */}
            <Select value={targetCurrency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-20 bg-white/50 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map(currency => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chart type toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={chartType === 'area' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('area')}
                className="h-8 px-3 text-xs"
              >
                Area
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className="h-8 px-3 text-xs"
              >
                Line
              </Button>
            </div>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex gap-2 mt-4">
          {TIME_FRAMES.map((timeFrame) => (
            <Button
              key={timeFrame.value}
              variant={selectedTimeFrame === timeFrame.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeFrame(timeFrame.value as TimeFrame)}
              className={`
                ${selectedTimeFrame === timeFrame.value 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                }
              `}
            >
              {timeFrame.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart container */}
        <div className="h-80 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading chart data...</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="mb-2">No chart data available</p>
                <p className="text-sm">Try selecting a different currency or timeframe</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => formatDateForChart(value, selectedTimeFrame)}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => value.toFixed(4)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorRate)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#3B82F6' }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => formatDateForChart(value, selectedTimeFrame)}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => value.toFixed(4)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#3B82F6' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Chart stats */}
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-600">Highest</p>
              <p className="text-sm font-semibold text-gray-900">
                {Math.max(...chartData.map(d => d.rate)).toFixed(6)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Lowest</p>
              <p className="text-sm font-semibold text-gray-900">
                {Math.min(...chartData.map(d => d.rate)).toFixed(6)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Change</p>
              <p className={`text-sm font-semibold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveChange ? '+' : ''}{priceChange.change.toFixed(6)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Change %</p>
              <p className={`text-sm font-semibold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveChange ? '+' : ''}{priceChange.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}