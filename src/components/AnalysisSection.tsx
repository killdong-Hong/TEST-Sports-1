import React from "react";
import { SajuAnalysis } from "../types";
import { SajuPillarCard } from "./SajuPillarCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { ShieldAlert, CheckCircle, Scale, DollarSign, Briefcase, Heart, Flame } from "lucide-react";

interface AnalysisSectionProps {
  sajuData: SajuAnalysis;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ sajuData }) => {
  const { pillars, fiveElements, personality, fortunes } = sajuData;

  // Format five elements data for Recharts
  const chartData = [
    { name: "목 (Wood)", value: fiveElements.wood, color: "#10b981", desc: "시작과 성장, 에너지" },
    { name: "화 (Fire)", value: fiveElements.fire, color: "#f43f5e", desc: "열정, 사회성, 표현력" },
    { name: "토 (Earth)", value: fiveElements.earth, color: "#f59e0b", desc: "신의, 신용, 중재 조화" },
    { name: "금 (Metal)", value: fiveElements.metal, color: "#a1a1aa", desc: "결단력, 의리, 정교함" },
    { name: "수 (Water)", value: fiveElements.water, color: "#4f46e5", desc: "지혜, 유연성, 침투력" },
  ];

  // Find dominant and deficient elements
  const sortedElements = [...chartData].sort((a, b) => b.value - a.value);
  const dominant = sortedElements[0];
  const deficient = [...chartData].sort((a, b) => a.value - b.value)[0];

  // Custom Saju prescription based on deficient element
  const getPrescription = (elementName: string) => {
    if (elementName.includes("목")) {
      return "아침에 걷거나 초록 식물을 방에 많이 가꾸세요. 푸른 계열의 의복을 입으면 학업과 새로운 시작의 운이 열릴 수 있습니다.";
    } else if (elementName.includes("화")) {
      return "따뜻한 음식을 주로 섭취하며, 햇볕을 자주 쬐어 체내 양기를 보충하십시오. 붉은 소품이 열정과 관계운을 북돋아 줍니다.";
    } else if (elementName.includes("토")) {
      return "일상에서 대지의 흙길을 걸어보고(황톳길 등 브라운 계통 등산), 노란색/골드 소품이 정서적 안정감과 재물운 상생에 유리합니다.";
    } else if (elementName.includes("금")) {
      return "가위나 거울, 정밀 기계를 깨끗하고 날카롭게 관리하십시오. 흰색/메탈 의복이나 금속 시계가 이성적인 결단력을 지탱해 줍니다.";
    } else {
      return "수분이 가득한 음식을 충분히 드시고, 호수나 가벼운 반신욕을 즐기십시오. 차분한 네이비/블랙 계열 디자인 소품이 지혜를 부릅니다.";
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Four Pillars of Destiny Section */}
      <div>
        <h3 className="text-sm font-semibold tracking-wider text-amber-500 uppercase font-mono mb-3 ml-1">
          사주 팔자 (四柱 八字)
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <SajuPillarCard label="년주 (조상/정체성)" pillar={pillars.year} />
          <SajuPillarCard label="월주 (부모/사회)" pillar={pillars.month} />
          <SajuPillarCard label="일주 (나/배우자)" pillar={pillars.day} />
          <SajuPillarCard label="시주 (자식/미래)" pillar={pillars.hour} />
        </div>
      </div>

      {/* 2. Five Elements Visualization */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30">
        <h3 className="text-sm font-semibold tracking-wider text-zinc-300 uppercase mb-4 flex items-center justify-between">
          <span>오행(五行) 분포 비율</span>
          <span className="text-[10px] text-zinc-500 font-normal">전체 비중 (기초 8자 기준)</span>
        </h3>

        {/* Dynamic Graph */}
        <div className="h-44 w-full bg-black/40 rounded-xl p-2 border border-zinc-900 flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: -15, right: 10, top: 5, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "500" }} 
                width={85} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs shadow-xl">
                        <p className="font-bold" style={{ color: data.color }}>{data.name}</p>
                        <p className="text-zinc-300 mt-0.5">점유율: {data.value}%</p>
                        <p className="text-zinc-500 text-[10px]">{data.desc}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Elements Diagnostics */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
            <span className="text-[10px] text-zinc-500 block">가장 강한 기운 (과다)</span>
            <span className="text-xs font-semibold text-zinc-200 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dominant.color }}></span>
              {dominant.name} ({dominant.value}%)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
            <span className="text-[10px] text-zinc-500 block">가장 필요한 기운 (조율)</span>
            <span className="text-xs font-semibold text-zinc-200 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: deficient.color }}></span>
              {deficient.name} ({deficient.value}%)
            </span>
          </div>
        </div>

        {/* Saju Advice Prescription */}
        <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 mb-1">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>AI 개운(開運) 오행 보완 처방전</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {getPrescription(deficient.name)}
          </p>
        </div>
      </div>

      {/* 3. Detailed Personality Analysis */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-4">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">Core Instinct</span>
          <h4 className="text-base font-bold text-zinc-200 mt-0.5">{personality.title}</h4>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2">{personality.description}</p>
        </div>

        <div className="border-t border-zinc-800/60 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mb-2">
                <CheckCircle className="w-3.5 h-3.5" /> 장점 (Strengths)
              </span>
              <ul className="space-y-1 text-xs text-zinc-400">
                {personality.strengths.map((st, i) => (
                  <li key={i} className="flex gap-1.5 items-start">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" /> 극복해야 할 약점 (Weaknesses)
              </span>
              <ul className="space-y-1 text-xs text-zinc-400">
                {personality.weaknesses.map((we, i) => (
                  <li key={i} className="flex gap-1.5 items-start">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{we}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Saju Fortunes Categories Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase ml-1">
          인생 4대 분야 집중 진단
        </h3>

        {[
          { key: "wealth", label: "평생 재물운 (Wealth)", icon: DollarSign, color: "text-amber-500 bg-amber-500/10", data: fortunes.wealth },
          { key: "career", label: "직장 및 사회적 성취운 (Career)", icon: Briefcase, color: "text-emerald-500 bg-emerald-500/10", data: fortunes.career },
          { key: "love", label: "연인/부부 애정 및 기운 조화 (Love)", icon: Heart, color: "text-rose-500 bg-rose-500/10", data: fortunes.love },
          { key: "health", label: "신해 건강 기운 (Health)", icon: Flame, color: "text-indigo-500 bg-indigo-500/10", data: fortunes.health },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/30 flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`p-2.5 rounded-xl ${item.color} border border-white/5`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[9px] text-zinc-600 font-mono uppercase block">index</span>
                  <span className="text-base font-extrabold text-zinc-300 font-mono leading-none">{item.data.score}</span>
                </div>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-200">{item.label}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Detailed Analysis</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.data.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
