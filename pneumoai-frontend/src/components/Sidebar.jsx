import { useState } from 'react';
import { LayoutDashboard, FileScan, History, Activity, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const initialMenuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'new', icon: FileScan, label: 'New Analysis' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'stats', icon: Activity, label: 'Model Stats' },
];

const bottomItems = [
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support' },
];

export function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Pneumo<span className="text-gradient">AI</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Main Menu
        </div>
        {initialMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto mb-4 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-slate-800 text-slate-200 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-slate-300' : 'text-slate-500'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
