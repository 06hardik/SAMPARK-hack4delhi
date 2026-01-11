import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { ParkingLotWithStatus } from '@/types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCbSbryzT15bzf4GaU5riR_UWnpnYKS_qE';

interface CongestionHeatmapProps {
  lots: ParkingLotWithStatus[];
  className?: string;
}

export function CongestionHeatmap({ lots, className }: CongestionHeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const initMap = async () => {
    if (!mapRef.current) return;

    setOptions({ key: GOOGLE_MAPS_API_KEY, v: 'weekly', libraries: ['visualization'] });
    await importLibrary('maps');
    await importLibrary('visualization');

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: 28.6406, lng: 77.2200 },
      zoom: 13,
      styles: [
        { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e4f5' }] },
      ],
    });

    infoWindowRef.current = new google.maps.InfoWindow();
    setMap(mapInstance);
  };

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    lots.forEach(lot => {
      const utilization = lot.utilization;
      let color = '#27ae60';
      let scale = 1;

      if (utilization > 100) { color = '#c0392b'; scale = 1.5; }
      else if (utilization > 90) { color = '#d68910'; scale = 1.3; }
      else if (utilization > 70) { color = '#1e6091'; scale = 1.1; }

      const marker = new google.maps.Marker({
        position: { lat: lot.latitude, lng: lot.longitude },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.85,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 10 * scale,
        },
      });

      marker.addListener('mouseover', () => {
        if (!infoWindowRef.current) return;

        const content = `
          <div style="font-family: system-ui; font-size: 12px; padding: 6px; max-width: 220px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${lot.name}</div>
            <div>Capacity: ${lot.allowedCapacity}</div>
            <div>Occupied: ${lot.currentCount}</div>
            <div>Utilization: ${utilization.toFixed(1)}%</div>
            <div style="margin-top: 4px; font-weight: 500; color: ${utilization > 100 ? '#c0392b' : '#27ae60'};">
              Status: ${utilization > 100 ? 'Violating' : 'Compliant'}
            </div>
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindowRef.current?.close();
      });

      markersRef.current.push(marker);
    });

    const heatmapData = lots.map(lot => ({
      location: new google.maps.LatLng(lot.latitude, lot.longitude),
      weight: Math.min(lot.utilization / 50, 3),
    }));

    if (!heatmapRef.current) {
      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map,
        radius: 50,
        opacity: 0.5,
        gradient: [
          'rgba(39,174,96,0)',
          'rgba(39,174,96,0.4)',
          'rgba(214,137,16,0.6)',
          'rgba(192,57,43,0.8)',
          'rgba(192,57,43,1)',
        ],
      });
    } else {
      heatmapRef.current.setData(heatmapData);
    }

  }, [map, lots]);

  return (
    <Card className={className}>
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <MapPin className="h-4 w-4 text-primary" />
          Congestion Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div
          ref={mapRef}
          className="w-full h-[300px] rounded border border-border overflow-hidden"
        />
      </CardContent>
    </Card>
  );
}
