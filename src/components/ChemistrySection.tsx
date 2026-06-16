import React, { useState } from "react";
import { ChemistryResult } from "../types";
import { Heart, Sparkles, Scale, Info, CheckCircle2 } from "lucide-react";

interface ChemistrySectionProps {
  defaultUserName: string;
}

export const ChemistrySection: React.FC<ChemistrySectionProps> = ({ defaultUserName }) => {
  const [partnerName, setPartnerName] = useState("");
  const [myName, setMyName] = useState(defaultUserName || "나");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ChemistryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculateChemistry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myName.trim() || !partnerName.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/saju/chemistry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name1: myName, name2: partnerName })
      });

      if (!response.ok) {
        throw new Error("궁합 데이터를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("우주의 에너지를 조율하는 중 연결 지연이 발생했습니다. 다시 시도해 보세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "천생연분": return "text-rose-500 bg-rose-500/10 border-rose-500/30";
      case "구실좋음": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "서로격려": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
      default: return "text-indigo-500 bg-indigo-500/10 border-indigo-500/30";
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Introductory Title card */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent"></div>
        <h2 className="text-base font-bold text-zinc-100 flex items-center justify-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
          <span>인연 궁합 분석기 (緣分)</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          두 사람의 한글 음양 파동 및 타고난 사주오행의 상생(相生) 작용을 해석하여<br />
          서로를 돕는 기운의 비율과 현명한 소통 궁합을 진단합니다.
        </p>
      </div>

      {/* 2. Form Input fields */}
      <form onSubmit={handleCalculateChemistry} className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-4 shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
              본인 이름
            </label>
            <input
              type="text"
              required
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              placeholder="내 이름"
              className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500/80 transition-colors font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
              상대방 이름
            </label>
            <input
              type="text"
              required
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="상대 이름"
              className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500/80 transition-colors font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] cursor-pointer disabled:opacity-40"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>두 사람의 인연오행 분석 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>우주의 끈으로 궁합 보기</span>
            </>
          )}
        </button>
      </form>

      {/* Error state display */}
      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-900 text-rose-400 text-xs text-center rounded-xl animate-pulse">
          {error}
        </div>
      )}

      {/* 3. Calculations Outcome Card visualization */}
      {result && (
        <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 space-y-5 shadow-xl animate-fadeIn">
          {/* Main Score Circe and Grade */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Affinity Index</span>
            
            <div className="relative flex items-center justify-center my-3">
              {/* Score Outer Ring decoration */}
              <div className="w-24 h-24 rounded-full border-4 border-zinc-800 flex items-center justify-center shadow-lg relative">
                {/* Simulated filling based on score */}
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 animate-pulse opacity-20"></div>
                <span className="text-3xl font-extrabold text-zinc-100 font-mono tracking-tighter">
                  {result.score}%
                </span>
              </div>
            </div>

            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${getGradeColor(result.grade)}`}>
              관계 오행 등급 : {result.grade}
            </div>
          </div>

          {/* Key detailed Description */}
          <div className="space-y-2 border-t border-zinc-800 pt-4">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-zinc-400" /> 인연 흐름 해석
            </span>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              {result.description}
            </p>
          </div>

          {/* Strengths bullets */}
          {result.strengths && result.strengths.length > 0 && (
            <div className="space-y-2 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/60">
              <span className="text-xs font-bold text-emerald-400 block">서로 결합 시 일어나는 행운 (Synergie)</span>
              <div className="space-y-1.5">
                {result.strengths.map((str, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conflict Advice */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 mb-1">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>AI 개운 오행 극복 현상비법</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {result.conflictAdvice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
