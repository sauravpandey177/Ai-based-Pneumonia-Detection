import { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UploadBox({ onUpload, file, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        handleFileSelect(droppedFile);
      }
    }
  }, []);

  const handleFileSelect = (selectedFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpload({
        file: selectedFile,
        preview: e.target.result,
        name: selectedFile.name,
        size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              relative w-full h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center
              transition-all duration-300 ease-in-out bg-slate-900/40 backdrop-blur-md cursor-pointer overflow-hidden
              ${isDragging ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/60'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Background glow lines */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
            
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700/50 shadow-inner flex items-center justify-center mb-6 relative z-10 group">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <UploadCloud className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-2 relative z-10">
              Drag & Drop your Chest X-Ray
            </h3>
            <p className="text-slate-400 text-sm relative z-10">
              or click to browse from your computer
            </p>
            <p className="text-xs text-slate-500 mt-4 relative z-10">
              Supports: DICOM, JPEG, PNG (Max 50MB)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full relative glass-panel rounded-3xl p-2 overflow-hidden flex items-center justify-center bg-slate-900/80 h-[400px]"
          >
            <img 
              src={file.preview} 
              alt="X-ray preview" 
              className="max-w-full max-h-full object-contain rounded-2xl z-10 border border-slate-700/50 shadow-2xl"
            />
            
            {/* Top controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClear}
                className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 flex items-center justify-center transition-colors shadow-lg"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between border border-slate-700/50 bg-slate-900/90 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <FileImage className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200 truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">{file.size}</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
              </div>
            </div>
            
            {/* Background blur of the image itself */}
            <div 
              className="absolute inset-0 opacity-20 blur-3xl scale-110 z-0"
              style={{ backgroundImage: `url(${file.preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
