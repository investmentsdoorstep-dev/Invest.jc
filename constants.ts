
import { OnboardingQuestion } from './types';

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  { id: 'style', question: 'How would you describe your primary style?', type: 'select', options: ['Streetwear', 'Classic', 'Minimalist', 'Boho', 'Gorpcore', 'Business'] },
  { id: 'fit_tolerance', question: 'How fitted do you prefer your clothes?', type: 'slider', min: 0, max: 10, step: 1 },
  { id: 'event_freq', question: 'How often do you attend social events?', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
  { id: 'grooming_effort', question: 'Daily time spent on grooming (mins)?', type: 'slider', min: 5, max: 60, step: 5 },
  { id: 'room_vibe', question: 'What is your ideal room aesthetic?', type: 'select', options: ['Minimalist', 'Cozy/Warm', 'High-tech', 'Artistic', 'Dark Academia'] },
  { id: 'lighting_pref', question: 'Preferred lighting environment?', type: 'select', options: ['Natural', 'Warm/Dim', 'Neon/RGB', 'Bright White'] },
  { id: 'confidence', question: 'Your current confidence level in your looks?', type: 'slider', min: 1, max: 10, step: 1 },
  { id: 'goal', question: 'Your main goal with Vibe AI?', type: 'select', options: ['Impress Dates', 'Nail Interviews', 'Look good for social media', 'Self-improvement'] },
  { id: 'climate', question: 'Your typical local climate?', type: 'select', options: ['Cold', 'Moderate', 'Hot', 'Rainy'] },
  { id: 'share_pref', question: 'Do you like sharing your results?', type: 'toggle' },
  { id: 'mirror_check', question: 'How many mirror checks do you do daily?', type: 'slider', min: 1, max: 20, step: 1 },
  { id: 'accessories', question: 'Do you wear accessories often?', type: 'toggle' },
  { id: 'hair_priority', question: 'Hair styling priority?', type: 'slider', min: 1, max: 10 },
  { id: 'footwear', question: 'Favorite footwear type?', type: 'select', options: ['Sneakers', 'Boots', 'Dress Shoes', 'Sandals'] },
  { id: 'social_battery', question: 'Current social battery level?', type: 'slider', min: 1, max: 10 },
  { id: 'brand_loyalty', question: 'Do you stick to specific brands?', type: 'toggle' },
  { id: 'first_impression', question: 'Priority on first impressions?', type: 'slider', min: 1, max: 10 },
  { id: 'organization', question: 'How organized is your space usually?', type: 'slider', min: 1, max: 10 },
  { id: 'color_pref', question: 'Preferred color palette?', type: 'select', options: ['Monochrome', 'Earth Tones', 'Pastels', 'Vibrant'] },
  { id: 'advice_type', question: 'How direct should our advice be?', type: 'select', options: ['Gentle', 'Balanced', 'Brutally Honest'] }
];

export const SITUATIONS = {
  Outfit: ['Clubbing', 'Date', 'Wedding', 'Office', 'Birthday', 'Interview'],
  Room: ['Guest coming', 'Video call', 'Study setup', 'Bedroom vibe'],
  Appearance: ['First impression', 'Professional look', 'Social event']
};

export const BADGES = [
  { id: 'early_adopter', name: 'Early Adopter', icon: '🚀' },
  { id: 'fashionista', name: 'Fashionista', icon: '✨' },
  { id: 'pro_viber', name: 'Pro Viber', icon: '💎' },
  { id: 'streak_3', name: '3-Day Streak', icon: '🔥' }
];
