"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from '@/lib/utils';

interface Stock {
    symbol: string;
    name?: string;
    price?: number;
    change?: number;
    changePercent?: number;
    // Fallback for API variations
    [key: string]: any;
}

interface MarketMoversProps {
    gainers: Stock[];
    losers: Stock[];
}

export default function MarketMovers({ gainers, losers }: MarketMoversProps) {
    // Combine top gainers for the list
    const formatStock = (stock: Stock) => {
        const symbol = stock.symbol || stock.code || "UNKNOWN";
        const price = stock.price || stock.lastTradedPrice || 0;
        const change = stock.change || stock.changeAmount || 0;
        const pct = stock.changePercent || stock.percentageChange || stock.changePercentage || 0;
        return { symbol, price, change, pct };
    };

    const topStocks = (gainers || []).slice(0, 5).map(formatStock);

    return (
        <Card className="bg-white border-none card-shadow h-full rounded-3xl p-6">
            <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-brand-dark flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-brand-dark" /> Top Performing Stocks
                </CardTitle>
                <button className="text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50">
                    Get Report for
                </button>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                <div className="flex justify-between text-xs text-gray-400 font-medium border-b border-gray-100 pb-2">
                    <span>Symbol</span>
                    <div className="flex gap-8">
                        <span>Percentage</span>
                        <span>Price</span>
                    </div>
                </div>
                {topStocks.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">No data available</div>
                ) : (
                    topStocks.map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`h-6 w-8 rounded-sm ${i % 2 === 0 ? 'bg-red-100' : 'bg-blue-100'} flex items-center justify-center text-xs font-bold text-gray-600`}>
                                    {s.symbol.substring(0, 2)}
                                </div>
                                <span className="text-sm font-bold text-brand-dark">{s.symbol}</span>
                            </div>
                            <div className="flex items-center gap-8 w-1/2 justify-end">
                                <span className="text-sm font-medium text-gray-600 w-16 text-right">{s.pct.toFixed(2)}%</span>
                                <span className="text-sm font-bold text-brand-dark w-16 text-right">{s.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}