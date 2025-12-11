import { Brain, TrendingUp, AlertOctagon, Layers } from 'lucide-react';
import CardInfo from "./CardInfo";

interface MLInsightsProps {
    trends?: any[];
    anomalies?: any[];
    clusters?: string[];
}

export function MLInsights({ trends = [], anomalies = [], clusters = [] }: MLInsightsProps) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                        AI Intelligence
                        <CardInfo content="Machine learning generated insights identifying anomalies and clusters in the data." />
                    </h3>
                    <p className="text-sm text-slate-400">Real-time ML Analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trends Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span>Emerging Trends</span>
                    </div>
                    {trends.length > 0 ? (
                        <div className="space-y-2">
                            {trends.slice(0, 3).map((trend, i) => (
                                <div key={i} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 text-sm">
                                    <div className="font-medium text-slate-200">{trend.entity || trend.description}</div>
                                    {trend.count && (
                                        <div className="text-xs text-slate-500 mt-1">{trend.count} mentions in news</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 italic">No significant trends detected</div>
                    )}
                </div>

                {/* Anomalies Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <AlertOctagon className="w-4 h-4 text-red-400" />
                        <span>Anomalies</span>
                    </div>
                    {anomalies.length > 0 ? (
                        <div className="space-y-2">
                            {anomalies.map((anom, i) => (
                                <div key={i} className="bg-red-950/20 p-3 rounded-lg border border-red-900/30 text-sm">
                                    <div className="font-medium text-red-200">{anom.description}</div>
                                    <div className="text-xs text-red-400 mt-1 capitalize">{anom.severity} Severity • {anom.type}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-950/10 p-3 rounded-lg border border-green-900/20">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Normal
                        </div>
                    )}
                </div>

                {/* Clusters Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span>Event Clusters</span>
                    </div>
                    {clusters.length > 0 ? (
                        <div className="space-y-2">
                            {clusters.slice(0, 3).map((cluster, i) => (
                                <div key={i} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 text-sm">
                                    <div className="text-slate-300 line-clamp-2">{cluster}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 italic">Insufficient data to cluster</div>
                    )}
                </div>
            </div>
        </div>
    );
}
