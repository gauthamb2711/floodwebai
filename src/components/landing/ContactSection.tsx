import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { Droplets } from 'lucide-react';

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Get In <span className="text-primary">Touch</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Questions about deployment, partnerships, or the AI model? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-xl text-foreground">AI FloodGuard</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered urban flood prediction and early warning platform. Protecting cities
                through cutting-edge machine learning and real-time data analytics.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'contact@aifloodguard.io' },
                { icon: Phone, label: 'Emergency Hotline', value: '+1 (800) FLOOD-AI' },
                { icon: MapPin, label: 'HQ', value: 'Mumbai, India — Global Coverage' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-medium text-foreground">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:border-primary/40 transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
                  placeholder="Tell us about your use case..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                {sent ? 'Message Sent! ✓' : (<><Send className="w-4 h-4" /> Send Message</>)}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-border max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm">
        <span>© 2025 AI FloodGuard. Built for climate resilience.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">API Docs</a>
        </div>
      </div>
    </section>
  );
}
