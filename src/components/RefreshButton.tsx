"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  className?: string;
}

export default function RefreshButton({ onRefresh, isRefreshing, className = '' }: RefreshButtonProps) {
  return (
    <Button
      onClick={onRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
      className={`
        relative overflow-hidden group
        border-blue-200 hover:border-blue-300
        text-blue-700 hover:text-blue-800
        bg-white/80 hover:bg-blue-50/80
        backdrop-blur-sm transition-all duration-200
        ${className}
      `}
    >
      {/* Refresh icon */}
      <div className={`
        mr-2 transition-transform duration-500
        ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}
      `}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </div>
      
      {/* Button text */}
      <span className="relative z-10">
        {isRefreshing ? 'Updating...' : 'Refresh'}
      </span>
      
      {/* Animated background on hover */}
      <div className="
        absolute inset-0 
        bg-gradient-to-r from-blue-500/10 to-purple-500/10 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-200
        -z-10
      "></div>
    </Button>
  );
}