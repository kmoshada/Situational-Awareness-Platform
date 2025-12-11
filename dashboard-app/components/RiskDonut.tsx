"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

import CardInfo from "./CardInfo";

interface RiskDonutProps {
    score: number;
    factors: string[];
}

export function RiskDonut({ score, factors }: RiskDonutProps) {
    // Determine color based on score
    let color = "text-green-500";
    let strokeColor = "#22c55e"; // green-500
    if (score >= 30) {
        color = "text-yellow-500";
        strokeColor = "#eab308"; // yellow-500
    }
    if (score >= 70) {
        color = "text-red-500";
        strokeColor = "#ef4444"; // red-500
    }

    // Calculate circle properties
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <Card className="h-full border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center">
                    Risk Score
                    <CardInfo content="Current aggregated risk verification score based on real-time analysis." />
                </CardTitle>
                <AlertTriangle className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                className="text-slate-800"
                                strokeWidth="10"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                            />
                            {/* Progress Circle */}
                            <circle
                                className="transition-all duration-1000 ease-out"
                                strokeWidth="10"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                stroke={strokeColor}
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                            />
                        </svg>
                        <div className={`absolute text-xl font-bold ${color}`}>
                            {Math.round(score)}
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-xs text-slate-400">Contributing Factors:</p>
                        <div className="space-y-1 max-h-[60px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                            {factors.length > 0 ? (
                                factors.map((factor, i) => (
                                    <div key={i} className="text-xs text-slate-300 flex items-center gap-1">
                                        <span className={`h-1.5 w-1.5 rounded-full ${score >= 70 ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                        {factor}
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-slate-500 italic">None detected</div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
