import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, BarChart3, Users, Settings, Database, Bell, TrendingUp } from 'lucide-react';
import { generateHistoricalData } from '@/lib/aiFloodPrediction';

export default function AdminPanel() {
  const [uploadMsg, setUploadMsg] = useState('');
  const data = generateHistoricalData(7);
  const avgRisk = Math.round(data.reduce((a, d) => a + d.riskScore, 0) / data.length);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Admin Control Panel</h1>
          <p className="text-muted-foreground text-sm">Manage alerts, datasets, and system analytics</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Predictions', value: '1,440', icon: TrendingUp, color: 'text-primary' },
          { label: 'Active Alerts', value: '3', icon: Bell, color: 'text-risk-high' },
          { label: 'Registered Users', value: '284', icon: Users, color: 'text-emerald-400' },
          { label: 'Avg Risk Score', value: avgRisk, icon: BarChart3, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" /> Upload Historical Dataset
          </h3>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
            onClick={() => { setUploadMsg('✓ Dataset uploaded & model retrained (simulation)'); setTimeout(() => setUploadMsg(''), 3000); }}>
            <Database className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Click to upload CSV dataset</p>
            <p className="text-xs text-muted-foreground mt-1">Supports: rainfall_history.csv, flood_events.csv</p>
          </div>
          {uploadMsg && <div className="mt-3 text-sm text-risk-low text-center">{uploadMsg}</div>}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> System Configuration
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Alert Threshold (Risk Score)', default: 60 },
              { label: 'Data Refresh Interval (min)', default: 15 },
              { label: 'Max Alert Recipients', default: 500 },
            ].map(cfg => (
              <div key={cfg.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{cfg.label}</span>
                <input type="number" defaultValue={cfg.default}
                  className="w-20 px-3 py-1 rounded-lg bg-muted/50 border border-border text-foreground text-sm text-right focus:outline-none focus:border-primary/60" />
              </div>
            ))}
            <button className="w-full mt-2 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Recent Prediction Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {['Timestamp', 'Location', 'Rainfall', 'Risk Level', 'Score', 'Alert Sent'].map(h => (
                  <th key={h} className="pb-2 text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 6).map((d, i) => {
                const risk = d.riskScore < 25 ? 'Low' : d.riskScore < 55 ? 'Medium' : d.riskScore < 80 ? 'High' : 'Critical';
                const riskClass = risk === 'Low' ? 'text-risk-low' : risk === 'Medium' ? 'text-risk-medium' : 'text-risk-high';
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-2 text-muted-foreground">{d.date} 14:30</td>
                    <td className="py-2 text-foreground">Mumbai Zone {i + 1}</td>
                    <td className="py-2 text-blue-400">{d.rainfall} mm/h</td>
                    <td className={`py-2 font-medium ${riskClass}`}>{risk}</td>
                    <td className="py-2 text-foreground">{d.riskScore}/100</td>
                    <td className="py-2">
                      {d.riskScore > 55 ? <span className="text-risk-high text-xs">✓ Sent</span> : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
