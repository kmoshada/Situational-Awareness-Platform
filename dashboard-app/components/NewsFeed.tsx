import { Newspaper } from "lucide-react";

interface NewsItem {
    title: string;
    source: string;
    time?: string;
}

interface NewsFeedProps {
    news: NewsItem[];
}

export function NewsFeed({ news }: NewsFeedProps) {
    return (
        <div className="h-full rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium text-slate-300">Latest News</h3>
            </div>
            <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {news.map((item, i) => (
                    <div key={i} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                        <p className="line-clamp-2 text-sm text-slate-200 hover:text-blue-400 transition-colors cursor-pointer">{item.title}</p>
                        <div className="mt-1 flex justify-between">
                            <span className="text-xs text-slate-500">{item.source}</span>
                            {item.time && <span className="text-xs text-slate-600">{item.time}</span>}
                        </div>
                    </div>
                ))}
                {news.length === 0 && <div className="text-sm text-slate-500">No recent news</div>}
            </div>
        </div>
    );
}
