import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets, Activity, Map, Bell, BarChart3, Settings,
  LogOut, Shield, User, Sun, Moon, Menu, X, ChevronRight,
  AlertTriangle, Zap
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  isDark: boolean;
  toggleTheme: () => void;
}

const NAV_ITEMS = [
  { path: '/dashboard', icon: Activity, label: 'Overview' },
  { path: '/dashboard/prediction', icon: Zap, label: 'AI Prediction' },
  { path: '/dashboard/map', icon: Map, label: 'Risk Map' },
  { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/dashboard/simulation', icon: Settings, label: 'Simulation' },
  { path: '/dashboard/alerts', icon: Bell, label: 'Alerts' },
];

const ADMIN_ITEMS = [
  { path: '/dashboard/admin', icon: Shield, label: 'Admin Panel' },
];

export default function DashboardLayout({ children, isDark, toggleTheme }: DashboardLayoutProps) {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(3);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const allNavItems = role === 'admin' ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <Droplets className="w-7 h-7 text-sidebar-primary" />
        <span className="font-display font-bold text-lg text-sidebar-foreground">
          AI <span className="text-sidebar-primary">FloodGuard</span>
        </span>
      </div>

      {/* User badge */}
      <div className="mx-4 mt-4 px-3 py-3 rounded-xl bg-sidebar-accent/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
          {role === 'admin' ? <Shield className="w-4 h-4 text-sidebar-primary" /> : <User className="w-4 h-4 text-sidebar-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-sidebar-foreground truncate">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
          </div>
          <div className="text-xs text-muted-foreground capitalize">{role}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {allNavItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {item.label === 'Alerts' && alertCount > 0 && (
                <span className="ml-auto text-xs bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-4 pb-4 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative z-10 w-64 bg-sidebar flex flex-col"
          >
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-sidebar-foreground">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </motion.aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-muted-foreground">
              {location.pathname === '/dashboard' && 'Overview Dashboard'}
              {location.pathname === '/dashboard/prediction' && 'AI Flood Prediction'}
              {location.pathname === '/dashboard/map' && 'Flood Risk Map'}
              {location.pathname === '/dashboard/analytics' && 'Weather Analytics'}
              {location.pathname === '/dashboard/simulation' && 'Weather Simulation'}
              {location.pathname === '/dashboard/alerts' && 'Alert Center'}
              {location.pathname === '/dashboard/admin' && 'Admin Panel'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
            <button className="relative p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-xs bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
