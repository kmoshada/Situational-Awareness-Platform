import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CardInfo from "./CardInfo";
import { Calendar } from "lucide-react";

interface Event {
    name: string;
    date: string;
}

interface EventsCardProps {
    events: Event[];
}

export function EventsCard({ events }: EventsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    Latest Events
                    <CardInfo content="Real-time news and events feed aggregated from multiple national sources." />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800"
                        >
                            <span className="font-medium text-slate-200">
                                {event.name.replace(/\(recurring; see schedule\)/g, '').trim()}
                            </span>
                            {event.date !== 'YYYY-MM-DD' && (
                                <span className="text-sm text-purple-400 bg-purple-950/30 px-2 py-1 rounded border border-purple-900/30">
                                    {event.date}
                                </span>
                            )}
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="text-center text-slate-500 py-4">
                            No upcoming events
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
