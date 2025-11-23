
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, BarChart2, Settings, ShieldCheck } from 'lucide-react';

export const Sidebar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen fixed left-0 top-0 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <ShieldCheck className="text-emerald-600 mr-2" />
        <span className="font-bold text-slate-800">Guardião</span>
      </div>
      <nav className="p-4 space-y-1">
        <NavLink to="/" className={linkClass}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/manifestations" className={linkClass}>
          <MessageSquare size={20} /> Manifestações
        </NavLink>
        <NavLink to="/analytics" className={linkClass}>
          <BarChart2 size={20} /> Relatórios
        </NavLink>
        <div className="pt-4 mt-4 border-t border-slate-100">
          <NavLink to="/settings" className={linkClass}>
            <Settings size={20} /> Configurações
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};
