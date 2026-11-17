import { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/schema';
import { useConnectivity } from '@/hooks/useConnectivity';
import { BottomNav } from '@/components/BottomNav';
import { StatusStrip } from '@/components/StatusStrip';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ExamsPage } from '@/features/exams/ExamsPage';
import { PracticePage } from '@/features/practice/PracticePage';
import { AssistantPage } from '@/features/ai/AssistantPage';
import { ProfilePage } from '@/features/profiles/ProfilePage';

function Shell() {
  const isOnline = useConnectivity();
  const pendingCount = useLiveQuery(() => db.syncQueue.where('status').equals('pending').count(), [], 0) ?? 0;
  const failedCount = useLiveQuery(() => db.syncQueue.where('status').equals('failed').count(), [], 0) ?? 0;
  const cloudConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  useEffect(() => {
    document.documentElement.dataset.connection = isOnline ? 'online' : 'offline';
  }, [isOnline]);

  return (
    <div className="app-frame">
      <div className="app-glow" aria-hidden="true" />
      <StatusStrip isOnline={isOnline} pendingCount={pendingCount} failedCount={failedCount} cloudConfigured={cloudConfigured} />
      <main className="app-main"><AppErrorBoundary><Outlet /></AppErrorBoundary></main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/ai" element={<AssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
