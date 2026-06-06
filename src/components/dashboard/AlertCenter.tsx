import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Clock, X, Filter, MapPin, Zap } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  location: string;
  time: string;
  read: boolean;
}

const INITIAL_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: '🚨 EMERGENCY: Critical Flood Risk Detected',
    message: 'Extreme rainfall of 75mm/h detected in Goregaon. AI model predicts flooding within 2 hours. Immediate evacuation recommended for low-lying areas.',
    location: 'Goregaon, Mumbai',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'high',
    title: '⚠ High Flood Risk — Thane District',
    message: 'Rainfall accumulation reaching critical threshold. AI Risk Score: 78/100. Emergency services should be on standby.',
    location: 'Thane, Maharashtra',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'high',
    title: '⚠ Warning: Heavy Rainfall Forecast',
    message: 'Weather model predicts 45mm/h rainfall in the next 6 hours for Sion area. Flood probability: 68%.',
    location: 'Sion, Mumbai',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '4',
    type: 'medium',
    title: '📊 Moderate Risk Alert — Kurla',
    message: 'Humidity levels rising above 85% with sustained rainfall. Risk Score: 52/100. Monitor conditions.',
    location: 'Kurla, Mumbai',
    time: '2 hrs ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: '✅ System Update: AI Model Retrained',
    message: 'The flood prediction model has been updated with the latest 30 days of weather data. Accuracy improved to 95.2%.',
    location: 'System',
    time: '4 hrs ago',
    read: true,
  },
  {
    id: '6',
    type: 'low',
    title: 'All Clear — Colaba District',
    message: 'Weather conditions normalized. Flood risk dropped to Low. Rainfall: 3mm/h. Risk Score: 12/100.',
    location: 'Colaba, Mumbai',
    time: '6 hrs ago',
    read: true,
  },
];

const typeConfig = {
  critical: { color: 'text-risk-critical', bg: 'bg-risk-critical/10 border-risk-critical/30', icon: AlertTriangle },
  high: { color: 'text-risk-high', bg: 'bg-risk-high/10 border-risk-high/30', icon: AlertTriangle },
  medium: { color: 'text-risk-medium', bg: 'bg-risk-medium/10 border-risk-medium/30', icon: Clock },
  low: { color: 'text-risk-low', bg: 'bg-risk-low/10 border-risk-low/30', icon: CheckCircle },
  info: { color: 'text-primary', bg: 'bg-primary/10 border-primary/30', icon: Bell },
};

export default function AlertCenter() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState<'all' | Alert['type']>('all');
  const [showSimulator, setShowSimulator] = useState(false);
  const [simCity, setSimCity] = useState('');

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
  const unreadCount = alerts.filter(a => !a.read).length;

  const markRead = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  const dismiss = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));
  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  const sendSimAlert = () => {
    if (!simCity) return;
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: 'critical',
      title: `🚨 SIMULATED EMERGENCY: ${simCity}`,
      message: `AI model triggered by simulation: Extreme flood conditions predicted for ${simCity}. Risk Score: 95/100. Probability: 92%. Estimated flooding in < 2 hours.`,
      location: simCity,
      time: 'Just now',
      read: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
    setSimCity('');
    setShowSimulator(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Alert Center</h1>
            <p className="text-muted-foreground text-sm">{unreadCount} unread alerts</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-primary/30 text-primary text-sm hover:bg-primary/5 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Simulate Alert
          </button>
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl glass-card text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* Simulator */}
      {showSimulator && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card rounded-2xl p-5 border border-primary/30"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Emergency Alert Simulator
          </h3>
          <div className="flex gap-3">
            <input
              value={simCity}
              onChange={e => setSimCity(e.target.value)}
              placeholder="Enter city name for emergency alert..."
              className="flex-1 px-4 py-2 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 text-sm"
            />
            <button
              onClick={sendSimAlert}
              className="px-6 py-2 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Trigger Alert
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: `All (${alerts.length})` },
          { key: 'critical', label: 'Critical' },
          { key: 'high', label: 'High' },
          { key: 'medium', label: 'Medium' },
          { key: 'low', label: 'Low' },
          { key: 'info', label: 'Info' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-primary text-primary-foreground'
                : 'glass-card text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const cfg = typeConfig[alert.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`rounded-2xl p-5 border transition-all ${cfg.bg} ${!alert.read ? 'border-l-4' : ''}`}
              onClick={() => markRead(alert.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className={`font-semibold text-sm ${!alert.read ? cfg.color : 'text-foreground'}`}>
                      {alert.title}
                      {!alert.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); dismiss(alert.id); }}
                      className="text-muted-foreground hover:text-foreground flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{alert.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No alerts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
