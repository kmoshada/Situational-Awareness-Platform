import { AlertTriangle, Info, Lightbulb } from "lucide-react";

export default function AlertsPanel({ alerts }: { alerts: any[] }) {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-brand/20 border-brand/50 backdrop-blur-sm rounded-lg p-4 h-full flex items-center justify-center">
                <div className="text-brand/50 text-center">No active alerts</div>
            </div>
        );
    }

    const getIcon = (level: string) => {
        if (level === "high") return <AlertTriangle className="h-5 w-5 text-red-400" />;
        if (level === "medium") return <Info className="h-5 w-5 text-yellow-400" />;
        return <Lightbulb className="h-5 w-5 text-green-400" />;
    }

    return (
        <div className="space-y-3 overflow-y-auto max-h-[200px] bg-brand/20 border-brand/50 backdrop-blur-sm rounded-lg p-4">
            {alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-brand/10 border border-brand/30">
                    <div className="flex-shrink-0 mt-1">
                        {getIcon(a.level)}
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${a.level === "high" ? "text-red-400" :
                            a.level === "medium" ? "text-yellow-400" :
                                "text-green-400"
                            }`}>{a.title}</h4>
                        <p className="text-sm text-brand/80">{a.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}