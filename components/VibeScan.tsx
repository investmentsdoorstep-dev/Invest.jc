
import React, { useState, useRef } from 'react';
import { SITUATIONS } from '../constants';
import { analyzeVibe, generateImprovedLook } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { VibeResult } from '../types';

interface VibeScanProps {
  isPremium: boolean;
  dailyCount: number;
  onComplete: (result: VibeResult) => void;
  onBack: () => void;
  onPaywall: () => void;
}

const VibeScan: React.FC<VibeScanProps> = ({ isPremium, dailyCount, onComplete, onBack, onPaywall }) => {
  const [image, setImage] = useState<string | null>(null);
  const [situation, setSituation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('Initializing...');
  const [step, setStep] = useState(1); // 1: Upload, 2: Context, 3: Processing
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!isPremium && dailyCount >= 1) {
      onPaywall();
      return;
    }

    if (!image || !situation) return;
    setLoading(true);
    setStep(3);
    
    const statuses = [
      'Deconstructing aesthetic DNA...',
      'Mapping color harmonies...',
      'Analyzing spatial composition...',
      'Evaluating contextual alignment...',
      'Synthesizing fix protocols...',
      'Manifesting improved vision...'
    ];
    
    let currentStatus = 0;
    const interval = setInterval(() => {
      currentStatus = (currentStatus + 1) % statuses.length;
      setStatusText(statuses[currentStatus]);
    }, 1800);

    try {
      const aiResponse = await analyzeVibe(image, situation);
      
      let improvedUrl;
      try {
        improvedUrl = await generateImprovedLook(image, aiResponse.fix_tip);
      } catch (e) {
        console.warn("Vision skipped", e);
      }

      const newResult: VibeResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        imageUrl: image,
        improvedImageUrl: improvedUrl,
        situation,
        ...aiResponse
      };

      storageService.addResult(newResult);
      clearInterval(interval);
      onComplete(newResult);
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      alert("Neural sync failed. Please try again with a clearer image.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white transition-colors">
      <div className="p-6 flex items-center justify-between border-b border-zinc-100">
        <button onClick={() => { if (step > 1) setStep(step - 1); else onBack(); }} className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-100 active:scale-90 bg-white shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="font-black text-xl italic uppercase tracking-tighter">VIBE SCANNER</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 flex flex-col relative overflow-hidden">
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-page-in">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="w-full aspect-[4/5] bg-black rounded-[40px] flex flex-col items-center justify-center p-12 text-center shadow-2xl active:scale-[0.98] transition-all group"
            >
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Upload Vibe</h3>
              <p className="text-white/40 mt-3 font-bold text-[10px] uppercase tracking-[0.3em]">Select from your gallery</p>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        )}

        {step === 2 && image && (
          <div className="space-y-8 animate-page-in h-full overflow-y-auto pb-24 scrollbar-hide">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative border border-zinc-100">
              <img src={image} className="w-full h-full object-cover" alt="Source" />
              <button onClick={() => setStep(1)} className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-6">
              <h3 className="font-black text-xl italic uppercase tracking-tighter">SELECT CONTEXT</h3>
              {Object.entries(SITUATIONS).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <button key={item} onClick={() => setSituation(item)} className={`px-5 py-3 rounded-2xl border font-black text-[11px] uppercase transition-all ${situation === item ? 'bg-black text-white shadow-lg scale-105' : 'bg-transparent text-zinc-400 border-zinc-100'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleProcess} disabled={!situation} className="w-full py-6 bg-black text-white font-black text-xl rounded-[28px] shadow-2xl disabled:opacity-20 active:scale-95 transition-all italic">
              START AI ANALYSIS
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12 p-12 bg-white">
            <div className="relative">
              <div className="w-40 h-40 border-[1px] border-zinc-100 rounded-full" />
              <div className="absolute inset-0 w-40 h-40 border-t-2 border-black rounded-full animate-spin" />
              <div className="absolute inset-4 border-[1px] border-dashed border-zinc-200 rounded-full animate-reverse-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl animate-pulse">✨</span>
              </div>
            </div>
            <div className="text-center space-y-6 max-w-xs">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter min-h-[3rem] text-black">{statusText}</h2>
              <div className="w-full h-1 bg-zinc-50 rounded-full overflow-hidden">
                <div className="h-full bg-black animate-progress-glow w-2/3" />
              </div>
              <p className="text-zinc-400 font-bold uppercase text-[9px] tracking-[0.5em] animate-pulse">Neural engine active</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 8s linear infinite;
        }
        @keyframes progress-glow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(150%); }
        }
        .animate-progress-glow {
          animation: progress-glow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default VibeScan;
