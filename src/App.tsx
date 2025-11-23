
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/dashboard/page';
import { ManifestationsPage } from './pages/manifestations/page';
import { AnalyticsPage } from './pages/analytics/page';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-6 overflow-y-auto h-screen">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/manifestations" element={<ManifestationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<div className="p-4">Configurações (Em breve)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
