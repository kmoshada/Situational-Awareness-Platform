import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CloudRain, Sun, Cloud, Wind, CloudLightning } from "lucide-react";

interface WeatherSummary {
    city: string;
    temp: number | string;
    condition: string;
}

interface WeatherCardProps {
    severity: number;
    alertsCount: number;
    summaries: WeatherSummary[];
}

export default function WeatherCard({ severity, alertsCount, summaries }: WeatherCardProps) {

    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes("rain")) return <CloudRain className="h-3 w-3 text-blue-400" />;
        if (c.includes("storm") || c.includes("thunder")) return <CloudLightning className="h-3 w-3 text-yellow-400" />;
        if (c.includes("cloud")) return <Cloud className="h-3 w-3 text-gray-400" />;
        if (c.includes("wind")) return <Wind className="h-3 w-3 text-gray-300" />;
        return <Sun className="h-3 w-3 text-yellow-500" />;
    };

    return (
        <Card className="bg-brand/20 border-brand/50 backdrop-blur-sm text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <CloudRain className="h-4 w-4" /> Weather Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-2xl font-bold">{severity > 0 ? "High Risk" : "Normal"}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {alertsCount} Active Alerts
                        </div>
                    </div>
                </div>

                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                    {summaries && summaries.length > 0 ? (
                        summaries.map((s, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-700 pb-1 last:border-0">
                                <span className="text-gray-300">{s.city}</span>
                                <div className="flex items-center gap-2">
                                    {getWeatherIcon(s.condition)}
                                    <span className="font-mono text-gray-400">{s.temp}°C</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-500 italic">No weather data</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
