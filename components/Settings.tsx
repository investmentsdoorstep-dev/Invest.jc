
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { storageService } from '../services/storageService';

interface SettingsProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
  const [isPinching, setIsPinching] = useState(false);

  const togglePremium = () => {
    const updated = { ...user, isPremium: !user.isPremium };
    storageService.setUser(updated);
    setUser(updated);
  };

  const toggleNotifications = () => {
    setIsPinching(true);
    const updated = { ...user, notificationsEnabled: !user.notificationsEnabled };
    storageService.setUser(updated);
    setUser(updated);
    setTimeout(() => setIsPinching(false), 300);
  };

  const resetProgress = () => {
    if (confirm('Are you sure? This will delete all scan history.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-8 bg-white text-black min-h-full">
      <header>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Settings</h1>
      </header>

      {/* Profile Card */}
      <div className="rounded-[32px] p-6 border flex items-center gap-4 shadow-sm bg-zinc-50 border-zinc-100">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black italic shadow-inner bg-black text-white">
          {user.isPremium ? '💎' : '👤'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">Vibe Architect</h3>
          <p className="text-zinc-500 text-sm">Level 12 • {user.streak} day streak</p>
        </div>
        {user.isPremium && (
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase italic bg-black text-white">PRO</span>
        )}
      </div>

      {/* Account Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-4">Account</h4>
        <div className="rounded-[32px] overflow-hidden border shadow-sm bg-white border-zinc-100">
          <button onClick={togglePremium} className="w-full p-6 flex justify-between items-center border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
            <span className="font-bold">Subscription Status</span>
            <span className={user.isPremium ? 'font-bold underline text-indigo-400' : 'text-zinc-400'}>{user.isPremium ? 'Premium Active' : 'Free Tier'}</span>
          </button>
          
          <button 
            onClick={toggleNotifications}
            className={`w-full p-6 flex justify-between items-center transition-all ${isPinching ? 'animate-pinch' : ''} hover:bg-zinc-50`}
          >
            <span className="font-bold">Notifications</span>
            <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${user.notificationsEnabled ? 'bg-black' : 'bg-zinc-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${user.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-4">Security</h4>
        <div className="rounded-[32px] overflow-hidden border shadow-sm bg-white border-zinc-100">
          <button onClick={resetProgress} className="w-full p-6 flex justify-between items-center text-red-500 hover:bg-red-50 transition-colors">
            <span className="font-bold">Reset All Data</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Vibe AI v2.6.0</p>
        <p className="text-[10px] text-zinc-300 mt-1 uppercase">Powered by Gemini 3 Flash</p>
      </div>
    </div>
  );
};

export default Settings;
