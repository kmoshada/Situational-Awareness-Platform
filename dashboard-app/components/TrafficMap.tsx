"use client"

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

interface TrafficData {
    city: string;
    lat: number;
    lon: number;
    congestion_percent: number;
    incident_count: number;
}

export default function TrafficMap({ data }: { data: TrafficData[] }) {
    const center: [number, number] = [7.8731, 80.7718];
    const zoom = 7;

    const getColor = (congestion: number) => {
        if (congestion > 75) return "#f43f5e"; // Rose-600
        if (congestion > 50) return "#f97316"; // Orange-500
        if (congestion > 25) return "#eab308"; // Yellow-500
        return "#22c55e"; // Green-500
    };

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%", background: "transparent" }}
            scrollWheelZoom={false}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {data && data.map((city, idx) => (
                <CircleMarker
                    key={idx}
                    center={[city.lat, city.lon]}
                    radius={6 + (city.congestion_percent / 10)}
                    pathOptions={{
                        color: getColor(city.congestion_percent),
                        fillColor: getColor(city.congestion_percent),
                        fillOpacity: 0.7,
                        weight: 1.5
                    }}
                >
                    <Popup>
                        <div className="font-sans text-sm text-slate-800">
                            <strong className="text-base">{city.city}</strong>
                            <div className="mt-1">
                                Congestion: <span className="font-bold">{city.congestion_percent}%</span>
                            </div>
                            <div>
                                Incidents: <span className="font-bold">{city.incident_count}</span>
                            </div>
                        </div>
                    </Popup>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={city.congestion_percent > 60}>
                        <span style={{ color: getColor(city.congestion_percent) }}>
                            {city.city}: {city.congestion_percent}%
                        </span>
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}