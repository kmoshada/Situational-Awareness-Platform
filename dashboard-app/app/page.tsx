"use client"

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { Activity, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { MarketTicker } from '@/components/MarketTicker';
import { NewsFeed } from '@/components/NewsFeed';
import { WeatherWidget } from '@/components/WeatherWidget';

import { EventsCard } from '@/components/EventsCard';
import { ExchangeRateCard } from '@/components/ExchangeRateCard';
import { MLInsights } from '@/components/MLInsights';

// Dynamic import for Map to avoid SSR issues
const TrafficMap = dynamic(() => import('@/components/TrafficMap'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-slate-900 animate-pulse rounded-xl" />
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const { data: signals } = useSWR(`${API_URL}/api/signals`, fetcher, { refreshInterval: 5000 });
    const { data: market } = useSWR(`${API_URL}/api/market`, fetcher, { refreshInterval: 5000 });
    const { data: risk } = useSWR(`${API_URL}/api/risk`, fetcher, { refreshInterval: 5000 });
    const { data: opportunities } = useSWR(`${API_URL}/api/opportunities`, fetcher, { refreshInterval: 5000 });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 lg:p-8 font-sans">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Situational Awareness</h1>
                        <p className="text-slate-400 mt-2">Real-time National Intelligence Dashboard</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-400">System Live</span>
                    </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="National Activity"
                        value={signals?.national_activity_score ?? "-"}
                        icon={Activity}
                        description="Composite activity index"
                        trend="up"
                        trendValue="+2.5%"
                    />
                    <StatCard
                        title="Risk Score"
                        value={risk?.score ? (risk.score * 100).toFixed(0) : "-"}
                        icon={AlertTriangle}
                        description="Overall risk assessment"
                        trend={risk?.score > 0.5 ? "down" : "neutral"}
                        trendValue={risk?.score > 0.5 ? "High" : "Normal"}
                        className={risk?.score > 0.5 ? "border-red-900/50 bg-red-950/10" : ""}
                    />
                    <StatCard
                        title="Opportunity Score"
                        value={opportunities?.score ? (opportunities.score * 100).toFixed(0) : "-"}
                        icon={Zap}
                        description="Market opportunity index"
                        trend="up"
                        trendValue="Good"
                    />
                    <StatCard
                        title="Market Volatility"
                        value={signals?.market_volatility_percent ? `${signals.market_volatility_percent.toFixed(1)}%` : "-"}
                        icon={TrendingUp}
                        description="Probability of disruption"
                        trend="neutral"
                        trendValue="Stable"
                    />
                </div>

                {/* AI Insights Section */}
                <MLInsights
                    trends={signals?.trends}
                    anomalies={signals?.anomalies}
                    clusters={signals?.clusters}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Map & Traffic (Span 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        <TrafficMap data={signals?.traffic?.raw || []} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MarketTicker
                                gainers={market?.gainers || []}
                                losers={market?.losers || []}
                            />
                            <ExchangeRateCard rates={signals?.cbsl?.raw?.rates || {}} />
                        </div>


                    </div>

                    {/* Right Column: News, Weather, Events (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <NewsFeed news={signals?.news?.latest || []} />
                        <WeatherWidget summaries={signals?.weather?.summaries || []} />
                        <EventsCard events={signals?.events?.upcoming || []} />
                    </div>

                </div>
            </div>
        </div>
    );
}

