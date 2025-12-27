
import React from 'react';
import { AppScreen, AppTheme } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  theme: AppTheme;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setScreen, theme }) => {
  // Navigation is now strictly styled for a white background
  
  const navItems = [
    { screen: AppScreen.HOME, label: 'Home', icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-black' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { screen: AppScreen.SCAN, label: 'Scan', isFab: true },
    { screen: AppScreen.PROGRESS, label: 'Progress', icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-black' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { screen: AppScreen.SETTINGS, label: 'Settings', icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-black' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )}
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t px-6 py-4 flex items-center justify-between z-50 transition-colors bg-white/80 border-zinc-100 backdrop-blur-xl">
      {navItems.map((item, idx) => {
        if (item.isFab) {
          return (
            <button
              key={idx}
              onClick={() => setScreen(item.screen)}
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center -mt-10 border-4 transition-transform active:scale-90 bg-black text-white border-white"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          );
        }

        const isActive = currentScreen === item.screen;
        return (
          <button
            key={idx}
            onClick={() => setScreen(item.screen)}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            {item.icon!(isActive)}
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-black' : 'text-zinc-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
