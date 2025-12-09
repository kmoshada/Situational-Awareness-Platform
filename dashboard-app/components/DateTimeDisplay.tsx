"use client";

import { useEffect, useState } from "react";

export function DateTimeDisplay() {
    const [mounted, setMounted] = useState(false);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div className="text-slate-400 text-sm font-medium">
            {date.toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
            <span className="mx-2">|</span>
            {date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })}
        </div>
    );
}
