import { motion } from 'framer-motion';
import { Target, Zap, Layers, Cpu, Server, Activity, Shield } from 'lucide-react';

export function ModelStats() {
  const metrics = [
    { label: "Accuracy", value: "98.4%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Sensitivity", value: "97.2%", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Specificity", value: "96.8%", icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Avg Inference Time", value: "0.2s", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" }
  ];

  // Dummy data for the training graph
  const trainingProgress = Array.from({ length: 20 }, (_, i) => 60 + Math.random() * 38);

  return (
    <div className="flex-1 min-h-screen relative overflow-hidden flex flex-col pt-8 lg:pt-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-8 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Model Diagnostics</h1>
        <p className="text-sm text-slate-400">Live profiling of the underlying PyTorch Vision architecture.</p>
      </header>

      <main className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth z-10 w-full max-w-[1400px] mx-auto space-y-8">
         
         {/* Top Metric Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {metrics.map((metric, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden group border border-slate-700/50"
             >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-5 blur-2xl group-hover:opacity-10 transition-opacity rounded-full"></div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${metric.bg} ${metric.border} border shadow-inner`}>
                   <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-400">{metric.label}</p>
                   <h3 className={`text-3xl font-bold tracking-tight mt-1 ${metric.color} drop-shadow-sm`}>
                     {metric.value}
                   </h3>
                </div>
             </motion.div>
           ))}
         </div>

         {/* Charts & Architecture */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Chart */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 }}
             className="lg:col-span-2 glass-panel p-8 rounded-3xl flex flex-col border border-slate-700/50"
           >
             <div className="flex justify-between items-center mb-6">
               <div>
                 <h3 className="text-xl font-semibold text-slate-200">Validation Accuracy</h3>
                 <p className="text-sm text-slate-500">Training progress over 20 epochs</p>
               </div>
               <div className="flex gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] mt-1.5"/>
                 <span className="text-sm font-medium text-slate-300">ResNet-50 v2</span>
               </div>
             </div>
             
             {/* Simulated Bar Chart */}
             <div className="h-64 mt-auto flex items-end gap-2 w-full pt-4">
               {trainingProgress.map((val, i) => (
                 <div key={i} className="flex-1 flex flex-col justify-end group">
                    <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${val}%` }}
                       transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
                       className="w-full bg-indigo-500/20 hover:bg-indigo-500/50 rounded-t-sm border-t border-indigo-500/50 relative transition-colors"
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs text-white px-2 py-1 rounded shadow-lg pointer-events-none">
                         {val.toFixed(1)}%
                       </div>
                    </motion.div>
                 </div>
               ))}
               
               {/* Average Line representation */}
               <div className="absolute left-8 right-8 bottom-32 border-t border-dashed border-slate-500/30 opacity-50 pointer-events-none"></div>
             </div>
           </motion.div>

           {/* Pipeline Architecture */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.5 }}
             className="glass-panel p-8 rounded-3xl flex flex-col gap-6 border border-slate-700/50"
           >
             <div>
               <h3 className="text-xl font-semibold text-slate-200">Inference Pipeline</h3>
               <p className="text-sm text-slate-500">Live data flow architecture</p>
             </div>

             <div className="flex flex-col gap-5 relative pt-4">
                <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-indigo-500/20" />
                
                <div className="flex items-center gap-4 z-10">
                   <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md">
                     <Layers className="w-5 h-5 text-slate-400" />
                   </div>
                   <div className="flex-1 glass-card p-3 rounded-xl border border-slate-700/50 hover:border-slate-500/50 transition-colors">
                     <p className="text-sm font-semibold text-slate-200">Image CLAHE filter</p>
                     <p className="text-xs text-slate-500">Pre-processing</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 z-10">
                   <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                     <Cpu className="w-5 h-5 text-indigo-400" />
                   </div>
                   <div className="flex-1 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl hover:bg-indigo-500/20 transition-colors">
                     <p className="text-sm font-semibold text-indigo-300">ResNet-50 CNN</p>
                     <p className="text-xs text-indigo-400/60">Feature Extraction</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 z-10">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                     <Server className="w-5 h-5 text-emerald-400" />
                   </div>
                   <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl hover:bg-emerald-500/20 transition-colors">
                     <p className="text-sm font-semibold text-emerald-300">Grad-CAM API</p>
                     <p className="text-xs text-emerald-400/60">Spatial visualization</p>
                   </div>
                </div>
             </div>
           </motion.div>
         </div>

      </main>
    </div>
  );
}
