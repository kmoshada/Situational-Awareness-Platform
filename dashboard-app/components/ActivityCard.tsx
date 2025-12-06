import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Newspaper } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ActivityData {
    score: number;
    news_count: number;
    market_moves: number;
    history: any[];
}

export default function ActivityCard({ data }: { data: ActivityData }) {
    // Mock data for the bar chart to match the reference "Weekly Invoices"
    const weeklyData = [
        { name: '12 Oct', value: 40 },
        { name: '19 Oct', value: 60 },
        { name: '26 Oct', value: 45 },
        { name: '03 Nov', value: 70 },
        { name: '10 Nov', value: 50 },
        { name: '17 Nov', value: 80 },
        { name: '24 Nov', value: 60 },
    ];

    return (
        <div className="card-dark p-8 relative overflow-hidden min-h-[300px]">
            <div className="flex flex-col md:flex-row gap-8 relative z-10">

                {/* Left Side: Daily Sales Activity */}
                <div className="flex-1">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white">Daily Sales Activity</h2>
                        <p className="text-sm text-gray-500">Today vs Yesterday</p>
                    </div>

                    <div className="relative h-[200px] w-full">
                        {/* Bubbles Visualization */}
                        <div className="absolute top-10 left-10 h-24 w-24 rounded-full bg-brand flex flex-col items-center justify-center text-black shadow-[0_0_30px_rgba(204,255,0,0.3)] z-20 animate-pulse">
                            <span className="text-xl font-bold">$350.00</span>
                            <span className="text-xs font-medium">Apr 2023</span>
                        </div>
                        <div className="absolute top-20 left-40 h-16 w-16 rounded-full bg-[#ff7e67] flex items-center justify-center text-black font-bold text-sm shadow-lg z-10">
                            $2200
                        </div>
                        <div className="absolute top-40 left-32 h-14 w-14 rounded-full bg-[#fbbf24] shadow-lg opacity-80"></div>
                        <div className="absolute top-32 left-0 h-10 w-10 rounded-full bg-[#a78bfa] shadow-lg opacity-80"></div>

                        {/* Axis Lines */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-white/10"></div>
                        <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-white/5 border-dashed border-l border-white/10"></div>
                        <div className="absolute top-0 bottom-0 left-2/4 w-[1px] bg-white/5 border-dashed border-l border-white/10"></div>
                        <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-white/5 border-dashed border-l border-white/10"></div>
                    </div>
                </div>

                {/* Right Side: Weekly Invoices */}
                <div className="w-full md:w-1/3 bg-[#18181b] rounded-2xl p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-white">Weekly Invoices</h3>
                            <p className="text-xs text-gray-500">From 12 Oct - 24 Nov</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-brand" />
                        </div>
                    </div>

                    <div className="h-[120px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#e5e7eb', fontSize: '12px' }}
                                />
                                <Bar dataKey="value" fill="#ccff00" radius={[4, 4, 4, 4]} barSize={8} />
                                <Bar dataKey="value" fill="#52525b" radius={[4, 4, 4, 4]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
                        <div>
                            <div className="text-xs text-gray-500">Minimum</div>
                            <div className="text-lg font-bold text-white">24,170</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500">Maximum</div>
                            <div className="text-lg font-bold text-white">28,170</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}