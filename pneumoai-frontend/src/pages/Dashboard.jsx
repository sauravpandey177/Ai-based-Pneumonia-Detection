import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, FileDown } from 'lucide-react';
import { UploadBox } from '../components/UploadBox';
import { AnalysisCard } from '../components/AnalysisCard';
import { GradCamToggle } from '../components/GradCamToggle';

export function Dashboard() {
  const [fileData, setFileData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [heatmapImage, setHeatmapImage] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [tokenNo, setTokenNo] = useState('');
  const [scanId, setScanId] = useState(null);

  const handleUpload = (data) => {
    setFileData(data);
    setResult(null);
    setConfidence(null);
    setHeatmapImage(null);
    setTokenNo(`TKN-${Math.floor(1000 + Math.random() * 9000)}`);
    setPatientName('');
    setScanId(null);
  };

  const handleClear = () => {
    setFileData(null);
    setResult(null);
    setConfidence(null);
    setHeatmapImage(null);
    setIsAnalyzing(false);
    setScanId(null);
  };

  const analyzeImage = async () => {
    if (!fileData) return;
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('patient_name', patientName || 'Unknown Patient');
      formData.append('token_no', tokenNo);

      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data.prediction === 'NORMAL' ? 'Normal' : 'Pneumonia');
      setConfidence(data.confidence);
      setHeatmapImage(`data:image/png;base64,${data.heatmap}`);
      setScanId(data.id);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error connecting to backend model.');
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Diagnosis Center</h1>
           <p className="text-sm text-slate-400">Upload chest x-rays for instant AI analysis.</p>
        </div>
        <div className="flex items-center gap-4">
           {result && scanId && (
             <a 
               href={`${import.meta.env.VITE_API_URL || ''}/download_history_report/${scanId}`}
               download
               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all font-medium text-sm shadow-[0_0_15px_rgba(59,130,246,0.15)]"
             >
               <FileDown className="w-4 h-4" /> Download Report
             </a>
           )}
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/80 transition-all font-medium text-sm text-slate-200">
             <Activity className="w-4 h-4 text-emerald-400" /> System Online
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth z-10 relative h-[calc(100vh-80px)]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <UploadBox
              file={fileData}
              onUpload={handleUpload}
              onClear={handleClear}
            />
            
            <AnimatePresence>
              {fileData && !isAnalyzing && !result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="glass-card mb-4 p-4 rounded-2xl flex flex-col gap-4 border border-slate-700/50">
                    <div className="flex justify-between items-center bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                       <span className="text-sm font-medium text-blue-300">Generated Token:</span>
                       <span className="font-mono font-bold text-blue-400 bg-slate-900 px-3 py-1 rounded shadow-inner">{tokenNo}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient Name</label>
                       <input 
                         type="text" 
                         value={patientName}
                         onChange={(e) => setPatientName(e.target.value)}
                         placeholder="Enter patient name..."
                         className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                       />
                    </div>
                  </div>

                  <button
                    onClick={analyzeImage}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all group scale-100 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Zap className="w-5 h-5 text-yellow-300 group-hover:scale-110 transition-transform" />
                    <span className="text-lg">Run AI Analysis</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analysis Results / Loading */}
            <AnimatePresence mode="popLayout">
               {(isAnalyzing || result) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  >
                     <AnalysisCard
                       isLoading={isAnalyzing}
                       result={result}
                       confidence={confidence}
                       onReset={handleClear}
                       downloadUrl={scanId ? `${import.meta.env.VITE_API_URL || ''}/download_history_report/${scanId}` : null}
                     />
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-7 flex flex-col gap-8">
             <AnimatePresence mode="popLayout">
               {result && (
                 <motion.div
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                 >
                   <GradCamToggle
                     originalImage={fileData?.preview}
                     heatmapImage={heatmapImage}
                     hasResult={!!result}
                   />
                 </motion.div>
               )}
             </AnimatePresence>
             
             {!result && !isAnalyzing && (
               <div className="w-full h-[500px] rounded-3xl border border-slate-800/50 bg-slate-900/20 flex flex-col items-center justify-center text-slate-500 glass-card">
                  <Activity className="w-16 h-16 text-slate-700 mb-4 opacity-50" />
                  <p className="text-lg">Waiting for scan data...</p>
                  <p className="text-sm mt-2 opacity-60 max-w-sm text-center">Visualizations and heatmaps will appear here after the inference process is complete.</p>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
