import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Layers } from 'lucide-react';

export function GradCamToggle({ originalImage, heatmapImage, hasResult }) {
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (!hasResult) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full glass-panel rounded-3xl p-6 h-[500px] flex flex-col relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4 relative z-20">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Grad-CAM Visualization</h3>
          <p className="text-sm text-slate-500">Spatial map of critical regions</p>
        </div>
        <div className="flex bg-slate-800/80 rounded-xl p-1 shadow-inner border border-slate-700">
             <button
                onClick={() => setShowHeatmap(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!showHeatmap ? 'bg-slate-700 shadow-md text-white' : 'text-slate-400 hover:text-slate-200'}`}
             >
                <RefreshCw className="w-4 h-4" />
                Original
             </button>
             <button
                onClick={() => setShowHeatmap(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${showHeatmap ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white border border-indigo-500/50' : 'text-slate-400 hover:text-slate-200'}`}
             >
                <Layers className="w-4 h-4" />
                Heatmap Overlay
             </button>
        </div>
      </div>

      <div className="relative flex-1 rounded-2xl overflow-hidden glass-card flex items-center justify-center bg-slate-900 shadow-inner z-10 border border-slate-700/50">
          <AnimatePresence mode="wait">
            {!showHeatmap ? (
              <motion.img
                key="original"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={originalImage}
                alt="Original X-Ray"
                className="max-w-full max-h-full object-contain rounded-xl z-10 shadow-xl"
              />
            ) : (
               <motion.div
                 key="heatmap"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
                 className="relative w-full h-full flex items-center justify-center"
               >
                 <img
                    src={heatmapImage || originalImage}
                    alt="Grad-CAM Heatmap"
                    className="max-w-full max-h-full object-contain rounded-xl"
                 />
               </motion.div>
            )}
          </AnimatePresence>
      </div>
      
      {/* Background ambient lighting */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl rounded-full z-0 pointer-events-none" />
    </motion.div>
  );
}
