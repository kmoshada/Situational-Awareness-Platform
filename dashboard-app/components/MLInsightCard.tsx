"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MLData {
    iso_flag: boolean;
    iso_score: number;
    risk_prob: number;
}

export function MLInsightCard({ data }: { data: MLData }) {
    const pieData = [
        { name: "Risk", value: data.risk_prob },
        { name: "Safe", value: 100 - data.risk_prob },
    ];

    return (
        <Card className="relative overflow-hidden shadow-xl border-slate-800 bg-slate-900/50">
            {data.iso_flag && (
                <div className="absolute top-0 left-0 w-full bg-red-600 py-1 text-center text-xs font-bold text-white animate-pulse z-10">
                    ANOMALY DETECTED
                </div>
            )}
            <CardHeader className={data.iso_flag ? "pt-8" : ""}>
                <CardTitle className="text-xl font-bold text-slate-100">ML Insights</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="h-[160px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            >
                                <Cell fill="#ef4444" />
                                <Cell fill="#334155" />
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                itemStyle={{ color: '#f1f5f9' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-100">{data.risk_prob}%</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Risk</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 w-full rounded bg-slate-800/50 p-3 border border-slate-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Isolation Score</span>
                        <span className={`font-mono font-medium ${data.iso_score < -0.5 ? "text-red-400" : "text-slate-200"}`}>
                            {data.iso_score.toFixed(3)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
