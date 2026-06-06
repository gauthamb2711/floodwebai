import { motion } from 'framer-motion';
import { Leaf, TrendingDown, Users, Globe } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const METRICS = [
  {
    icon: Globe,
    value: 2847,
    suffix: '+',
    label: 'Cities Monitored',
    desc: 'Urban centers tracked across 68 countries',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Users,
    value: 8400000,
    suffix: '+',
    label: 'Lives Protected',
    desc: 'People in early-warning coverage zones',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: TrendingDown,
    value: 73,
    suffix: '%',
    label: 'Damage Reduction',
    desc: 'Average reduction in flood-related property damage',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Leaf,
    value: 1200000,
    suffix: '+',
    label: 'Predictions Made',
    desc: 'AI risk assessments generated globally',
    color: 'text-teal-400',
    bg: 'bg-teal-400/10',
  },
];

export default function SustainabilitySection() {
  return (
    <section id="sustainability" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-400/30 text-emerald-400 text-sm font-medium mb-4"
          >
            <Leaf className="w-4 h-4" />
            Environmental Impact
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Technology That Protects{' '}
            <span className="text-emerald-400">Our Planet</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Climate change is intensifying urban flooding globally. AI FloodGuard directly addresses
            SDG 11 (Sustainable Cities) and SDG 13 (Climate Action).
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group hover:border-primary/30 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${m.color}`} />
                </div>
                <div className={`font-display text-3xl font-bold ${m.color} mb-1`}>
                  <AnimatedCounter target={m.value} suffix={m.suffix} />
                </div>
                <div className="font-semibold text-foreground text-sm mb-1">{m.label}</div>
                <div className="text-muted-foreground text-xs">{m.desc}</div>
              </motion.div>
            );
          })}
        </div>

        {/* SDG badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8"
        >
          <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">
            Aligned with UN Sustainable Development Goals
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { num: '11', title: 'Sustainable Cities & Communities', color: 'from-orange-500 to-amber-500' },
              { num: '13', title: 'Climate Action', color: 'from-emerald-500 to-teal-500' },
              { num: '3', title: 'Good Health & Well-Being', color: 'from-blue-500 to-cyan-500' },
              { num: '9', title: 'Industry, Innovation & Infrastructure', color: 'from-purple-500 to-blue-500' },
            ].map(sdg => (
              <div key={sdg.num} className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r ${sdg.color} bg-opacity-20`}>
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-display font-bold text-white text-lg">
                  {sdg.num}
                </div>
                <span className="text-sm font-medium text-white">{sdg.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
