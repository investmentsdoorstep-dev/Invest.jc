
import React, { useState, useEffect } from 'react';
import { UserProfile, VibeResult } from '../types';
import { storageService } from '../services/storageService';
import { BADGES } from '../constants';

interface HomeProps {
  user: UserProfile;
  onStartScan: () => void;
  onResultSelect: (result: VibeResult) => void;
}

const Home: React.FC<HomeProps> = ({ user, onStartScan, onResultSelect }) => {
  const [history, setHistory] = useState<VibeResult[]>([]);

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  return (
    <div className="p-6 space-y-8 bg-white">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black">Your Vibe</h1>
          <p className="text-zinc-500">Keep the streak alive!</p>
        </div>
        <div className="flex flex-col items-center bg-zinc-50 rounded-2xl p-3 border border-zinc-100 min-w-[80px]">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-lg text-black">{user.streak}</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Streak</span>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black rounded-3xl p-5 shadow-xl">
          <p className="text-white/60 text-sm font-medium">Weekly Scans</p>
          <p className="text-3xl font-bold mt-1 text-white">{history.length}</p>
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-2/3" />
          </div>
        </div>
        <div className="bg-zinc-50 rounded-3xl p-5 border border-zinc-100">
          <p className="text-zinc-400 text-sm font-medium">Avg Score</p>
          <p className="text-3xl font-bold mt-1 text-black">
            {history.length > 0 
              ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) 
              : '--'}
          </p>
          <p className="text-xs text-green-600 mt-2 font-semibold">↑ 12% from last week</p>
        </div>
      </div>

      {/* Badges */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-black">My Collection</h3>
          <button className="text-indigo-600 text-sm font-semibold">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {BADGES.map(badge => (
            <div key={badge.id} className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${user.badges.includes(badge.id) ? 'bg-white border-indigo-200' : 'bg-zinc-50 border-zinc-100 grayscale opacity-50'}`}>
              <span className="text-3xl">{badge.icon}</span>
              <span className="text-[10px] font-bold text-zinc-500 text-center w-16 leading-tight uppercase">{badge.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-black">Recent Scans</h3>
        </div>
        {history.length === 0 ? (
          <div className="bg-zinc-50 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-zinc-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">📸</div>
            <p className="text-zinc-500 font-medium">No scans yet. Level up your vibe today!</p>
            <button onClick={onStartScan} className="bg-black text-white px-6 py-2 rounded-full font-bold">Start First Scan</button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map(item => (
              <div 
                key={item.id} 
                onClick={() => onResultSelect(item)}
                className="bg-white hover:bg-zinc-50 rounded-2xl p-4 flex items-center gap-4 border border-zinc-100 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100">
                  <img src={item.imageUrl} alt="Scan" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-black">{item.situation}</h4>
                  <p className="text-xs text-zinc-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.score >= 80 ? 'bg-green-100 text-green-700' : item.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {item.score}%
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
