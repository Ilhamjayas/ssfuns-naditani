"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ProvinceData } from "@/lib/types";
import { formatWeight } from "@/lib/utils/format";

// Fix for default marker icons in React Leaflet
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const setupLeafletIcon = () => {
  // @ts-expect-error - Leaflet icons in react-leaflet often have type issues
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
};

interface DaiMapProps {
  provinces: ProvinceData[];
  center?: [number, number];
  zoom?: number;
}

// A component to automatically fit bounds if needed or just center
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function DaiMap({ provinces, center = [-2.5489, 118.0149], zoom = 5 }: DaiMapProps) {
  useEffect(() => {
    setupLeafletIcon();
  }, []);

  return (
    <div className="relative z-0 h-full min-h-[320px] w-full overflow-hidden rounded-xl border border-border shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {provinces.map((prov) => (
          <Marker key={prov.id} position={[prov.coordinates[0], prov.coordinates[1]]}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-primary-900 mb-2 border-b border-slate-100 pb-2">
                  {prov.name}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">NTP:</span>
                    <span className="font-semibold text-slate-800">{prov.ntp}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Produksi (GKG):</span>
                    <span className="font-medium text-slate-800">{formatWeight(prov.production)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Total DAI:</span>
                    <span className="font-medium text-slate-800">{prov.daiCount} unit</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Petani Aktif:</span>
                    <span className="font-medium text-slate-800">{prov.activeFarmers}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
