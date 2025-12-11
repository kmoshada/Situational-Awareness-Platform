import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, CloudLightning, Sun, CloudFog } from "lucide-react";

import CardInfo from "./CardInfo";

interface WeatherSummary {
    city: string;
    temp: number | string;
    condition: string;
}

interface WeatherWidgetProps {
    summaries: WeatherSummary[];
}

export function WeatherWidget({ summaries }: WeatherWidgetProps) {
    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes("rain")) return <CloudRain className="h-5 w-5 text-blue-400" />;
        if (c.includes("thunder") || c.includes("storm")) return <CloudLightning className="h-5 w-5 text-yellow-400" />;
        if (c.includes("cloud")) return <Cloud className="h-5 w-5 text-slate-400" />;
        if (c.includes("clear") || c.includes("sun")) return <Sun className="h-5 w-5 text-orange-400" />;
        return <CloudFog className="h-5 w-5 text-slate-500" />;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-slate-200" />
                    Weather Conditions
                    <CardInfo content="Current weather updates for key economic zones." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-3">
                    {summaries.map((summary, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800"
                        >
                            <div className="flex items-center gap-3">
                                {getWeatherIcon(summary.condition)}
                                <div>
                                    <div className="font-medium text-slate-200">{summary.city}</div>
                                    <div className="text-xs text-slate-500 capitalize">{summary.condition}</div>
                                </div>
                            </div>
                            <div className="text-lg font-bold text-slate-100">
                                {typeof summary.temp === 'number' ? Math.round(summary.temp) : summary.temp}°C
                            </div>
                        </div>
                    ))}
                    {summaries.length === 0 && (
                        <div className="text-center text-slate-500 py-4">
                            No weather data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
