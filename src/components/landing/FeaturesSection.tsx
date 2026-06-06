import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Brain, Satellite, Bell, Map, BarChart3, Shield,
  Zap, Globe, Users, Database
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Prediction Engine',
    desc: 'Random Forest ML model trained on 10+ years of rainfall & flood data, delivering 94.7% accurate flood risk predictions.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Satellite,
    title: 'Real-Time Weather Data',
    desc: 'Live integration with OpenWeatherMap API — continuously ingesting rainfall, humidity, wind speed, and temperature.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Map,
    title: 'Interactive Risk Map',
    desc: 'Visual flood risk map powered by Leaflet.js, showing safe (green), moderate (yellow), and high-risk (red) zones.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Bell,
    title: 'Early Warning Alerts',
    desc: 'Automated alerts triggered when risk thresholds are breached, simulating SMS/email emergency notification systems.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: BarChart3,
    title: 'Weather Analytics',
    desc: 'Interactive charts tracking rainfall trends, temperature patterns, humidity shifts, and prediction history over time.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Zap,
    title: 'Simulation Mode',
    desc: 'Test the AI model by simulating extreme weather scenarios — ideal for training, planning, and hackathon demos.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    desc: 'Separate dashboards for Citizens and Admin/Authorities with role-based access control and tailored insights.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
  },
  {
    icon: Globe,
    title: 'Sustainability Tracking',
    desc: 'Monitor environmental impact — total alerts generated, risk zones protected, and estimated lives safeguarded.',
    color: 'text-teal-400',
    bg: 'bg-teal-400/10',
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-colors group"
    >
      <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${feature.color}`} />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 text-primary text-sm font-medium mb-4"
          >
            <Shield className="w-4 h-4" />
            Platform Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Everything You Need to{' '}
            <span className="text-primary">Fight Floods</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            A complete end-to-end platform combining AI intelligence, real-time data,
            and emergency response capabilities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
