
import React, { useState } from 'react';
import { parseJobText } from '../geminiService';
import { JobApplication } from '../types';

interface AIImportViewProps {
  onSuccess: (app: Partial<JobApplication>) => void;
}

const AIImportView: React.FC<AIImportViewProps> = ({ onSuccess }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const parsedData = await parseJobText(inputText);
      onSuccess(parsedData);
      setInputText('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during AI processing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-500/40">
           <i className="fas fa-wand-magic-sparkles text-3xl"></i>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Data Extraction</h1>
        <p className="text-slate-500 mt-3 text-lg">Paste job descriptions, LinkedIn profiles, or confirmation emails to auto-fill details.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="relative">
          <textarea
            className="w-full min-h-[400px] p-6 text-slate-700 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none transition-all text-base leading-relaxed resize-none custom-scrollbar"
            placeholder="Paste text from Gmail, Sheets, LinkedIn, or a JD here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-slate-900 animate-pulse">Gemini is parsing your content...</p>
              <p className="text-sm text-slate-500 mt-2">Extracting company, role, salary, and requirements.</p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-center gap-3">
            <i className="fas fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-2 text-slate-400 text-sm">
             <i className="fas fa-info-circle"></i>
             <span>Works best with structured text like job posts or status emails.</span>
           </div>
           <button
             disabled={!inputText.trim() || isLoading}
             onClick={handleProcess}
             className={`px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
           >
             <i className="fas fa-bolt"></i>
             Extract Details
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
             <i className="fas fa-envelope"></i>
           </div>
           <h3 className="font-bold text-slate-900 mb-1">From Gmail</h3>
           <p className="text-xs text-slate-500">Paste the body of a "Thanks for applying" or interview invite email.</p>
         </div>
         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
             <i className="fas fa-file-invoice"></i>
           </div>
           <h3 className="font-bold text-slate-900 mb-1">From Descriptions</h3>
           <p className="text-xs text-slate-500">Copy the whole job post to extract skills and salary info automatically.</p>
         </div>
         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
             <i className="fas fa-table"></i>
           </div>
           <h3 className="font-bold text-slate-900 mb-1">From Sheets</h3>
           <p className="text-xs text-slate-500">Select rows from existing tracking sheets to port data into our enhanced UI.</p>
         </div>
      </div>
    </div>
  );
};

export default AIImportView;
