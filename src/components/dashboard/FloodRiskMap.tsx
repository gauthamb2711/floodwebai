import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Info, Layers } from 'lucide-react';
import { predictFloodRisk } from '@/lib/aiFloodPrediction';

// Risk zone data for the map
const RISK_ZONES = [
  { id: 1, name: 'Dharavi', lat: 19.040, lon: 72.854, rainfall: 8, humidity: 75, temp: 24, wind: 20, hist: 40 },
  { id: 2, name: 'Kurla', lat: 19.069, lon: 72.879, rainfall: 22, humidity: 85, temp: 23, wind: 35, hist: 75 },
  { id: 3, name: 'Sion', lat: 19.040, lon: 72.861, rainfall: 35, humidity: 92, temp: 22, wind: 50, hist: 110 },
  { id: 4, name: 'Bandra', lat: 19.054, lon: 72.839, rainfall: 5, humidity: 65, temp: 26, wind: 25, hist: 30 },
  { id: 5, name: 'Andheri', lat: 19.119, lon: 72.847, rainfall: 18, humidity: 80, temp: 23, wind: 40, hist: 65 },
  { id: 6, name: 'Thane', lat: 19.218, lon: 72.978, rainfall: 45, humidity: 95, temp: 21, wind: 60, hist: 130 },
  { id: 7, name: 'Powai', lat: 19.118, lon: 72.906, rainfall: 28, humidity: 88, temp: 22, wind: 45, hist: 90 },
  { id: 8, name: 'Colaba', lat: 18.906, lon: 72.817, rainfall: 3, humidity: 62, temp: 27, wind: 18, hist: 20 },
  { id: 9, name: 'Goregaon', lat: 19.152, lon: 72.848, rainfall: 55, humidity: 97, temp: 20, wind: 75, hist: 155 },
];

export default function FloodRiskMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [selectedZone, setSelectedZone] = useState<typeof RISK_ZONES[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [activeLayer, setActiveLayer] = useState('risk');

  // Compute predictions for each zone
  const zonePredictions = RISK_ZONES.map(z => ({
    ...z,
    prediction: predictFloodRisk({
      rainfall: z.rainfall,
      humidity: z.humidity,
      temperature: z.temp,
      windSpeed: z.wind,
      historicalRainfall: z.hist,
    }),
  }));

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      case 'Critical': return '#dc2626';
      default: return '#22c55e';
    }
  };

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    import('leaflet').then(L => {
      // Fix default icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [19.076, 72.877],
        zoom: 11,
        zoomControl: true,
      });

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;

      // Add risk zone circles and markers
      zonePredictions.forEach(zone => {
        const color = getRiskColor(zone.prediction.riskLevel);
        const radius = 600 + zone.prediction.riskScore * 20;

        // Circle
        L.circle([zone.lat, zone.lon], {
          radius,
          color,
          fillColor: color,
          fillOpacity: 0.25,
          weight: 2,
        }).addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:180px">
              <b style="color:${color};font-size:14px">${zone.name}</b><br/>
              <span style="color:#94a3b8;font-size:12px">Risk: </span>
              <span style="color:${color};font-weight:600">${zone.prediction.riskLevel}</span><br/>
              <span style="color:#94a3b8;font-size:12px">Score: </span>
              <span style="color:#f1f5f9;font-weight:600">${zone.prediction.riskScore}/100</span><br/>
              <span style="color:#94a3b8;font-size:12px">Probability: </span>
              <span style="color:#f1f5f9">${zone.prediction.probability}%</span><br/>
              <span style="color:#94a3b8;font-size:12px">Rainfall: </span>
              <span style="color:#f1f5f9">${zone.rainfall}mm/h</span>
            </div>
          `);

        // Custom marker
        const icon = L.divIcon({
          html: `<div style="
            width:32px;height:32px;border-radius:50%;
            background:${color};
            border:3px solid white;
            display:flex;align-items:center;justify-content:center;
            font-weight:bold;font-size:10px;color:white;
            box-shadow:0 0 12px ${color}80;
          ">${zone.prediction.riskScore}</div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([zone.lat, zone.lon], { icon })
          .addTo(map)
          .bindPopup(`<b style="color:${color}">${zone.name}</b> — ${zone.prediction.riskLevel} Risk`);
      });

      setMapLoaded(true);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Flood Risk Map</h1>
          <p className="text-muted-foreground text-sm">Real-time AI-powered flood risk zones — Mumbai Region</p>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card rounded-xl p-4 flex flex-wrap items-center gap-6">
        <span className="text-sm font-medium text-muted-foreground">Risk Zones:</span>
        {[
          { label: 'Safe', color: 'bg-risk-low' },
          { label: 'Moderate', color: 'bg-risk-medium' },
          { label: 'High Risk', color: 'bg-risk-high' },
          { label: 'Critical', color: 'bg-risk-critical' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${l.color}`} />
            <span className="text-sm text-foreground">{l.label}</span>
          </div>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">Click circles for details</span>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl overflow-hidden" style={{ height: '520px' }}>
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="w-5 h-5 animate-bounce" />
                  <span>Loading map...</span>
                </div>
              </div>
            )}
            <div ref={mapRef} className="w-full h-full" />
          </div>
        </div>

        {/* Zone list */}
        <div className="space-y-2 overflow-y-auto max-h-[520px]">
          <h3 className="text-sm font-semibold text-foreground mb-2">Risk Zones</h3>
          {zonePredictions.map(zone => {
            const color = getRiskColor(zone.prediction.riskLevel);
            return (
              <motion.div
                key={zone.id}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-xl p-3 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => {
                  setSelectedZone(zone);
                  if (leafletMapRef.current) {
                    leafletMapRef.current.flyTo([zone.lat, zone.lon], 13);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">{zone.name}</span>
                  <span className="text-xs font-bold" style={{ color }}>{zone.prediction.riskLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${zone.prediction.riskScore}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{zone.prediction.riskScore}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{zone.rainfall}mm/h • {zone.humidity}% RH</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
