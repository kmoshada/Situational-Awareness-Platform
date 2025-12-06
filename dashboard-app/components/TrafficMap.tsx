"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon } from "lucide-react";

// Fix for default marker icon
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface TrafficData {
    city: string;
    lat: number;
    lon: number;
    congestion_percent: number;
    incident_count: number;
}

interface TrafficMapProps {
    data: TrafficData[];
}

export default function TrafficMap({ data }: TrafficMapProps) {
    // Default center (Sri Lanka)
    const center: [number, number] = [7.8731, 80.7718];
    const zoom = 7;

    return (
        <Card className="h-[500px] flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5 text-blue-400" />
                    Live Traffic & Incidents
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    style={{ background: '#0f172a' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        className="map-tiles"
                    />
                    {data.map((item, idx) => {
                        // Determine color based on congestion
                        let colorClass = "bg-green-500";
                        let shadowClass = "shadow-green-500/50";
                        if (item.congestion_percent > 60) {
                            colorClass = "bg-red-500";
                            shadowClass = "shadow-red-500/50";
                        } else if (item.congestion_percent > 30) {
                            colorClass = "bg-yellow-500";
                            shadowClass = "shadow-yellow-500/50";
                        }

                        // Create custom DivIcon
                        const customMarkerIcon = new L.DivIcon({
                            className: "custom-marker",
                            html: `<div class="w-4 h-4 rounded-full ${colorClass} border-2 border-white shadow-lg ${shadowClass}"></div>`,
                            iconSize: [16, 16],
                            iconAnchor: [8, 8],
                            popupAnchor: [0, -10]
                        });

                        return (
                            <Marker
                                key={idx}
                                position={[item.lat || 6.9271, item.lon || 79.8612]}
                                icon={customMarkerIcon}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold text-slate-900">{item.city}</h3>
                                        <p className="text-sm text-slate-700">Congestion: {item.congestion_percent}%</p>
                                        <p className="text-sm text-slate-700">Incidents: {item.incident_count}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>

                {/* Overlay Legend */}
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-700 z-[1000] text-xs">
                    <div className="font-semibold mb-2 text-slate-200">Traffic Status</div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-slate-400">Low Congestion</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="text-slate-400">Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-slate-400">High Congestion</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
