import { motion } from 'framer-motion';
import { ArrowRight, Shield, Activity, MapPin, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Rain particle component
function RainParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 0.8 + Math.random() * 1.2,
      height: 10 + Math.random() * 20,
      opacity: 0.2 + Math.random() * 0.4,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="rain-particle"
          style={{
            left: `${p.left}%`,
            height: `${p.height}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

const STATS = [
  { label: 'Cities Monitored', value: '2,400+' },
  { label: 'Predictions Made', value: '1.2M+' },
  { label: 'Lives Protected', value: '8.4M+' },
  { label: 'Model Accuracy', value: '94.7%' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-ocean-deep to-background" />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(hsl(188 100% 48% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(188 100% 48% / 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-destructive/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <RainParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 text-primary text-sm font-medium mb-8"
          >
            <Activity className="w-4 h-4 animate-pulse" />
            AI-Powered Real-Time Flood Prediction System
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Predict Floods.{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Save Lives.
              </span>
              <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full" />
            </span>
            {' '}Act Fast.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI FloodGuard uses advanced machine learning to analyze real-time weather patterns,
            predict urban flood risk with 94.7% accuracy, and deliver early warnings before
            disaster strikes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all shadow-glow hover:shadow-lg animate-pulse-glow"
            >
              Launch Platform <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-xl glass-card border border-primary/30 text-foreground font-semibold text-lg hover:border-primary/60 transition-colors"
            >
              <Activity className="w-5 h-5 text-primary" />
              See How It Works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1 h-8 rounded-full bg-primary/50"
        />
      </motion.div>
    </section>
  );
}
