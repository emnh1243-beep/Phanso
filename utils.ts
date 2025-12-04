import { Achievement } from './types';

export const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export const playSound = (type: 'correct' | 'wrong') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const readNumber = (num: number): string | number => {
  const map: Record<number, string> = {
    1: 'Một', 2: 'Hai', 3: 'Ba', 4: 'Bốn', 5: 'Năm', 
    6: 'Sáu', 7: 'Bảy', 8: 'Tám', 9: 'Chín', 10: 'Mười', 
    11: 'Mười một', 12: 'Mười hai'
  };
  return map[num] || num;
};

// --- Storage Utils ---

const STORAGE_KEY = 'robiki_achievements';

export const saveAchievement = (data: Omit<Achievement, 'id' | 'date'>) => {
  try {
    const currentData = getAchievements();
    const newAchievement: Achievement = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5), // Ensure unique ID
      date: new Date().toISOString()
    };
    
    // Append new achievement to the list without limit (newest first)
    // User requested not to automatically delete items, so we removed .slice()
    const updatedData = [newAchievement, ...currentData];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    return newAchievement;
  } catch (e) {
    console.error("Failed to save achievement", e);
    return null;
  }
};

export const getAchievements = (): Achievement[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const clearAchievements = () => {
  localStorage.removeItem(STORAGE_KEY);
};