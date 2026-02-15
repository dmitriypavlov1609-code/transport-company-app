import { useEffect, useRef } from 'react';

export default function MapView({ points = [], routeGeometry, center, zoom = 5, height = '300px', className = '' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const objectsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const ymaps = window.ymaps;
    if (!ymaps) return;

    ymaps.ready(() => {
      const map = new ymaps.Map(containerRef.current, {
        center: center || [55.75, 37.62],
        zoom,
        controls: ['zoomControl'],
      }, {
        suppressMapOpenBlock: true,
      });
      mapRef.current = map;
      objectsRef.current = new ymaps.GeoObjectCollection();
      map.geoObjects.add(objectsRef.current);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
        objectsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const ymaps = window.ymaps;
    const map = mapRef.current;
    const collection = objectsRef.current;
    if (!ymaps || !map || !collection) return;

    collection.removeAll();
    const bounds = [];

    points.forEach(p => {
      let placemark;
      if (p.type === 'truck') {
        placemark = new ymaps.Placemark([p.lat, p.lng], {
          balloonContent: p.popup || '',
        }, {
          preset: 'islands#blueDeliveryIcon',
        });
      } else {
        const color = p.color || '#1A73E8';
        placemark = new ymaps.Placemark([p.lat, p.lng], {
          balloonContent: p.popup || '',
          iconContent: p.label || '',
        }, {
          iconLayout: ymaps.templateLayoutFactory.createClass(
            `<div style="
              background:${color};
              width:32px;height:32px;
              border-radius:50%;
              border:3px solid white;
              display:flex;align-items:center;justify-content:center;
              font-size:13px;font-weight:700;color:white;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              transform:translate(-16px,-16px);
            ">{{ properties.iconContent }}</div>`
          ),
          iconShape: { type: 'Circle', coordinates: [0, 0], radius: 16 },
        });
      }
      collection.add(placemark);
      bounds.push([p.lat, p.lng]);
    });

    if (routeGeometry?.coordinates?.length) {
      const coords = routeGeometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const polyline = new ymaps.Polyline(coords, {}, {
        strokeColor: '#1A73E8',
        strokeWidth: 4,
        strokeOpacity: 0.85,
      });
      collection.add(polyline);
      map.setBounds(polyline.geometry.getBounds(), { checkZoomRange: true, zoomMargin: 40 });
    } else if (bounds.length > 1) {
      map.setBounds(bounds.map(b => [b[0], b[1]]).reduce(
        (acc, c) => [[Math.min(acc[0][0], c[0]), Math.min(acc[0][1], c[1])], [Math.max(acc[1][0], c[0]), Math.max(acc[1][1], c[1])]],
        [[90, 180], [-90, -180]]
      ), { checkZoomRange: true, zoomMargin: 40 });
    } else if (bounds.length === 1) {
      map.setCenter(bounds[0], 12);
    }
  }, [points, routeGeometry]);

  return <div ref={containerRef} className={`w-full ${className}`} style={{ height, borderRadius: '12px', overflow: 'hidden' }} />;
}
