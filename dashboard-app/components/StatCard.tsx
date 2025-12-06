import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendValue,
    className,
}: StatCardProps) {
    return (
        <Card className={cn("hover:bg-slate-900/50 transition-colors", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="flex items-center text-xs text-slate-500 mt-1">
                    {trend === "up" && (
                        <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                    )}
                    {trend === "down" && (
                        <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    {trend === "neutral" && (
                        <Minus className="mr-1 h-3 w-3 text-slate-500" />
                    )}
                    <span
                        className={cn(
                            trend === "up" && "text-green-500",
                            trend === "down" && "text-red-500",
                            trend === "neutral" && "text-slate-500"
                        )}
                    >
                        {trendValue}
                    </span>
                    <span className="ml-2 truncate">{description}</span>
                </div>
            </CardContent>
        </Card>
    );
}
