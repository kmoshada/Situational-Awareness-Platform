import { CloudRain, Sun, Cloud, Wind } from "lucide-react";

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
        if (c.includes("rain")) return <CloudRain className="h-4 w-4 text-blue-400" />;
        if (c.includes("cloud")) return <Cloud className="h-4 w-4 text-gray-400" />;
        if (c.includes("clear") || c.includes("sun")) return <Sun className="h-4 w-4 text-yellow-400" />;
        return <Wind className="h-4 w-4 text-slate-400" />;
    };

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg backdrop-blur-md">
            <h3 className="mb-3 text-sm font-medium text-slate-300">Weather Overview</h3>
            <div className="grid grid-cols-2 gap-3">
                {summaries.slice(0, 4).map((w, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-slate-950/50 p-2 transition-colors hover:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            {getWeatherIcon(w.condition)}
                            <span className="text-sm text-slate-300">{w.city}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-200">{typeof w.temp === 'number' ? w.temp.toFixed(1) : w.temp}°C</span>
                    </div>
                ))}
                {summaries.length === 0 && <div className="text-xs text-slate-500">No weather data</div>}
            </div>
        </div>
    );
}
