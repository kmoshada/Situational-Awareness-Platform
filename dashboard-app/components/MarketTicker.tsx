import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Stock {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
}

interface MarketTickerProps {
    gainers: Stock[];
    losers: Stock[];
}

export function MarketTicker({ gainers, losers }: MarketTickerProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Market Movers
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                        Top Gainers <TrendingUp className="h-3 w-3" />
                    </h4>
                    <div className="space-y-2">
                        {gainers.slice(0, 3).map((stock) => (
                            <div
                                key={stock.symbol}
                                className="flex justify-between items-center text-sm bg-green-950/20 p-2 rounded border border-green-900/30"
                            >
                                <span className="font-bold text-slate-200">{stock.symbol}</span>
                                <div className="text-right">
                                    <div className="text-slate-100">{(stock.price || 0).toFixed(2)}</div>
                                    <div className="text-green-500 text-xs">
                                        +{(stock.changePercent || 0).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                        {gainers.length === 0 && (
                            <div className="text-xs text-slate-500 italic">No gainers data</div>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                        Top Losers <TrendingDown className="h-3 w-3" />
                    </h4>
                    <div className="space-y-2">
                        {losers.slice(0, 3).map((stock) => (
                            <div
                                key={stock.symbol}
                                className="flex justify-between items-center text-sm bg-red-950/20 p-2 rounded border border-red-900/30"
                            >
                                <span className="font-bold text-slate-200">{stock.symbol}</span>
                                <div className="text-right">
                                    <div className="text-slate-100">{(stock.price || 0).toFixed(2)}</div>
                                    <div className="text-red-500 text-xs">
                                        {(stock.changePercent || 0).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                        {losers.length === 0 && (
                            <div className="text-xs text-slate-500 italic">No losers data</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
