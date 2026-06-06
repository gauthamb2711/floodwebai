 import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Eye, EyeOff, Loader2, Shield, User } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await signUp(email, password, name, role);
    setLoading(false);
    if (err) setError(err.message);
    else { setSuccess(true); setTimeout(() => navigate('/dashboard'), 2000); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-ocean-deep" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card rounded-3xl p-8 border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Droplets className="w-8 h-8 text-primary animate-pulse" />
            <span className="font-display font-bold text-2xl text-foreground">
              AI <span className="text-primary">FloodGuard</span>
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Join the flood monitoring network
          </p>

          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">Account Created!</h3>
              <p className="text-muted-foreground text-sm">Check your email to verify. Redirecting to dashboard...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                  placeholder="John Smith"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'citizen' as UserRole, label: 'Citizen', icon: User, desc: 'Monitor local risk' },
                    { value: 'admin' as UserRole, label: 'Authority', icon: Shield, desc: 'Full admin access' },
                  ].map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === r.value
                          ? 'border-primary/60 bg-primary/10'
                          : 'border-border bg-muted/30 hover:border-primary/30'
                      }`}
                    >
                      <r.icon className={`w-4 h-4 mb-1 ${role === r.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="text-sm font-medium text-foreground">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
