"use client";

import React from 'react';

interface HeaderSectionProps {
  lastUpdated?: Date | null;
  isRefreshing?: boolean;
}

export default function HeaderSection({ lastUpdated, isRefreshing }: HeaderSectionProps) {
  const formatLastUpdated = (date: Date | null | undefined) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <header className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Currency Exchange
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-blue-100 font-light">
            Real-time monitoring & analytics
          </p>
          
          {/* Features highlight */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm md:text-base">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Rates</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Interactive Charts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>25+ Currencies</span>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex justify-center items-center gap-3 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span>{isRefreshing ? 'Updating...' : 'Live'}</span>
            </div>
            <div className="w-1 h-1 bg-blue-300 rounded-full opacity-50"></div>
            <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
          </div>
        </div>
      </div>
      
      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0,32L48,37.3C96,43,192,53,288,48C384,43,480,21,576,21.3C672,21,768,43,864,48C960,53,1056,43,1152,37.3C1248,32,1344,32,1392,32L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
            fill="currentColor"
            className="text-gray-50"
          />
        </svg>
      </div>
    </header>
  );
}