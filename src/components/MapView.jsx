import { useEffect, useRef } from 'react';

export default function MapView({ points = [], routeGeometry, center, zoom = 5, height = '300px', className = '' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;
    const map = L.map(mapRef.current, { zoomControl: false }).setView(center || [55.75, 37.62], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    layersRef.current.forEach(l => map.removeLayer(l));
    layersRef.current = [];

    const createIcon = (color, label, size = 32) => L.divIcon({
      className: '',
      html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:${size * 0.4}px;font-weight:700;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${label}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    const truckIcon = L.divIcon({
      className: '',
      html: `<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">🚛</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const bounds = [];

    points.forEach(p => {
      const icon = p.type === 'truck'
        ? truckIcon
        : createIcon(p.color || '#1A73E8', p.label || '', p.size || 32);
      const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
      if (p.popup) m.bindPopup(p.popup);
      layersRef.current.push(m);
      bounds.push([p.lat, p.lng]);
    });

    if (routeGeometry?.coordinates?.length) {
      const coords = routeGeometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const line = L.polyline(coords, { color: '#1A73E8', weight: 4, opacity: 0.8 }).addTo(map);
      layersRef.current.push(line);
      map.fitBounds(line.getBounds(), { padding: [40, 40] });
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 12);
    }
  }, [points, routeGeometry]);

  return <div ref={mapRef} className={`w-full rounded-2xl ${className}`} style={{ height }} />;
}
