import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { predictFloodRisk, FloodPrediction } from '@/lib/aiFloodPrediction';
import { getMockWeatherData } from '@/lib/weatherApi';
import {
  Activity, Droplets, Wind, Thermometer, Eye,
  TrendingUp, AlertTriangle, Clock, Brain, ChevronRight
} from 'lucide-react';

// Risk score meter
function RiskMeter({ score }: { score: number }) {
  const angle = (score / 100) * 180 - 90;
  const color = score < 25 ? '#22c55e' : score < 55 ? '#f59e0b' : score < 80 ? '#ef4444' : '#dc2626';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20 overflow-hidden">
        {/* Track */}
        <div className="absolute bottom-0 left-0 right-0 h-20 w-40">
          <svg viewBox="0 0 160 80" className="w-full h-full">
            <path d="M10 80 A70 70 0 0 1 150 80" fill="none" stroke="hsl(220 25% 14%)" strokeWidth="14" strokeLinecap="round" />
            {/* Colored segments */}
            <path d="M10 80 A70 70 0 0 1 40 26" fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" opacity="0.4" />
            <path d="M40 26 A70 70 0 0 1 80 10" fill="none" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round" opacity="0.4" />
            <path d="M80 10 A70 70 0 0 1 120 26" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" opacity="0.4" />
            <path d="M120 26 A70 70 0 0 1 150 80" fill="none" stroke="#dc2626" strokeWidth="14" strokeLinecap="round" opacity="0.4" />
            {/* Needle */}
            <g transform={`rotate(${angle}, 80, 80)`}>
              <line x1="80" y1="80" x2="80" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
              <circle cx="80" cy="80" r="5" fill={color} />
            </g>
          </svg>
        </div>
      </div>
      <div className="text-4xl font-display font-bold mt-1" style={{ color }}>
        {score}
      </div>
      <div className="text-xs text-muted-foreground">Risk Score / 100</div>
    </div>
  );
}

const riskColors: Record<string, string> = {
  Low: 'text-risk-low',
  Medium: 'text-risk-medium',
  High: 'text-risk-high',
  Critical: 'text-risk-critical',
};

const riskBg: Record<string, string> = {
  Low: 'bg-risk-low/10 border-risk-low/30',
  Medium: 'bg-risk-medium/10 border-risk-medium/30',
  High: 'bg-risk-high/10 border-risk-high/30',
  Critical: 'bg-risk-critical/10 border-risk-critical/30',
};

export default function OverviewDashboard() {
  const [weather, setWeather] = useState(getMockWeatherData('Mumbai'));
  const [prediction, setPrediction] = useState<FloodPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const run = () => {
      const w = getMockWeatherData('Mumbai');
      setWeather(w);
      const pred = predictFloodRisk({
        rainfall: w.rainfall,
        humidity: w.humidity,
        temperature: w.temperature,
        windSpeed: w.windSpeed,
        historicalRainfall: w.rainfall * 8,
      });
      setPrediction(pred);
      setLastUpdated(new Date());
      setIsLoading(false);
    };
    run();
    const interval = setInterval(run, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !prediction) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Brain className="w-5 h-5 animate-pulse text-primary" />
          <span>AI model processing weather data...</span>
        </div>
      </div>
    );
  }

  const riskLevel = prediction.riskLevel;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* High risk alert banner */}
      {(riskLevel === 'High' || riskLevel === 'Critical') && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`rounded-2xl p-4 border ${riskBg[riskLevel]} flex items-start gap-3 animate-pulse-danger`}
        >
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${riskColors[riskLevel]}`} />
          <div>
            <div className={`font-semibold text-sm ${riskColors[riskLevel]}`}>
              ⚠ FLOOD WARNING — {riskLevel.toUpperCase()} RISK DETECTED
            </div>
            <div className="text-muted-foreground text-sm mt-0.5">
              High flood risk predicted for {weather.city}. {prediction.timeToFlood && `Estimated flooding within ${prediction.timeToFlood}.`}
              {' '}{prediction.affectedArea}.
            </div>
          </div>
        </motion.div>
      )}

      {/* Top stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Rainfall', value: `${weather.rainfall.toFixed(1)} mm/h`, icon: Droplets, color: 'text-blue-400', sub: 'Current rate' },
          { label: 'Humidity', value: `${weather.humidity.toFixed(0)}%`, icon: Activity, color: 'text-cyan-400', sub: 'Relative humidity' },
          { label: 'Temperature', value: `${weather.temperature.toFixed(1)}°C`, icon: Thermometer, color: 'text-amber-400', sub: `Feels ${weather.feelsLike.toFixed(0)}°C` },
          { label: 'Wind Speed', value: `${weather.windSpeed.toFixed(0)} km/h`, icon: Wind, color: 'text-purple-400', sub: 'Current wind' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Main row: Risk meter + prediction */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk meter card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`glass-card rounded-2xl p-6 border ${riskBg[riskLevel]} col-span-1`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">AI Risk Score</div>
              <div className={`text-2xl font-display font-bold ${riskColors[riskLevel]}`}>
                {riskLevel} Risk
              </div>
            </div>
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <RiskMeter score={prediction.riskScore} />
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-muted/30 p-2">
              <div className="text-lg font-bold text-primary">{prediction.probability}%</div>
              <div className="text-xs text-muted-foreground">Probability</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-2">
              <div className="text-lg font-bold text-foreground">{prediction.confidence}%</div>
              <div className="text-xs text-muted-foreground">Confidence</div>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">AI Risk Analysis</h3>
            <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>

          {/* Risk factors */}
          <div className="space-y-2 mb-4">
            {prediction.factors.map(f => (
              <div key={f.name} className="flex items-center gap-3">
                <div className="w-28 text-xs text-muted-foreground flex-shrink-0">{f.name}</div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.contribution * 2}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={`h-full rounded-full ${
                      f.impact === 'high' ? 'bg-risk-high' :
                      f.impact === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
                    }`}
                  />
                </div>
                <div className="text-xs font-medium text-foreground w-12 text-right">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Time to flood */}
          {prediction.timeToFlood && (
            <div className="flex items-center gap-2 text-sm text-risk-high mb-3">
              <Clock className="w-4 h-4" />
              <span>Estimated flood risk window: <strong>{prediction.timeToFlood}</strong></span>
            </div>
          )}

          {/* Affected area */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
            {prediction.affectedArea}
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">AI Recommendations</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {prediction.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-bold">{i + 1}</span>
              </div>
              <span className="text-sm text-foreground">{rec}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sustainability panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">Impact Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Alerts Generated', value: '1,247', color: 'text-risk-high' },
            { label: 'Risk Zones Monitored', value: '342', color: 'text-risk-medium' },
            { label: 'Est. People Protected', value: '84,000+', color: 'text-risk-low' },
            { label: 'Predictions Today', value: '1,440', color: 'text-primary' },
          ].map(m => (
            <div key={m.label} className="text-center p-3 rounded-xl bg-muted/20">
              <div className={`text-2xl font-display font-bold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
