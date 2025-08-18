"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ALL_CURRENCIES, POPULAR_CURRENCIES } from '@/lib/constants';
import { CurrencyInfo } from '@/types/currency';

interface CurrencySelectorProps {
  selectedCurrencies: string[];
  onCurrencyToggle: (currencyCode: string) => void;
  maxSelections?: number;
}

export default function CurrencySelector({ 
  selectedCurrencies, 
  onCurrencyToggle, 
  maxSelections = 12 
}: CurrencySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter currencies based on search term
  const filteredCurrencies = useMemo(() => {
    const currenciesToShow = showAll ? ALL_CURRENCIES : POPULAR_CURRENCIES;
    
    if (!searchTerm) return currenciesToShow;
    
    return currenciesToShow.filter(currency =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, showAll]);

  const handleCurrencyClick = (currencyCode: string) => {
    const isSelected = selectedCurrencies.includes(currencyCode);
    
    if (isSelected) {
      onCurrencyToggle(currencyCode);
    } else if (selectedCurrencies.length < maxSelections) {
      onCurrencyToggle(currencyCode);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Currency Selection</h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose up to {maxSelections} currencies to monitor ({selectedCurrencies.length}/{maxSelections} selected)
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Show all toggle */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {showAll ? 'Show Popular Only' : 'Show All Currencies'}
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              {showAll ? ALL_CURRENCIES.length : POPULAR_CURRENCIES.length}
            </span>
          </Button>
          
          {selectedCurrencies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedCurrencies.forEach(code => onCurrencyToggle(code))}
              className="text-gray-600 hover:text-red-600"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Currency grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
          {filteredCurrencies.map((currency: CurrencyInfo) => {
            const isSelected = selectedCurrencies.includes(currency.code);
            const canSelect = selectedCurrencies.length < maxSelections || isSelected;
            
            return (
              <button
                key={currency.code}
                onClick={() => handleCurrencyClick(currency.code)}
                disabled={!canSelect}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border text-left
                  transition-all duration-200 group
                  ${isSelected 
                    ? 'bg-blue-50 border-blue-300 text-blue-900' 
                    : canSelect
                      ? 'bg-white/50 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {/* Flag and currency info */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{currency.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{currency.code}</div>
                    <div className="text-xs opacity-75 truncate">{currency.name}</div>
                  </div>
                </div>
                
                {/* Selection indicator */}
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${isSelected 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 group-hover:border-blue-400'
                  }
                `}>
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* No results message */}
        {filteredCurrencies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No currencies found matching "{searchTerm}"</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="mt-2 text-blue-600"
            >
              Clear search
            </Button>
          </div>
        )}

        {/* Selection limit message */}
        {selectedCurrencies.length >= maxSelections && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Maximum selection limit reached. Deselect a currency to choose a different one.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}