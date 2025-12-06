import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Banknote, TrendingUp, TrendingDown } from "lucide-react";

interface ExchangeRate {
    lkr_per_unit: number;
    timestamp: string;
}

interface ExchangeRateCardProps {
    rates: Record<string, ExchangeRate>;
    changes: Record<string, any>;
}

export default function ExchangeRateCard({ rates, changes }: ExchangeRateCardProps) {
    const defaultCurrency = "USD";
    const rate = rates?.[defaultCurrency]?.lkr_per_unit || 0;

    const otherCurrencies = ["EUR", "GBP", "JPY", "INR"];

    return (
        <Card className="bg-white border-none card-shadow h-full rounded-3xl p-6">
            <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-brand-dark flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-brand-dark" /> Billing & Transactions
                </CardTitle>
                <button className="text-xs font-medium text-brand hover:text-brand-dark transition-colors">
                    Refresh
                </button>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                <div className="flex justify-between text-xs text-gray-400 font-medium border-b border-gray-100 pb-2">
                    <span>Currency</span>
                    <div className="flex gap-8">
                        <span>Rate (LKR)</span>
                        <span>Trend</span>
                    </div>
                </div>

                {/* Main Currency */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            $
                        </div>
                        <div>
                            <div className="text-sm font-bold text-brand-dark">USD</div>
                            <div className="text-xs text-gray-400">Payment Received</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 w-1/2 justify-end">
                        <span className="text-sm font-bold text-brand-dark w-16 text-right">{rate.toFixed(2)}</span>
                        <div className="w-16 flex justify-end">
                            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-full">94.6%</span>
                        </div>
                    </div>
                </div>

                {/* Other Currencies */}
                {otherCurrencies.map((cur, i) => {
                    const r = rates?.[cur]?.lkr_per_unit;
                    if (!r) return null;
                    return (
                        <div key={cur} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {cur === 'EUR' ? '€' : cur === 'GBP' ? '£' : cur === 'JPY' ? '¥' : '₹'}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-brand-dark">{cur}</div>
                                    <div className="text-xs text-gray-400">Invoice Created</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 w-1/2 justify-end">
                                <span className="text-sm font-bold text-brand-dark w-16 text-right">{r.toFixed(2)}</span>
                                <div className="w-16 flex justify-end">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${i % 2 === 0 ? 'text-blue-500 bg-blue-50' : 'text-orange-500 bg-orange-50'}`}>
                                        {(Math.random() * 10).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
