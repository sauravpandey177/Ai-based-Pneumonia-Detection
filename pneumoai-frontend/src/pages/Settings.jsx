import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Database, Cpu, Save, AlertTriangle, Download, Trash2 } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('model');
  const [autoComplete, setAutoComplete] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  
  // Privacy states
  const [autoDelete, setAutoDelete] = useState(false);

  const tabs = [
    { id: 'model', icon: Cpu, label: 'Model Configuration' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'privacy', icon: Database, label: 'Data & Privacy' }
  ];

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden flex flex-col pt-8 lg:pt-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-8 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Preferences</h1>
        <p className="text-sm text-slate-400">Manage your AI model configurations and application settings.</p>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth z-10 w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <div className="glass-panel p-4 rounded-3xl flex flex-col gap-2">
               {tabs.map(tab => {
                 const Icon = tab.icon;
                 const isActive = activeTab === tab.id;
                 return (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all ${
                       isActive 
                         ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                         : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                     }`}
                   >
                     <Icon className="w-5 h-5" /> {tab.label}
                   </button>
                 );
               })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 relative min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
               
               {/* MODEL CONFIGURATION */}
               {activeTab === 'model' && (
                 <motion.div 
                   key="model"
                   initial={{ opacity: 0, x: 10 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.2 }}
                   className="glass-panel p-8 rounded-3xl flex flex-col gap-6"
                 >
                    <div>
                      <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-2">
                        <Cpu className="w-5 h-5 text-indigo-400" /> Model Configuration
                      </h3>
                      <p className="text-sm text-slate-400">Tweak how the AI analyzes visual structures.</p>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                       <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                             <label className="text-sm font-medium text-slate-300">Confidence Alert Threshold</label>
                             <span className="text-sm font-bold text-indigo-400">{confidenceThreshold}%</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">Pneumonia predictions below this score will be flagged for manual review.</p>
                          <input 
                            type="range" 
                            min="50" max="99" 
                            value={confidenceThreshold} 
                            onChange={(e) => setConfidenceThreshold(e.target.value)}
                            className="w-full accent-indigo-500 cursor-pointer" 
                          />
                       </div>
                       
                       <hr className="border-slate-800" />
                       
                       <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-300">Auto-Enhance X-Rays</p>
                            <p className="text-xs text-slate-500 mt-1">Pre-process images with CLAHE filter before inference.</p>
                          </div>
                          <button 
                             onClick={() => setAutoComplete(!autoComplete)} 
                             className={`w-12 h-6 rounded-full p-1 transition-colors ${autoComplete ? 'bg-indigo-500' : 'bg-slate-700'}`}
                          >
                             <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-md ${autoComplete ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {/* NOTIFICATIONS */}
               {activeTab === 'notifications' && (
                 <motion.div 
                   key="notifications"
                   initial={{ opacity: 0, x: 10 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.2 }}
                   className="glass-panel p-8 rounded-3xl flex flex-col gap-6"
                 >
                    <div>
                      <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-2">
                        <Bell className="w-5 h-5 text-blue-400" /> Notifications
                      </h3>
                      <p className="text-sm text-slate-400">Manage your system alerts and email updates.</p>
                    </div>
                    
                    <div className="flex flex-col gap-4 mt-2">
                       <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                          <div>
                            <p className="text-sm font-medium text-slate-300">High Severity Email Alerts</p>
                            <p className="text-xs text-slate-500 mt-1">Get an email when a scan is predicted as severe Pneumonia.</p>
                          </div>
                          <button 
                             onClick={() => setEmailAlerts(!emailAlerts)} 
                             className={`w-12 h-6 rounded-full p-1 transition-colors ${emailAlerts ? 'bg-blue-500' : 'bg-slate-700'}`}
                          >
                             <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-md ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>

                       <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                          <div>
                            <p className="text-sm font-medium text-slate-300">System Updates & Maintenance</p>
                            <p className="text-xs text-slate-500 mt-1">Receive notifications about AI model updates.</p>
                          </div>
                          <button 
                             onClick={() => setSystemUpdates(!systemUpdates)} 
                             className={`w-12 h-6 rounded-full p-1 transition-colors ${systemUpdates ? 'bg-blue-500' : 'bg-slate-700'}`}
                          >
                             <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-md ${systemUpdates ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}

               {/* DATA & PRIVACY */}
               {activeTab === 'privacy' && (
                 <motion.div 
                   key="privacy"
                   initial={{ opacity: 0, x: 10 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.2 }}
                   className="glass-panel p-8 rounded-3xl flex flex-col gap-6"
                 >
                    <div>
                      <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-2">
                        <Database className="w-5 h-5 text-emerald-400" /> Data & Privacy
                      </h3>
                      <p className="text-sm text-slate-400">Control how patient scan data is handled and stored.</p>
                    </div>
                    
                    <div className="flex flex-col gap-6 mt-2">
                       <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-300">Auto-delete History (HIPAA)</p>
                            <p className="text-xs text-slate-500 mt-1">Automatically clear all scans and predictions after 30 days.</p>
                          </div>
                          <button 
                             onClick={() => setAutoDelete(!autoDelete)} 
                             className={`w-12 h-6 rounded-full p-1 transition-colors ${autoDelete ? 'bg-emerald-500' : 'bg-slate-700'}`}
                          >
                             <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-md ${autoDelete ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                       </div>

                       <hr className="border-slate-800" />

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 py-3 rounded-xl font-medium transition-all group">
                             <Download className="w-4 h-4 group-hover:scale-110 transition-transform" /> Export All Data
                          </button>
                          <button className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl font-medium transition-all group">
                             <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Purge Cache
                          </button>
                       </div>
                       
                       <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <p className="text-xs text-yellow-500/90 leading-relaxed">
                            No patient identifying metadata (PHI) is ever transmitted to the inference servers. All data masking happens locally in your browser before upload.
                          </p>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="mt-auto flex justify-end pt-8">
               <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Save className="w-4 h-4" /> Save Preferences
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
