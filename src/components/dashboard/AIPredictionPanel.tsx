import { useState } from 'react';
import { motion } from 'framer-motion';
import { predictFloodRisk, FloodPrediction } from '@/lib/aiFloodPrediction';
import { Brain, Zap, Sliders, ChevronRight, Info } from 'lucide-react';

const riskColors: Record<string, string> = {
  Low: 'text-risk-low',
  Medium: 'text-risk-medium',
  High: 'text-risk-high',
  Critical: 'text-risk-critical',
};
const riskBg: Record<string, string> = {
  Low: 'border-risk-low/40 bg-risk-low/5',
  Medium: 'border-risk-medium/40 bg-risk-medium/5',
  High: 'border-risk-high/40 bg-risk-high/5',
  Critical: 'border-risk-critical/40 bg-risk-critical/5',
};

function Slider({ label, value, min, max, unit, onChange, color }: {
  label: string; value: number; min: number; max: number; unit: string;
  onChange: (v: number) => void; color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className={`text-sm font-bold ${color}`}>{value.toFixed(1)} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((value - min) / (max - min)) * 100}%, hsl(var(--muted)) ${((value - min) / (max - min)) * 100}%, hsl(var(--muted)) 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{min}</span><span>{max} {unit}</span>
      </div>
    </div>
  );
}

const PRESETS = [
  { label: 'Normal Day', rainfall: 2, humidity: 55, temperature: 26, windSpeed: 15, historicalRainfall: 20 },
  { label: 'Heavy Rain', rainfall: 28, humidity: 88, temperature: 22, windSpeed: 45, historicalRainfall: 80 },
  { label: 'Tropical Storm', rainfall: 55, humidity: 95, temperature: 20, windSpeed: 90, historicalRainfall: 140 },
  { label: 'Flash Flood Scenario', rainfall: 75, humidity: 98, temperature: 19, windSpeed: 70, historicalRainfall: 180 },
];

export default function AIPredictionPanel() {
  const [inputs, setInputs] = useState({
    rainfall: 15,
    humidity: 75,
    temperature: 24,
    windSpeed: 30,
    historicalRainfall: 60,
  });
  const [prediction, setPrediction] = useState<FloodPrediction | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runPrediction = () => {
    setIsRunning(true);
    setTimeout(() => {
      setPrediction(predictFloodRisk(inputs));
      setIsRunning(false);
    }, 800);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setInputs({ rainfall: p.rainfall, humidity: p.humidity, temperature: p.temperature, windSpeed: p.windSpeed, historicalRainfall: p.historicalRainfall });
    setPrediction(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">AI Prediction Engine</h1>
          <p className="text-muted-foreground text-sm">Random Forest ML model — enter weather parameters to predict flood risk</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-6">
          {/* Presets */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Presets
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-left border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="glass-card rounded-2xl p-5 space-y-5">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Weather Parameters
            </h3>
            <Slider label="Current Rainfall" value={inputs.rainfall} min={0} max={100} unit="mm/h"
              onChange={v => setInputs(s => ({ ...s, rainfall: v }))} color="text-blue-400" />
            <Slider label="Humidity" value={inputs.humidity} min={0} max={100} unit="%"
              onChange={v => setInputs(s => ({ ...s, humidity: v }))} color="text-cyan-400" />
            <Slider label="Temperature" value={inputs.temperature} min={0} max={50} unit="°C"
              onChange={v => setInputs(s => ({ ...s, temperature: v }))} color="text-amber-400" />
            <Slider label="Wind Speed" value={inputs.windSpeed} min={0} max={150} unit="km/h"
              onChange={v => setInputs(s => ({ ...s, windSpeed: v }))} color="text-purple-400" />
            <Slider label="24h Historical Rainfall" value={inputs.historicalRainfall} min={0} max={300} unit="mm"
              onChange={v => setInputs(s => ({ ...s, historicalRainfall: v }))} color="text-indigo-400" />
          </div>

          <button
            onClick={runPrediction}
            disabled={isRunning}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-glow"
          >
            {isRunning ? (
              <>
                <Brain className="w-5 h-5 animate-pulse" />
                AI Model Processing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Run AI Prediction
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          {!prediction && !isRunning && (
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-64">
              <Brain className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">Set parameters and click <strong className="text-primary">Run AI Prediction</strong> to analyze flood risk</p>
            </div>
          )}

          {isRunning && (
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-64">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                <Brain className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">Random Forest model analyzing {inputs.rainfall.toFixed(0)}mm/h rainfall...</p>
            </div>
          )}

          {prediction && !isRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Main result */}
              <div className={`glass-card rounded-2xl p-6 border ${riskBg[prediction.riskLevel]}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Prediction Result</div>
                    <div className={`font-display text-4xl font-bold ${riskColors[prediction.riskLevel]}`}>
                      {prediction.riskLevel} Risk
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-display font-bold ${riskColors[prediction.riskLevel]}`}>
                      {prediction.riskScore}<span className="text-lg text-muted-foreground">/100</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                </div>
                <div className="risk-meter-track relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.riskScore}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-transparent relative"
                  >
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-lg border-2 border-background"
                      style={{ background: prediction.riskScore < 25 ? '#22c55e' : prediction.riskScore < 55 ? '#f59e0b' : '#ef4444' }}
                    />
                  </motion.div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
                  <div>
                    <div className={`font-bold text-xl ${riskColors[prediction.riskLevel]}`}>{prediction.probability}%</div>
                    <div className="text-xs text-muted-foreground">Flood Probability</div>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-foreground">{prediction.confidence}%</div>
                    <div className="text-xs text-muted-foreground">Model Confidence</div>
                  </div>
                  <div>
                    <div className={`font-bold text-base ${prediction.timeToFlood ? riskColors[prediction.riskLevel] : 'text-risk-low'}`}>
                      {prediction.timeToFlood || 'Low'}
                    </div>
                    <div className="text-xs text-muted-foreground">Time to Flood</div>
                  </div>
                </div>
              </div>

              {/* Feature importance */}
              <div className="glass-card rounded-2xl p-5">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-primary" />
                  AI Feature Importance
                </h4>
                <div className="space-y-2">
                  {prediction.factors.map(f => (
                    <div key={f.name} className="flex items-center gap-2 text-sm">
                      <span className="w-32 text-muted-foreground text-xs">{f.name}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.contribution * 2.5}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${f.impact === 'high' ? 'bg-risk-high' : f.impact === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'}`}
                        />
                      </div>
                      <span className="w-8 text-xs text-right text-foreground">{f.contribution}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass-card rounded-2xl p-5">
                <h4 className="font-semibold text-foreground mb-3 text-sm">AI Recommendations</h4>
                <ul className="space-y-2">
                  {prediction.recommendations.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
