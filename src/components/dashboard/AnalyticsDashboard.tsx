import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, TrendingUp, Droplets, Thermometer } from 'lucide-react';
import { generateHistoricalData } from '@/lib/aiFloodPrediction';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 border border-primary/20 text-sm">
        <div className="font-semibold text-foreground mb-2">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="text-foreground font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState(() => generateHistoricalData(14));
  const [activeTab, setActiveTab] = useState<'rainfall' | 'temperature' | 'humidity' | 'risk'>('rainfall');

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Weather Analytics</h1>
          <p className="text-muted-foreground text-sm">14-day historical weather trends & flood risk history</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Rainfall', value: `${(data.reduce((a, d) => a + d.rainfall, 0) / data.length).toFixed(1)} mm/h`, color: 'text-blue-400', icon: Droplets },
          { label: 'Avg Humidity', value: `${Math.round(data.reduce((a, d) => a + d.humidity, 0) / data.length)}%`, color: 'text-cyan-400', icon: TrendingUp },
          { label: 'Avg Temperature', value: `${(data.reduce((a, d) => a + d.temperature, 0) / data.length).toFixed(1)}°C`, color: 'text-amber-400', icon: Thermometer },
          { label: 'Peak Risk Score', value: Math.max(...data.map(d => d.riskScore)), color: 'text-risk-high', icon: BarChart3 },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'rainfall', label: 'Rainfall', color: '#60a5fa' },
          { key: 'temperature', label: 'Temperature', color: '#fbbf24' },
          { key: 'humidity', label: 'Humidity', color: '#34d399' },
          { key: 'risk', label: 'Risk Score', color: '#f87171' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main chart */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">
          {activeTab === 'rainfall' && '14-Day Rainfall Trend (mm/h)'}
          {activeTab === 'temperature' && '14-Day Temperature (°C)'}
          {activeTab === 'humidity' && '14-Day Humidity (%)'}
          {activeTab === 'risk' && '14-Day Flood Risk Score History'}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={
                  activeTab === 'rainfall' ? '#60a5fa' :
                  activeTab === 'temperature' ? '#fbbf24' :
                  activeTab === 'humidity' ? '#34d399' : '#f87171'
                } stopOpacity={0.4} />
                <stop offset="95%" stopColor={
                  activeTab === 'rainfall' ? '#60a5fa' :
                  activeTab === 'temperature' ? '#fbbf24' :
                  activeTab === 'humidity' ? '#34d399' : '#f87171'
                } stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 25% 14%)" />
            <XAxis dataKey="date" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={activeTab}
              stroke={
                activeTab === 'rainfall' ? '#60a5fa' :
                activeTab === 'temperature' ? '#fbbf24' :
                activeTab === 'humidity' ? '#34d399' : '#f87171'
              }
              fill="url(#chartGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Combined chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Risk Score vs Rainfall Correlation</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.slice(-7)} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 25% 14%)" />
            <XAxis dataKey="date" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'hsl(210 40% 80%)', fontSize: 12 }} />
            <Bar dataKey="riskScore" fill="#f87171" name="Risk Score" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rainfall" fill="#60a5fa" name="Rainfall" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Multi-line chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Multi-Variable Weather Trends</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 25% 14%)" />
            <XAxis dataKey="date" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }} axisLine={false} />
            <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: 'hsl(210 40% 80%)', fontSize: 12 }} />
            <Line type="monotone" dataKey="humidity" stroke="#34d399" strokeWidth={2} dot={false} name="Humidity %" />
            <Line type="monotone" dataKey="temperature" stroke="#fbbf24" strokeWidth={2} dot={false} name="Temp °C" />
            <Line type="monotone" dataKey="windSpeed" stroke="#a78bfa" strokeWidth={2} dot={false} name="Wind km/h" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
