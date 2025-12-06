"use client"

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from "framer-motion";


import ActivityCard from "@/components/ActivityCard";
import RiskDonut from "@/components/RiskDonut";
import AlertsPanel from "@/components/AlertsPanel";
import MarketMovers from "@/components/MarketMovers";
import EventsCard from "@/components/EventsCard";
import WeatherCard from "@/components/WeatherCard";
import ExchangeRateCard from "@/components/ExchangeRateCard";
import TrafficMap from "@/components/TrafficMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Car, Shield, CloudRain, ChevronDown, ChevronLeft, ThumbsUp, Paperclip, Users, Key, AlertTriangle, MoreVertical, Plus } from "lucide-react";

// Note: Sidebar import removed as it is provided by the RootLayout

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: signals, isLoading: signalsLoading } = useSWR("/api/signals", fetcher, { refreshInterval: 5000 });
  const { data: risk, isLoading: riskLoading } = useSWR("/api/risk", fetcher, { refreshInterval: 5000 });
  const { data: opportunities, isLoading: oppsLoading } = useSWR("/api/opportunities", fetcher, { refreshInterval: 5000 });
  const { data: market, isLoading: marketLoading } = useSWR("/api/market", fetcher, { refreshInterval: 5000 });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Transform backend data to UI format
  const alerts: { title: string; description: string; level: string }[] = [];
  if (risk?.factors) {
    risk.factors.forEach((f: string) => alerts.push({ title: "Risk Alert", description: f, level: "high" }));
  }
  if (opportunities?.factors) {
    opportunities.factors.forEach((f: string) => alerts.push({ title: "Opportunity", description: f, level: "low" }));
  }
  if (signals?.anomalies) {
    signals.anomalies.forEach((a: { type: string; description: string }) => alerts.push({ title: "Anomaly", description: a.description, level: "medium" }));
  }

  const activityData = {
    score: signals?.national_activity_score,
    news_count: signals?.raw_counts?.news,
    market_moves: signals?.raw_counts?.cse_gainers,
    history: signals?.activity_history || []
  };

  return (
    <div className="p-6 min-h-screen text-white font-sans flex gap-6">

      {/* Main Content Column */}
      <div className="flex-1 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold">Stats</h1>
            <p className="text-gray-400 text-sm">MONTHLY UPDATES</p>
          </div>

        </div>

        {/* Top Chart Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <ActivityCard data={activityData} />
        </motion.div>

        {/* Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Risk */}
          <motion.div className="card-gradient-1 rounded-3xl p-6 relative overflow-hidden min-h-[180px] flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Risk Score</div>
              <div className="text-3xl font-bold">{risk?.score ? (risk.score * 100).toFixed(0) : 0}</div>
            </div>
            <div className="text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded w-fit">-12%</div>

          </motion.div>

          {/* Card 2: Tasks (Weather) */}
          <motion.div className="card-gradient-2 rounded-3xl p-6 relative overflow-hidden min-h-[180px] flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Weather Alerts</div>
              <div className="text-3xl font-bold">{signals?.weather?.alerts?.length || 0}</div>
            </div>
            <div className="text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded w-fit">+5%</div>

          </motion.div>

          {/* Card 3: Objectives (Traffic) */}
          <motion.div className="card-gradient-3 rounded-3xl p-6 relative overflow-hidden min-h-[180px] flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Traffic Incidents</div>
              <div className="text-3xl font-bold">{signals?.traffic?.incident_count || 0}</div>
            </div>
            <div className="text-xs text-red-300 bg-red-500/10 px-2 py-1 rounded w-fit">-4%</div>

          </motion.div>

          {/* Card 4: Project (Market) */}
          <motion.div className="card-gradient-4 rounded-3xl p-6 relative overflow-hidden min-h-[180px] flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Market Volatility</div>
              <div className="text-3xl font-bold">{signals?.market_volatility_percent ? `${signals.market_volatility_percent.toFixed(0)}%` : "0%"}</div>
            </div>
            <div className="text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded w-fit">+8%</div>

          </motion.div>
        </div>



      </div>

      {/* Right Panel */}
      <div className="w-80 hidden xl:block space-y-6">
        <div className="card-dark p-6 h-full">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-brand rounded-lg flex items-center justify-center text-black font-bold">=</div>
              <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center text-gray-400">||</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ChevronLeft className="h-4 w-4" />
              <span>Today, 12 Dec.</span>
            </div>
          </div>

          <div className="space-y-6 relative">
            {/* Timeline Line */}
            <div className="absolute left-[50px] top-0 bottom-0 w-[1px] bg-white/10"></div>

            {/* Events */}
            {alerts.slice(0, 5).map((alert, i) => (
              <div key={i} className="relative z-10">
                <div className="text-xs text-gray-500 mb-2 pl-[60px]">0{8 + i}:00 am</div>
                <div className="bg-[#252525] p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{alert.title}</div>
                    <div className="text-xs text-gray-500 truncate">{alert.description}</div>
                  </div>
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            ))}

            <div className="mt-8 flex justify-end">
              <button className="h-12 w-12 rounded-full bg-brand flex items-center justify-center text-black shadow-lg shadow-brand/20 hover:scale-105 transition-transform">
                <Plus className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}