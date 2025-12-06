import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";

interface NewsItem {
    title: string;
    source: string;
    url?: string;
    published_at?: string;
}

interface NewsFeedProps {
    news: NewsItem[];
}

export function NewsFeed({ news }: NewsFeedProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-blue-400" />
                    Latest Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {news.map((item, index) => (
                        <div
                            key={index}
                            className="group border-b border-slate-800 last:border-0 pb-4 last:pb-0"
                        >
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                                {item.url && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ExternalLink className="h-3 w-3 text-slate-500 hover:text-blue-400" />
                                    </a>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-blue-400/80 bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-900/30">
                                    {item.source}
                                </span>
                                {item.published_at && (
                                    <span className="text-[10px] text-slate-500">
                                        {new Date(item.published_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {news.length === 0 && (
                        <div className="text-center text-slate-500 py-8">
                            No recent news available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
