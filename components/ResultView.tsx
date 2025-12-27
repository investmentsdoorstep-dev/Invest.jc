
import React, { useState, useEffect } from 'react';
import { VibeResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ResultViewProps {
  result: VibeResult;
  isPremium: boolean;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, isPremium, onBack }) => {
  const [showVision, setShowVision] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(result.score), 100);
    return () => clearTimeout(timer);
  }, [result.score]);

  const radarData = [
    { subject: 'Style', A: result.insights.style },
    { subject: 'Light', A: result.insights.lighting },
    { subject: 'Groom', A: result.insights.grooming },
    { subject: 'Conf', A: result.insights.confidence },
    { subject: 'Align', A: result.insights.alignment },
    { subject: 'Clean', A: result.insights.cleanliness },
  ];

  const detailBars = [
    { label: 'Color Harmony', value: result.detailedStats.color_harmony },
    { label: 'Symmetry', value: result.detailedStats.symmetry },
    { label: 'Fit Accuracy', value: result.detailedStats.fit_accuracy },
    { label: 'Texture Quality', value: result.detailedStats.texture_quality },
    { label: 'Composition', value: result.detailedStats.composition },
  ];

  const getVerdictStyle = (v: string) => {
    if (v === 'YES') return 'bg-black text-white';
    if (v === 'RISKY') return 'bg-zinc-200 text-black';
    return 'bg-zinc-100 text-zinc-400';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vibe AI Scorecard',
          text: `My vibe score for ${result.situation} is ${result.score}%! Verdict: ${result.verdict}. Analysis by Vibe AI.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing scorecard:', err);
      }
    } else {
      alert("Sharing is not supported in this browser. Try copying the link to show your friends!");
    }
  };

  return (
    <div className="p-6 space-y-12 pb-12 bg-white transition-colors min-h-full text-black">
      <header className="flex justify-between items-center">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center border active:scale-90 transition-colors shadow-sm bg-white border-zinc-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="font-black text-xs uppercase tracking-[0.4em] text-zinc-300">Official Report</span>
          <span className="font-black text-lg italic tracking-tighter uppercase mt-0.5">VIBE SCORECARD</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Main Score Hero */}
      <div className="relative pt-4 stagger-in">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Increased track visibility with a slightly darker stroke */}
              <circle cx="128" cy="128" r="110" stroke="#f1f1f1" strokeWidth="12" fill="transparent" />
              <circle 
                cx="128" cy="128" r="110" stroke="black" strokeWidth="12" fill="transparent" 
                strokeDasharray={691} strokeDashoffset={691 - (691 * animatedScore) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-9xl font-black italic tracking-tighter leading-none">{animatedScore}</span>
              <div className="w-12 h-0.5 bg-black my-3" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.5em]">Aura Pts</span>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <div className={`px-8 py-2.5 rounded-full font-black text-2xl italic uppercase tracking-widest ${getVerdictStyle(result.verdict)} shadow-xl`}>
              {result.verdict}
            </div>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">{result.situation} CONTEXTUAL ANALYSIS</p>
          </div>
        </div>
      </div>

      {/* Visual Insight Section */}
      <section className="space-y-6 stagger-in" style={{ animationDelay: '100ms' }}>
        <div className="flex justify-between items-end px-2">
          <div className="space-y-1">
            <h3 className="font-black text-2xl italic uppercase tracking-tighter">THE VISION</h3>
            <p className="text-zinc-400 text-[9px] font-bold uppercase tracking-[0.2em]">AI Structural Recommendation</p>
          </div>
          <div className="flex bg-zinc-100 rounded-full p-1 border border-zinc-200 shadow-inner">
            <button 
              onClick={() => setShowVision(false)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${!showVision ? 'bg-black text-white shadow-lg' : 'text-zinc-400'}`}
            >
              AS IS
            </button>
            <button 
              onClick={() => setShowVision(true)}
              disabled={!result.improvedImageUrl}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${showVision ? 'bg-black text-white shadow-lg' : 'text-zinc-400'} disabled:opacity-20`}
            >
              GOAL
            </button>
          </div>
        </div>

        <div className="relative rounded-[48px] overflow-hidden border border-zinc-100 shadow-2xl aspect-[4/5] bg-zinc-50 group">
          <img 
            src={showVision ? result.improvedImageUrl : result.imageUrl} 
            className="w-full h-full object-cover transition-all duration-700" 
            alt="Comparison" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-2xl">
            <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-3">Architect's Fix</h4>
            <p className="text-white text-lg font-bold italic leading-tight select-none">"{result.fix_tip}"</p>
          </div>
          {showVision && (
            <div className="absolute top-8 left-8 bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl animate-pulse">
              Manifested
            </div>
          )}
        </div>
      </section>

      {/* Metrics Dashboard */}
      <section className="rounded-[48px] p-10 border border-zinc-100 shadow-sm space-y-8 stagger-in bg-white" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white text-xl">📊</div>
          <h3 className="font-black text-2xl italic uppercase tracking-tighter">METRIC SPECS</h3>
        </div>
        <div className="grid gap-6">
          {detailBars.map((bar, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="text-zinc-500">{bar.label}</span>
                <span className="text-black">{bar.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-1000 ease-out" 
                  style={{ width: `${bar.value}%`, transitionDelay: `${idx * 80}ms` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Aesthetic Radar */}
      <section className="rounded-[48px] p-10 border border-zinc-100 shadow-sm stagger-in bg-white" style={{ animationDelay: '300ms' }}>
        <h3 className="font-black text-2xl italic uppercase tracking-tighter mb-8">AESTHETIC DNA</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="black" strokeOpacity={0.05} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10, fontWeight: '900', letterSpacing: '0.15em' }} />
              <Radar name="Score" dataKey="A" stroke="black" strokeWidth={3} fill="black" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Functional Share Button */}
      <div className="flex justify-center px-4 pb-12 stagger-in" style={{ animationDelay: '400ms' }}>
        <button 
          onClick={handleShare}
          className="w-full max-w-sm py-6 bg-black text-white font-black text-xl italic uppercase rounded-full shadow-2xl active:scale-95 transition-all transform hover:translate-y-[-2px]"
        >
          Share Report
        </button>
      </div>
    </div>
  );
};

export default ResultView;
