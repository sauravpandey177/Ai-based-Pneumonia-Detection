import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { AnalysisCard } from '../components/AnalysisCard';
import { GradCamToggle } from '../components/GradCamToggle';

export function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/history`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setHistoryItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedScan(null);
  };

  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading history records...</p>
      </div>
    );
  }

  // If a scan is selected, show details view
  if (selectedScan) {
    return (
      <div className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth z-10 relative h-[calc(100vh)]">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Scan Record Details</h2>
            <button 
              onClick={clearSelection}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              Back to History
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 flex flex-col gap-8">
              <AnalysisCard
                isLoading={false}
                result={selectedScan.prediction === 'NORMAL' ? 'Normal' : 'Pneumonia'}
                confidence={selectedScan.confidence}
                downloadUrl={`${import.meta.env.VITE_API_URL || ''}/download_history_report/${selectedScan.id}`}
              />
            </div>
            
            <div className="lg:col-span-7 flex flex-col gap-8">
              <GradCamToggle
                originalImage={`${import.meta.env.VITE_API_URL || ''}${selectedScan.image_url}`}
                heatmapImage={`data:image/png;base64,${selectedScan.heatmap}`}
                hasResult={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth z-10 relative h-[calc(100vh)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Patient Scan History</h2>
        </div>

        {historyItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px] border border-slate-800/50 rounded-3xl bg-slate-900/20 glass-card">
            <AlertCircle className="w-16 h-16 text-slate-700 mb-4 opacity-50" />
            <p className="text-lg text-slate-400">No past scan records found.</p>
            <p className="text-sm mt-2 text-slate-500 max-w-sm text-center">
              Upload images in the Dashboard to generate records here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800/50">
              <div className="col-span-3">Token ID</div>
              <div className="col-span-4">Patient Name</div>
              <div className="col-span-3">Date & Time</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            
            <AnimatePresence>
              {historyItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center bg-slate-900/40 glass-card rounded-2xl border border-slate-800/50 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="md:col-span-3 font-mono text-sm text-blue-400">{item.token_no || 'TKN-OLD0'}</div>
                  <div className="md:col-span-4 font-medium text-slate-200 truncate pr-4" title={item.patient_name || 'Unknown Patient'}>{item.patient_name || 'Unknown Patient'}</div>
                  <div className="md:col-span-3 text-sm text-slate-400">
                    <div className="font-medium text-slate-300">{new Date(item.timestamp).toLocaleDateString()}</div>
                    <div className="text-xs">{new Date(item.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <div className="md:col-span-2 text-right flex justify-end">
                    <button 
                      onClick={() => setSelectedScan(item)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors border border-blue-500/20"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
