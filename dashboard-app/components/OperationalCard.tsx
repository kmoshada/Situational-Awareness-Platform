"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OperationalData {
    weather: number; // 0-3
    traffic: number; // 0-100
    economic: number; // normalized 0-1
}

export function OperationalCard({ data }: { data: OperationalData }) {
    const chartData = [
        { name: 'Weather', value: data.weather * 33, original: data.weather, max: 3 }, // Normalize for display approx 0-100
        { name: 'Traffic', value: data.traffic, original: data.traffic, max: 100 },
        { name: 'Econ', value: data.economic * 100, original: data.economic, max: 1 }
    ];

    return (
        <Card className="shadow-xl border-slate-800 bg-slate-900/50">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-100">Operational Environment</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded border border-slate-700 bg-slate-900 p-2 text-xs text-white shadow-lg">
                                                <p className="font-semibold">{data.name}</p>
                                                <p>Value: {data.original}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={
                                        index === 0 ? '#3b82f6' : // Weather Blue
                                            index === 1 ? '#eab308' : // Traffic Yellow
                                                '#22c55e' // Econ Green
                                    } />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
