import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface Event {
    name: string;
    date: string;
}

interface EventsCardProps {
    upcoming: Event[];
    count: number;
}

export default function EventsCard({ upcoming, count }: EventsCardProps) {
    return (
        <Card className="bg-brand/20 border-brand/50 backdrop-blur-sm text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Upcoming Events
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {count > 0 ? count : "0"}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                    Total Holidays Found
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                    {upcoming && upcoming.length > 0 ? (
                        upcoming.map((event, idx) => (
                            <div key={idx} className="flex flex-col border-l-2 border-blue-500 pl-3 py-1 border-b border-gray-700/50 last:border-b-0">
                                <span className="text-sm text-gray-200 font-medium">{event.name}</span>
                                <span className="text-xs text-gray-500">{event.date}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-600 italic">No upcoming events</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
