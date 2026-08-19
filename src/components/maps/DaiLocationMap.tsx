'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DaiLocation } from '@/lib/types';

interface DaiLocationMapProps {
  locations: DaiLocation[];
  center?: [number, number];
  zoom?: number;
}

const daiIcon = L.divIcon({
  className: 'dai-location-marker',
  html: '<div style="width:34px;height:34px;border-radius:999px;background:#047857;border:4px solid white;box-shadow:0 5px 14px rgba(15,23,42,.25);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:11px">DAI</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -20],
});

function MapController({ locations, center, zoom }: DaiLocationMapProps & { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 1) {
      const bounds = L.latLngBounds(locations.map(location => location.coordinates));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 8 });
    } else {
      map.setView(center, zoom);
    }
  }, [center, locations, map, zoom]);

  return null;
}

export default function DaiLocationMap({ locations, center = [-2.5489, 118.0149], zoom = 5 }: DaiLocationMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
      <MapController locations={locations} center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map(location => (
        <Marker key={location.id} position={location.coordinates} icon={daiIcon}>
          <Popup>
            <div className="min-w-[220px] p-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">{location.id}</p>
              <h3 className="mt-1 font-bold text-slate-900">{location.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{location.location}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2 text-xs">
                <div><span className="text-slate-500">Kapasitas</span><strong className="mt-0.5 block text-slate-800">{location.capacity} ton</strong></div>
                <div><span className="text-slate-500">Stok gabah</span><strong className="mt-0.5 block text-slate-800">{location.stockLevels.gabah} ton</strong></div>
              </div>
              <p className="mt-3 text-xs font-semibold text-emerald-700">{location.services.length} layanan tersedia</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
