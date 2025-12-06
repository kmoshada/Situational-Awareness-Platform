import Link from 'next/link';
import { Home, Activity, AlertTriangle, Settings, Map as MapIcon, Box } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-20 bg-white shadow-sm flex flex-col items-center py-6">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-bold text-white text-xl shadow-lg shadow-slate-200">
                SL
            </div>
            <nav className="flex flex-1 flex-col space-y-4 w-full px-4">
                <Link href="/" className="group flex flex-col items-center justify-center rounded-2xl p-3 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm">
                    <Home className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="#" className="group flex flex-col items-center justify-center rounded-2xl p-3 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm">
                    <MapIcon className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-medium">Map</span>
                </Link>
                <Link href="#" className="group flex flex-col items-center justify-center rounded-2xl p-3 text-blue-600 bg-blue-50 shadow-sm transition-all">
                    <Activity className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-medium">Activity</span>
                </Link>
                <Link href="#" className="group flex flex-col items-center justify-center rounded-2xl p-3 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm">
                    <AlertTriangle className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-medium">Alerts</span>
                </Link>
            </nav>
            <div className="mt-auto px-4 w-full">
                <Link href="#" className="group flex flex-col items-center justify-center rounded-2xl p-3 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm">
                    <Settings className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </div>
        </aside>
    );
}