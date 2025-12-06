import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, ArrowRight } from "lucide-react";

interface ExchangeRateCardProps {
    usdRate: number;
}

export function ExchangeRateCard({ usdRate }: ExchangeRateCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-emerald-400" />
                    Exchange Rates
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/10 border border-emerald-900/30">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="font-bold text-slate-200">USD</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <span className="font-bold text-slate-200">LKR</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">
                            {usdRate > 0 ? usdRate.toFixed(2) : "N/A"}
                        </div>
                        <div className="text-xs text-slate-500">Official Rate</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
