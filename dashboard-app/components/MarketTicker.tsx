import { TrendingUp, TrendingDown } from "lucide-react";

interface Stock {
    symbol: string;
    price: number;
    change: number;
    changePercentage: number;
}

interface MarketTickerProps {
    gainers: Stock[];
    losers: Stock[];
}

export function MarketTicker({ gainers, losers }: MarketTickerProps) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Gainers */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg backdrop-blur-md">
                <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <h3 className="text-sm font-medium text-slate-300">Top Gainers</h3>
                </div>
                <div className="space-y-2">
                    {gainers.slice(0, 5).map((stock, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-200">{stock.symbol}</span>
                            <div className="text-right">
                                <div className="text-slate-200">{stock.price.toFixed(2)}</div>
                                <div className="text-xs text-green-500">+{stock.changePercentage.toFixed(2)}%</div>
                            </div>
                        </div>
                    ))}
                    {gainers.length === 0 && <div className="text-xs text-slate-500">No data</div>}
                </div>
            </div>

            {/* Losers */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg backdrop-blur-md">
                <div className="mb-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <h3 className="text-sm font-medium text-slate-300">Top Losers</h3>
                </div>
                <div className="space-y-2">
                    {losers.slice(0, 5).map((stock, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-200">{stock.symbol}</span>
                            <div className="text-right">
                                <div className="text-slate-200">{stock.price.toFixed(2)}</div>
                                <div className="text-xs text-red-500">{stock.changePercentage.toFixed(2)}%</div>
                            </div>
                        </div>
                    ))}
                    {losers.length === 0 && <div className="text-xs text-slate-500">No data</div>}
                </div>
            </div>
        </div>
    );
}
