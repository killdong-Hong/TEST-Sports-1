import React from "react";
import { SajuAnalysis } from "../types";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, AlertTriangle, HelpCircle, Calendar, Sparkles } from "lucide-react";

interface InsightsSectionProps {
  sajuData: SajuAnalysis;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ sajuData }) => {
  const { birthInfo, fortunes, personality } = sajuData;

  // Generate deterministic monthly index data for Recharts based on user details
  const seed = birthInfo.birthDate.split("-").reduce((acc, val) => acc + parseInt(val, 10), 0);
  
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const wealthSin = Math.sin((seed + month) * 0.5);
    const careerCos = Math.cos((seed - month) * 0.6);
    const loveSin = Math.sin((seed * 2 + month * 1.5));

    return {
      name: `${month}월`,
      "재물운 (Wealth)": Math.round(((wealthSin + 1) / 2) * 40 + 60), // index between 60 & 100
      "성공·직업운 (Career)": Math.round(((careerCos + 1) / 2) * 35 + 63), // index between 63 & 98
      "연애·애정운 (Love)": Math.round(((loveSin + 1) / 2) * 30 + 68) // index between 68 & 98
    };
  });

  // Calculate year 2026 celestial transition overview
  const yearOverview = "2026년은 병오년(丙午年)으로, '붉은 말'의 해입니다. 하늘과 땅에 이글거리는 거대한 불(火)의 기운이 지배적이므로 비즈니스 도약과 과감한 시동을 하기에 아주 유리하지만, 불길이 지나치게 강해질 수 있으니 사주 내 수(水)와 토(土)의 냉정하고 차분한 조율 기운이 필수적으로 필요합니다.";
  
  // Specific days list (吉日)
  const auspiciousDays = [
    { day: "6월 18일", category: "문서 및 계약 (득재)", desc: "오행 상 합(合)이 들어와 부동산, 이사, 문서 양도 계약을 하기에 최적의 기운입니다." },
    { day: "7월 05일", category: "귀인 상면 (인연)", desc: "천을귀인 수호가 맴도는 날로, 소원한 친구를 화해시키거나 중요한 비즈니스 미팅에 길합니다." },
    { day: "7월 22일", category: "재물 투자 기점 (금전)", desc: "식신생재(食神生財)의 물고가 트여, 소소한 재물 투자를 시작하거나 예금을 개설하기에 유리합니다." },
    { day: "8월 14일", category: "건강 활력 회복 (안식)", desc: "해묵은 피로와 탁기를 방출하고 가벼운 휴식을 가질 때 명주 순환이 최고조에 달합니다." }
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Yearly Core Celestial review */}
      <div className="relative overflow-hidden p-5 rounded-2xl border border-amber-500/10 bg-zinc-900/30">
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl"></div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 uppercase tracking-widest font-mono mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>병오년(丙午年) 2026년 총운 일람</span>
        </div>
        <h3 className="text-sm font-bold text-zinc-200">
          태양의 도약을 앞둔 {birthInfo.name}님의 대운 주기
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed mt-2 font-normal">
          {yearOverview}
        </p>
      </div>

      {/* 2. Monthly dynamic line charts */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-4">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-zinc-300">
            월별 운세 순환 지수 그래프
          </h3>
          <span className="text-[10px] text-zinc-500 block">계절과 달의 흐름에 따른 기운 지수 변동성 (0~100)</span>
        </div>

        {/* Recharts LineChart */}
        <div className="h-56 w-full p-1 bg-black/40 rounded-xl border border-zinc-950/80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 15, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: "#71717a", fontSize: 11 }} 
                axisLine={{ stroke: "#27272a" }} 
              />
              <YAxis 
                domain={[50, 100]} 
                tick={{ fill: "#71717a", fontSize: 10 }} 
                axisLine={{ stroke: "#27272a" }} 
                tickLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "10px" }}
                itemStyle={{ fontSize: "11px" }}
                labelStyle={{ fontSize: "11px", fontWeight: "bold", color: "#a1a1aa" }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "10px", marginTop: "5px" }} 
                verticalAlign="bottom" 
                height={32}
              />
              <Line 
                type="monotone" 
                dataKey="재물운 (Wealth)" 
                stroke="#f59e0b" 
                strokeWidth={2.5} 
                dot={{ r: 3, stroke: "#f59e0b", strokeWidth: 1 }} 
              />
              <Line 
                type="monotone" 
                dataKey="성공·직업운 (Career)" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
              />
              <Line 
                type="monotone" 
                dataKey="연애·애정운 (Love)" 
                stroke="#f43f5e" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Auspicious Days look-ahead */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase ml-1 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <span>향후 가장 좋은 대길일(大吉日) 예보</span>
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {auspiciousDays.map((day, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-900/20 flex justify-between items-start gap-4">
              <div className="flex-shrink-0 text-center bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex flex-col justify-center">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-500">{day.day}</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">길조</span>
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-200">{day.category}</span>
                  <span className="text-[9px] font-semibold text-emerald-400">대길</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                  {day.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
