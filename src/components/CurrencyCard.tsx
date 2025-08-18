"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CurrencyRate } from '@/types/currency';
import { formatRate, formatChange, formatChangePercent } from '@/lib/currencyUtils';

interface CurrencyCardProps {
  currency: CurrencyRate;
  baseCurrency?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function CurrencyCard({ 
  currency, 
  baseCurrency = 'USD', 
  onClick,
  isSelected = false 
}: CurrencyCardProps) {
  const isPositive = currency.changePercent >= 0;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const trendBg = isPositive ? 'bg-green-50' : 'bg-red-50';
  const trendBorder = isPositive ? 'border-green-200' : 'border-red-200';

  return (
    <Card 
      className={`
        group relative overflow-hidden
        bg-white/80 backdrop-blur-sm border-gray-200
        hover:shadow-lg hover:shadow-blue-500/10
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
      `}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardContent className="p-6 relative z-10">
        {/* Currency header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {currency.flag && (
              <span className="text-2xl" title={currency.name}>
                {currency.flag}
              </span>
            )}
            <div>
              <h3 className="font-bold text-lg text-gray-900">{currency.code}</h3>
              <p className="text-sm text-gray-600 truncate max-w-[120px]">{currency.name}</p>
            </div>
          </div>
          
          {/* Trend indicator */}
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${trendBg} ${trendColor} ${trendBorder} border
          `}>
            <span className="flex items-center gap-1">
              {/* Trend arrow */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${isPositive ? 'rotate-0' : 'rotate-180'}`}
              >
                <path d="m7 14 5-5 5 5" />
              </svg>
              {formatChangePercent(Math.abs(currency.changePercent))}
            </span>
          </div>
        </div>
        
        {/* Exchange rate */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-gray-500">1 {baseCurrency} =</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatRate(currency.rate)}
            <span className="text-lg font-normal text-gray-600 ml-1">{currency.code}</span>
          </div>
        </div>
        
        {/* Change details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Change:</span>
            <span className={`font-medium ${trendColor}`}>
              {formatChange(currency.change)} {currency.code}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">24h %:</span>
            <span className={`font-bold ${trendColor}`}>
              {formatChangePercent(currency.changePercent)}
            </span>
          </div>
        </div>
        
        {/* Last updated */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Updated: {new Date(currency.lastUpdated).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        {/* Animated pulse for live updates */}
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
      
      {/* Click ripple effect */}
      {onClick && (
        <div className="absolute inset-0 bg-blue-500/10 scale-0 group-active:scale-100 transition-transform duration-150 origin-center rounded-lg"></div>
      )}
    </Card>
  );
}