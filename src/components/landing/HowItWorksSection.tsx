import { motion } from 'framer-motion';
import { Cloud, Brain, AlertTriangle, Map, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Cloud,
    title: 'Data Collection',
    desc: 'Real-time weather data is fetched every 15 minutes from OpenWeatherMap API — rainfall, humidity, temperature, wind speed.',
    color: 'from-blue-500 to-cyan-500',
    details: ['OpenWeatherMap API', 'Firebase Firestore storage', 'Historical data archiving'],
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI Analysis',
    desc: 'Our Random Forest model processes 12+ weather features, referencing 10 years of historical flood events to compute risk vectors.',
    color: 'from-primary to-purple-500',
    details: ['Random Forest Classifier', '94.7% accuracy', 'Probability estimation'],
  },
  {
    step: '03',
    icon: AlertTriangle,
    title: 'Risk Classification',
    desc: 'The AI outputs a risk score (0-100) and classifies the threat level as Low, Medium, High, or Critical with explanations.',
    color: 'from-amber-500 to-orange-500',
    details: ['0-100 risk score', '4-tier classification', 'Explainable AI output'],
  },
  {
    step: '04',
    icon: Map,
    title: 'Visual Alert Dispatch',
    desc: 'Risk zones update on the interactive map in real-time. Emergency alerts are dispatched to authorities and citizens automatically.',
    color: 'from-rose-500 to-red-500',
    details: ['Leaflet.js live map', 'SMS/email simulation', 'Multi-channel alerts'],
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 text-primary text-sm font-medium mb-4"
          >
            <Brain className="w-4 h-4" />
            How The AI Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            4-Step Intelligent{' '}
            <span className="text-primary">Flood Pipeline</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative glass-card rounded-2xl p-6 group"
              >
                {/* Step number */}
                <div className="font-display text-6xl font-bold text-primary/10 absolute top-4 right-4">
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="font-display font-bold text-xl text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{step.desc}</p>

                <ul className="space-y-1">
                  {step.details.map(d => (
                    <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Connector arrow */}
                {i < STEPS.length - 1 && (
                  <div className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Model accuracy visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 glass-card rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Model Accuracy', value: '94.7%', sub: 'Random Forest Classifier' },
              { label: 'Avg. Prediction Time', value: '< 200ms', sub: 'Real-time inference' },
              { label: 'Training Data', value: '10+ Years', sub: 'Historical flood events' },
            ].map(m => (
              <div key={m.label}>
                <div className="font-display text-4xl font-bold text-primary">{m.value}</div>
                <div className="font-semibold text-foreground mt-1">{m.label}</div>
                <div className="text-muted-foreground text-sm">{m.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
