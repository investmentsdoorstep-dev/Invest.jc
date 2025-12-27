
import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile, VibeResult } from './types';
import { storageService } from './services/storageService';
import Onboarding from './components/Onboarding';
import Paywall from './components/Paywall';
import Home from './components/Home';
import VibeScan from './components/VibeScan';
import Progress from './components/Progress';
import Settings from './components/Settings';
import ResultView from './components/ResultView';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [activeResult, setActiveResult] = useState<VibeResult | null>(null);

  useEffect(() => {
    if (!user.onboarded) {
      setCurrentScreen(AppScreen.ONBOARDING);
    }
  }, [user.onboarded]);

  const handleOnboardingComplete = (answers: any) => {
    const updatedUser = { ...user, onboarded: true, onboardingAnswers: answers };
    storageService.setUser(updatedUser);
    setUser(updatedUser);
    setCurrentScreen(AppScreen.PAYWALL);
  };

  const handleSubscription = (success: boolean) => {
    if (success) {
      const updatedUser = { ...user, isPremium: true };
      storageService.setUser(updatedUser);
      setUser(updatedUser);
    }
    setCurrentScreen(AppScreen.HOME);
  };

  const handleScanComplete = (result: VibeResult) => {
    setActiveResult(result);
    setCurrentScreen(AppScreen.RESULT);
    
    const today = new Date().toDateString();
    const updatedUser = { ...user };
    if (updatedUser.lastScanDate === today) {
      updatedUser.dailyScanCount += 1;
    } else {
      updatedUser.lastScanDate = today;
      updatedUser.dailyScanCount = 1;
      updatedUser.streak += 1;
    }
    storageService.setUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen relative flex flex-col max-w-md mx-auto overflow-hidden shadow-2xl border-x border-zinc-100 bg-white">
      <main 
        key={currentScreen} 
        className="flex-1 overflow-y-auto pb-24 animate-page-in bg-white text-black"
      >
        {currentScreen === AppScreen.ONBOARDING && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        {currentScreen === AppScreen.PAYWALL && (
          <Paywall onComplete={() => handleSubscription(false)} onSuccess={() => handleSubscription(true)} />
        )}
        {currentScreen === AppScreen.HOME && (
          <Home user={user} onStartScan={() => setCurrentScreen(AppScreen.SCAN)} onResultSelect={(r) => {
            setActiveResult(r);
            setCurrentScreen(AppScreen.RESULT);
          }} />
        )}
        {currentScreen === AppScreen.SCAN && (
          <VibeScan 
            isPremium={user.isPremium} 
            dailyCount={user.dailyScanCount}
            onComplete={handleScanComplete} 
            onBack={() => setCurrentScreen(AppScreen.HOME)} 
            onPaywall={() => setCurrentScreen(AppScreen.PAYWALL)}
          />
        )}
        {currentScreen === AppScreen.PROGRESS && (
          <Progress />
        )}
        {currentScreen === AppScreen.SETTINGS && (
          <Settings user={user} setUser={setUser} />
        )}
        {currentScreen === AppScreen.RESULT && activeResult && (
          <ResultView result={activeResult} isPremium={user.isPremium} onBack={() => setCurrentScreen(AppScreen.HOME)} />
        )}
      </main>

      {![AppScreen.ONBOARDING, AppScreen.PAYWALL, AppScreen.SCAN].includes(currentScreen) && (
        <BottomNav currentScreen={currentScreen} setScreen={setCurrentScreen} theme={user.theme} />
      )}
    </div>
  );
};

export default App;
