import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, trendValue, className }: StatCardProps) {
    return (
        <div className={cn("rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-slate-400">{title}</h3>
                <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-slate-100">{value}</div>
                {trend && (
                    <span className={cn("text-xs font-medium", {
                        "text-green-500": trend === "up",
                        "text-red-500": trend === "down",
                        "text-slate-500": trend === "neutral",
                    })}>
                        {trendValue}
                    </span>
                )}
            </div>
            {description && (
                <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
        </div>
    );
}
