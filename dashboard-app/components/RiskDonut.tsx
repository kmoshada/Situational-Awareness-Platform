"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function RiskDonut({ value }: { value: number }) {
    const data = [
        { name: "Risk", value: value },
        { name: "Safe", value: 1 - value },
    ];

    const COLORS = ['#f97316', '#1e293b']; // Orange and Dark Blue

    return (
        <Card className="bg-white border-none card-shadow text-slate-800 flex flex-col h-full rounded-3xl p-4">
            <CardHeader className="pb-0 pt-2 px-2">
                <CardTitle className="text-base font-bold text-brand-dark flex items-center gap-2">
                    <Shield className="h-5 w-5 text-brand-dark" /> Today's Increase
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
                <div className="relative h-[180px] w-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                startAngle={180}
                                endAngle={0}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={10}
                                paddingAngle={5}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#1e293b' }}
                                formatter={(val: number) => `${(val * 100).toFixed(0)}%`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <div className="text-4xl font-bold text-brand-dark">
                            {(value * 100).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Total Sales</div>
                    </div>
                </div>
                <div className="flex justify-around w-full mt-[-20px]">
                    <div className="text-center">
                        <div className="text-xs text-gray-400">Duckticket</div>
                        <div className="font-bold text-brand-dark">293</div>
                        <div className="h-1 w-8 bg-brand rounded-full mx-auto mt-1"></div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400">Seevent</div>
                        <div className="font-bold text-brand-dark">161</div>
                        <div className="h-1 w-8 bg-brand-dark rounded-full mx-auto mt-1"></div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400">Ticketing</div>
                        <div className="font-bold text-brand-dark">117</div>
                        <div className="h-1 w-8 bg-gray-300 rounded-full mx-auto mt-1"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}