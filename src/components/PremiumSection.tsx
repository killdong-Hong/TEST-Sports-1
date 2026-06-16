import React, { useState } from "react";
import { Sparkles, Check, Download, ShieldCheck, Ticket, CalendarDays } from "lucide-react";

export const PremiumSection: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [purchaseType, setPurchaseType] = useState<string | null>(null); // "subscription" | "single"
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMockPay = (type: "subscription" | "single") => {
    setPurchaseType(type);
    setIsModalOpen(true);
  };

  const confirmMockPay = () => {
    setIsModalOpen(false);
    if (purchaseType === "subscription") {
      setIsSubscribed(true);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-[#1b1712] via-[#211b13] to-[#12110e] text-center shadow-xl flex flex-col items-center">
        {/* Mystic background glowing nodes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-yellow-500 via-amber-600 to-transparent"></div>

        <div className="p-2 bg-yellow-500/10 rounded-full border border-yellow-500/30 mb-3 animate-pulse">
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>

        <h2 className="text-lg font-extrabold text-zinc-100 tracking-tight leading-snug">
          인생의 행운을 설계하는 최강의 도구
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mt-1.5 leading-relaxed font-normal">
          AI 명리 코칭 패스로 모든 사주 장벽을 허물고,<br />
          더 날카롭고 깊이 있는 대운 분석 리포트를 무제한으로 열람하십시오.
        </p>

        {isSubscribed && (
          <div className="mt-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full text-xs font-bold">
            ✓ Premium AI 코치 패스 사용 중
          </div>
        )}
      </div>

      {/* Main pricing card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Premium AI Coach Pass */}
        <div className="p-5 rounded-2xl border border-yellow-500/20 bg-zinc-900/40 backdrop-blur-sm space-y-4 relative flex flex-col justify-between">
          <div className="absolute top-3 right-3 bg-yellow-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wide">
            BEST VALUE
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-amber-500/90 font-mono tracking-widest uppercase block">Monthly Subscription</span>
            <h3 className="text-base font-bold text-zinc-200">AI 코치 무제한 패스</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-yellow-500">9,900원</span>
              <span className="text-xs text-zinc-500">/ 월 (구독형)</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 font-normal">
              세 명의 특화 사주 전문가(현우, 지수, 도윤)와의 제한 없는 질문과 50장 분량의 심층 연간 사주 진단서 출력이 모두 포함된 합리적 패키지입니다.
            </p>
          </div>

          <div className="border-t border-zinc-800/60 pt-3.5 space-y-2">
            {[
              "특화 AI 사주 코치 3인 무제한 대화권",
              "50페이지 상당 종합 PDF 총운 리포트 다운로드",
              "길일/흉일 푸시 및 캘린더 세부 연동권",
              "궁합 횟수 제한 완전 해제"
            ].map((feat, i) => (
              <div key={i} className="flex gap-2 items-center text-xs text-zinc-300">
                <Check className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            {isSubscribed ? (
              <button 
                type="button"
                disabled
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-400 py-2 rounded-xl text-xs font-semibold"
              >
                현재 이용 중인 패스
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleMockPay("subscription")}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-2 rounded-xl text-xs sm:text-sm tracking-wide transition-transform hover:scale-[1.01] cursor-pointer shadow-md"
              >
                코칭 패스 구독하기
              </button>
            )}
          </div>
        </div>

        {/* Single purchase option */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Single Purchase</span>
            <h3 className="text-base font-bold text-zinc-200">연간 상세 리포트 구매</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-zinc-300">3,900원</span>
              <span className="text-xs text-zinc-500">/ 1회 대행</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 font-normal">
              구독이 망설여지신다면, 나의 태어난 시간에 최적화된 2026 연간 비전과 월별 상승주기 진단 PDF 리포트 한 부만 즉시 결제하여 받아보세요.
            </p>
          </div>

          <div className="border-t border-zinc-800/60 pt-3.5 space-y-2">
            {[
              "2026년 월별 상세 12개월 운세 지표",
              "나에게 어울리는 사주 직업/진로 3선 리서치",
              "평생 주택 구입 및 이사운 세부 적기 분석",
              "동양 명리학 기치(氣恥) 완벽 해설집 포함"
            ].map((feat, i) => (
              <div key={i} className="flex gap-2 items-center text-xs text-zinc-400">
                <Check className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => handleMockPay("single")}
              className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-semibold py-2 rounded-xl text-xs sm:text-sm tracking-wide transition-colors cursor-pointer"
            >
              단건 리포트 구매하기
            </button>
          </div>
        </div>
      </div>

      {/* PDF Download section for active premium/purchased users */}
      <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 flex gap-4 items-center">
        <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
          <Download className="w-6 h-6 text-amber-500" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-zinc-200">PDF 상세 총운 리포트 다운로드</h4>
          <p className="text-[10px] sm:text-xs text-zinc-500 leading-normal mt-0.5">
            {isSubscribed 
              ? "Premium 권한이 확인되었습니다. 지금 모바일 다운로드를 시작하세요." 
              : "패스를 구독하시면 PDF를 무제한으로 인쇄 및 저장할 수 있습니다."}
          </p>
        </div>
        <button
          type="button"
          disabled={!isSubscribed}
          onClick={() => alert("사주 상세 처방 PDF가 성공적으로 조율되어 로컬 다운로드 폴더에 저장되었습니다.")}
          className="px-3.5 py-1.5 bg-zinc-800 border border-zinc-700 hover:border-amber-500/40 text-zinc-200 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          로딩하기
        </button>
      </div>

      {/* Security note */}
      <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
        구독 결제는 Google과 Kakao 공식 카드 API 암호화를 통해 전송 관리되며,<br />
        결제 시 사주 기운의 해지가 보장되는 안전 신뢰형 환불 조건이 적용됩니다.
      </p>

      {/* Mock Billing payment gateway modal popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 rounded-3xl border border-yellow-500/30 bg-[#161513] space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-yellow-500" />
                <span>AI 사주 코치 모의 결제대행</span>
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-zinc-300 text-xs sm:text-sm">
              <p>구매 항목: <span className="font-bold text-amber-500">{purchaseType === "subscription" ? "AI 코치 무제한 연간 요금제" : "상세 사주 리포트 (단건)"}</span></p>
              <p>결제 금액: <span className="font-bold text-yellow-500">{purchaseType === "subscription" ? "9,900원" : "3,900원"}</span></p>
              <p className="text-[11px] text-zinc-500 leading-normal font-normal">
                본 모드는 AI Studio 시연 및 UI 체험을 위한 안전한 모의 결제입니다. 실제 신용카드로 청구되지 않습니다.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={confirmMockPay}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                동양 신용카드 모의 결제 승인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
