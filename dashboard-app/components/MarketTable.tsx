import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // We need to create this or use simple HTML
// Since I haven't created ui/table yet, I'll use standard HTML for now to avoid dependency hell, or create ui/table.
// Let's create a simple table structure inside.

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StockPrice {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
}

interface MarketTableProps {
    stocks: StockPrice[];
}

export function MarketTable({ stocks }: MarketTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Symbol</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Change</th>
                                <th className="px-4 py-3">% Change</th>
                                <th className="px-4 py-3 rounded-r-lg">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.slice(0, 10).map((stock) => (
                                <tr key={stock.symbol} className="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-200">{stock.symbol}</td>
                                    <td className="px-4 py-3">{(stock.price || 0).toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`flex items-center ${stock.change > 0 ? 'text-green-500' : stock.change < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                                            {stock.change > 0 ? '+' : ''}{(stock.change || 0).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`flex items-center gap-1 ${stock.changePercent > 0 ? 'text-green-500' : stock.changePercent < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                                            {stock.changePercent > 0 && <TrendingUp className="h-3 w-3" />}
                                            {stock.changePercent < 0 && <TrendingDown className="h-3 w-3" />}
                                            {stock.changePercent === 0 && <Minus className="h-3 w-3" />}
                                            {Math.abs(stock.changePercent || 0).toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">{(stock.volume || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                            {stocks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                        No market data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
