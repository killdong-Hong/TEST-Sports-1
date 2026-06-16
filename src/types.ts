export interface SajuPillar {
  stem: string;  // e.g. "갑"
  branch: string; // e.g. "자"
  stemHanja: string; // e.g. "甲"
  branchHanja: string; // e.g. "子"
  element: string; // e.g. "목", "화", "토", "금", "수"
}

export interface SajuAnalysis {
  birthInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    isLunar: boolean;
    gender: 'M' | 'F';
  };
  pillars: {
    year: SajuPillar;
    month: SajuPillar;
    day: SajuPillar;
    hour: SajuPillar;
  };
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dailyFortune: string;
  personality: {
    title: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  };
  fortunes: {
    wealth: { score: number; description: string };
    career: { score: number; description: string };
    love: { score: number; description: string };
    health: { score: number; description: string };
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export interface SajuCoach {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  greetings: string;
}

export interface ChemistryResult {
  user1Name: string;
  user2Name: string;
  score: number;
  grade: '천생연분' | '구실좋음' | '서로격려' | '주의필요' | '상극관계';
  description: string;
  strengths: string[];
  conflictAdvice: string;
}
