import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OverviewDashboard from '@/components/dashboard/OverviewDashboard';
import AIPredictionPanel from '@/components/dashboard/AIPredictionPanel';
import FloodRiskMap from '@/components/dashboard/FloodRiskMap';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';
import AlertCenter from '@/components/dashboard/AlertCenter';
import AdminPanel from '@/components/dashboard/AdminPanel';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { role } = useAuth();
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('light', !next);
      return next;
    });
  };

  return (
    <DashboardLayout isDark={isDark} toggleTheme={toggleTheme}>
      <Routes>
        <Route index element={<OverviewDashboard />} />
        <Route path="prediction" element={<AIPredictionPanel />} />
        <Route path="map" element={<FloodRiskMap />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="simulation" element={<AIPredictionPanel />} />
        <Route path="alerts" element={<AlertCenter />} />
        {role === 'admin' && <Route path="admin" element={<AdminPanel />} />}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
