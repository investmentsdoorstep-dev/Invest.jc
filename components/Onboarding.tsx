
import React, { useState } from 'react';
import { ONBOARDING_QUESTIONS } from '../constants';

interface OnboardingProps {
  onComplete: (answers: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const currentQuestion = ONBOARDING_QUESTIONS[step];

  const handleNext = (updatedAnswers: Record<string, any>) => {
    // 500ms delay: enough to finish the pinch and let the user see their choice
    setTimeout(() => {
      setAnimatingId(null);
      if (step < ONBOARDING_QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        onComplete(updatedAnswers);
      }
    }, 500);
  };

  const selectAnswer = (val: any) => {
    setAnimatingId(String(val));
    const newAnswers = { ...answers, [currentQuestion.id]: val };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const updateSliderValue = (val: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const progress = ((step + 1) / ONBOARDING_QUESTIONS.length) * 100;

  return (
    <div className="h-full flex flex-col p-8 pt-12 bg-white overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-100 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-1000 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div 
        key={step} 
        className="flex-1 flex flex-col space-y-10 animate-page-in"
      >
        <div className="space-y-2">
          <span className="text-zinc-400 font-bold tracking-widest text-[10px] uppercase block opacity-60">
            Step {step + 1} of {ONBOARDING_QUESTIONS.length}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-black tracking-tight">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="flex-1">
          {currentQuestion.type === 'select' && (
            <div className="grid gap-3">
              {currentQuestion.options?.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => selectAnswer(opt)}
                  style={{ animationDelay: `${(i + 1) * 70}ms` }}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all stagger-in relative overflow-hidden ${
                    animatingId === opt ? 'animate-pinch border-black bg-black text-white shadow-2xl z-10' : 
                    answers[currentQuestion.id] === opt 
                      ? 'border-black bg-zinc-50 text-black' 
                      : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-300 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{opt}</span>
                    {animatingId === opt && (
                      <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'slider' && (
            <div className="space-y-12 pt-4 stagger-in">
              <div className="space-y-10">
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  step={currentQuestion.step}
                  value={answers[currentQuestion.id] || currentQuestion.min}
                  onChange={(e) => updateSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between items-end">
                  <div className="text-center">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase">Min</span>
                    <span className="font-bold text-zinc-300">{currentQuestion.min}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-black text-6xl font-black tabular-nums tracking-tighter">
                      {answers[currentQuestion.id] || currentQuestion.min}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase">Max</span>
                    <span className="font-bold text-zinc-300">{currentQuestion.max}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setAnimatingId('slider-confirm');
                  handleNext(answers);
                }}
                className={`w-full py-5 text-white font-black text-lg rounded-2xl shadow-xl transition-all ${
                  animatingId === 'slider-confirm' ? 'animate-pinch bg-zinc-800' : 'bg-black active:scale-[0.95]'
                }`}
              >
                Confirm Selection
              </button>
            </div>
          )}

          {currentQuestion.type === 'toggle' && (
            <div className="space-y-4">
              <button 
                onClick={() => selectAnswer(true)}
                className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between group transition-all stagger-in ${
                  animatingId === 'true' ? 'animate-pinch border-black bg-black text-white' : 'bg-zinc-50 border-zinc-100 active:scale-[0.98]'
                }`}
              >
                <span className={`font-bold text-lg ${animatingId === 'true' ? 'text-white' : 'text-black'}`}>Yes, absolutely</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${animatingId === 'true' ? 'border-white' : 'border-zinc-200'}`}>
                  <div className={`w-3 h-3 rounded-full transition-transform ${animatingId === 'true' ? 'bg-white scale-100' : 'bg-black scale-0'}`} />
                </div>
              </button>
              <button 
                onClick={() => selectAnswer(false)}
                className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between group transition-all stagger-in ${
                  animatingId === 'false' ? 'animate-pinch border-black bg-black text-white' : 'bg-white border-zinc-100 active:scale-[0.98]'
                }`}
              >
                <span className={`font-bold text-lg ${animatingId === 'false' ? 'text-white' : 'text-zinc-400'}`}>Not really</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${animatingId === 'false' ? 'border-white' : 'border-zinc-200'}`}>
                  <div className={`w-3 h-3 rounded-full transition-transform ${animatingId === 'false' ? 'bg-white scale-100' : 'bg-zinc-400 scale-0'}`} />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="py-8 text-center">
        <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest animate-pulse">
          Crafting your persona...
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
