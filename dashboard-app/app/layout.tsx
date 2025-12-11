import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LK-Awareness Dashboard",
    description: "Real-time National Intelligence Dashboard",
};

import SplashScreen from "@/components/SplashScreen";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SplashScreen />
                {children}
            </body>
        </html>
    );
}
