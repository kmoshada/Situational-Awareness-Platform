import { useState } from "react";
import { Info } from "lucide-react";

interface CardInfoProps {
    content: string;
}

export default function CardInfo({ content }: CardInfoProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div
            className="relative inline-flex items-center ml-2"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={toggle}
        >
            <Info className="w-4 h-4 text-slate-400 cursor-help transition-colors hover:text-slate-200" />
            <div
                className={`absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 px-3 py-2 text-xs text-slate-100 bg-slate-900/95 border border-slate-800 rounded-md shadow-xl transition-all duration-200 z-50 pointer-events-none ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                    }`}
            >
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
            </div>
        </div>
    );
}
