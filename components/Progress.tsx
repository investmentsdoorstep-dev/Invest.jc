
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { VibeResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress: React.FC = () => {
  const [history, setHistory] = useState<VibeResult[]>([]);

  useEffect(() => {
    setHistory(storageService.getHistory().reverse());
  }, []);

  const chartData = history.map(h => ({
    date: new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    score: h.score
  }));

  return (
    <div className="p-6 space-y-8 bg-white text-black min-h-full">
      <header>
        <h1 className="text-3xl font-black">Progress</h1>
        <p className="text-zinc-500">Your aesthetic evolution.</p>
      </header>

      {/* Line Chart */}
      <section className="bg-zinc-50 rounded-[32px] p-6 border border-zinc-100 shadow-sm">
        <h3 className="font-bold text-lg mb-6 text-black">Score History</h3>
        <div className="h-48 w-full">
          {history.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f4f4f5', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#000', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#000" 
                  strokeWidth={3} 
                  dot={{ fill: '#000', r: 4 }} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-30">
              <svg className="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-sm font-bold text-zinc-500">More scans needed for trends</p>
            </div>
          )}
        </div>
      </section>

      {/* Missions */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg text-black">Weekly Missions</h3>
        <div className="space-y-3">
          {[
            { title: 'The Architect', task: 'Get 3 Approved Looks', progress: 1, total: 3 },
            { title: 'Early Riser', task: 'Scan a morning outfit', progress: 0, total: 1 },
            { title: 'Socialite', task: 'Share 2 scorecards', progress: 1, total: 2 }
          ].map((m, idx) => (
            <div key={idx} className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 flex gap-4 items-center shadow-sm">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-inner border border-zinc-100">
                {m.progress === m.total ? '✅' : '🎯'}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-black">{m.title}</h4>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{m.task}</p>
                <div className="w-full h-1 bg-zinc-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-black" style={{ width: `${(m.progress / m.total) * 100}%` }} />
                </div>
              </div>
              <div className="text-zinc-400 font-bold text-xs">{m.progress}/{m.total}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Progress;
