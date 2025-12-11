"use client";

import React, { useEffect, useState } from "react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000); // Show for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        >
            <div className="text-center animate-pulse">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
                    LK-Awareness
                </h1>
                <p className="mt-4 text-muted-foreground text-lg">
                    Real-time National Intelligence
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="h-2 w-24 bg-muted overflow-hidden rounded-full">
                        <div className="h-full w-full bg-primary origin-left animate-[loading_2s_ease-in-out_infinite]" />
                    </div>
                </div>
            </div>


        </div>
    );
}
