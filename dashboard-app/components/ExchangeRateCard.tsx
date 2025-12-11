import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, ArrowRight } from "lucide-react";

import CardInfo from "./CardInfo";

interface ExchangeRateCardProps {
    rates: Record<string, { lkr_per_unit: number }>;
}

export function ExchangeRateCard({ rates }: ExchangeRateCardProps) {
    const currencies = [
        { code: "USD", name: "US Dollar", icon: "$" },
        { code: "EUR", name: "Euro", icon: "€" },
        { code: "GBP", name: "British Pound", icon: "£" },
        { code: "JPY", name: "Japanese Yen", icon: "¥" },
        { code: "INR", name: "Indian Rupee", icon: "₹" },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-emerald-400" />
                    Exchange Rates
                    <CardInfo content="Real-time currency exchange rates against LKR (Sri Lankan Rupee)." />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {currencies.map((currency) => {
                    const rateData = rates?.[currency.code];
                    const rate = rateData?.lkr_per_unit;

                    return (
                        <div key={currency.code} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-800 h-8 w-8 rounded flex items-center justify-center text-slate-300 font-bold text-sm">
                                    {currency.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-200">{currency.code}</div>
                                    <div className="text-xs text-slate-500">{currency.name}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-emerald-400">
                                    {rate ? rate.toFixed(2) : "N/A"}
                                </div>
                                <div className="text-xs text-slate-500">LKR</div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
