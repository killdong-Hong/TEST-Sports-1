import React from "react";
import { SajuAnalysis } from "../types";
import { Sparkles, Calendar, Compass, Palette, Hash, TrendingUp, Heart, Briefcase, Activity } from "lucide-react";

interface HomeSectionProps {
  sajuData: SajuAnalysis;
  onNavigate: (tab: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ sajuData, onNavigate }) => {
  const { birthInfo, dailyFortune, fortunes, personality } = sajuData;

  // Derive lucky items deterministically based on Saju day stem
  const getLuckyThings = (stem: string) => {
    switch (stem) {
      case "갑": case "을":
        return { color: "에메랄드 녹색, 청연색", number: "3, 8", direction: "동쪽 (East)" };
      case "병": case "정":
        return { color: "주홍색, 루비 적색", number: "2, 7", direction: "남쪽 (South)" };
      case "무": case "기":
        return { color: "골드 황색, 토파즈색", number: "5, 10", direction: "중앙 (Center)" };
      case "경": case "신":
        return { color: "플래티넘 백색, 실버", number: "4, 9", direction: "서쪽 (West)" };
      default: // 임, 계
        return { color: "차콜 흑색, 네이비", number: "1, 6", direction: "북쪽 (North)" };
    }
  };

  const lucky = getLuckyThings(sajuData.pillars.day.stem);

  return (
    <div className="space-y-6">
      {/* Header Profile Summary bar */}
      <div className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md flex justify-between items-center">
        <div>
          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">Premium Saju Path</span>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-1.5 mt-0.5">
            {birthInfo.name} <span className="text-zinc-500 text-sm font-normal">님의 오늘의 기운</span>
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {birthInfo.birthDate} ({birthInfo.isLunar ? "음력" : "양력"})
            </span>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/30 text-center">
          <span className="text-xs font-semibold text-amber-400 font-mono">
            {personality.title.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Main Fortune Card */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-[#161512] to-zinc-900 shadow-2xl">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>오늘의 대운 메시지</span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-zinc-100 leading-snug">
          "{personality.title}"
        </h1>

        <div className="my-4 p-4 rounded-xl bg-black/60 border border-zinc-800/80 leading-relaxed text-zinc-300 text-sm md:text-base italic">
          {dailyFortune}
        </div>

        <div className="text-xs text-zinc-500 flex items-center justify-between">
          <span>명리학 가이드: 오행의 흐름을 수놓음</span>
          <span className="font-mono text-amber-500/80">AI Saju Advisory</span>
        </div>
      </div>

      {/* Today's Lucky Items Grid */}
      <div>
        <h3 className="text-sm font-medium text-zinc-400 mb-3 ml-1 flex items-center gap-1.5">
          <span>오늘의 개운(開運) 아이템</span>
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/20 text-center">
            <div className="flex justify-center mb-1">
              <Palette className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-500 block">행운의 색상</span>
            <span className="text-xs font-medium text-zinc-200 mt-0.5 block truncate">{lucky.color}</span>
          </div>

          <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/20 text-center">
            <div className="flex justify-center mb-1">
              <Hash className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-zinc-500 block">수리 행운</span>
            <span className="text-xs font-medium text-zinc-200 mt-0.5 block">{lucky.number}</span>
          </div>

          <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/20 text-center">
            <div className="flex justify-center mb-1">
              <Compass className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[10px] text-zinc-500 block">길한 방향</span>
            <span className="text-xs font-medium text-zinc-200 mt-0.5 block truncate">{lucky.direction}</span>
          </div>
        </div>
      </div>

      {/* Mini Fortune Index Glance */}
      <div>
        <div className="flex justify-between items-center mb-3 ml-1">
          <h3 className="text-sm font-medium text-zinc-400">네 가지 기운의 운세 지수</h3>
          <button 
            type="button"
            onClick={() => onNavigate("insights")}
            className="text-xs text-amber-500 hover:underline flex items-center gap-0.5"
          >
            <span>상세 그래프</span>
            <TrendingUp className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/30 flex gap-3 items-center">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">재물운</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-zinc-200">{fortunes.wealth.score}</span>
                <span className="text-[10px] text-zinc-600">/ 100</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/30 flex gap-3 items-center">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">직업/학업운</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-zinc-200">{fortunes.career.score}</span>
                <span className="text-[10px] text-zinc-600">/ 100</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/30 flex gap-3 items-center">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">연애/궁합운</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-zinc-200">{fortunes.love.score}</span>
                <span className="text-[10px] text-zinc-600">/ 100</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/30 flex gap-3 items-center">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">건강운</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-zinc-200">{fortunes.health.score}</span>
                <span className="text-[10px] text-zinc-600">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick CTA Banner */}
      <div 
        onClick={() => onNavigate("chat")}
        className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center cursor-pointer hover:bg-amber-500/15 transition-colors"
      >
        <span className="text-xs text-amber-400 font-medium tracking-wide">
          지금 내 사주를 가장 잘 아는 전문 AI 코치와 대화 해보세요 ➔
        </span>
      </div>
    </div>
  );
};
