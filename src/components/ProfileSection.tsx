import React, { useState } from "react";
import { SajuAnalysis } from "../types";
import { User, Calendar, Clock, RotateCcw, AlertCircle, History, Shield, Sliders } from "lucide-react";

interface ProfileSectionProps {
  sajuData: SajuAnalysis | null;
  onUpdateProfile: (name: string, date: string, time: string, isLunar: boolean, gender: "M" | "F") => void;
  onClearData: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ sajuData, onUpdateProfile, onClearData }) => {
  const [name, setName] = useState(sajuData?.birthInfo?.name || "홍길동");
  const [birthDate, setBirthDate] = useState(sajuData?.birthInfo?.birthDate || "1995-05-15");
  const [birthTime, setBirthTime] = useState(sajuData?.birthInfo?.birthTime || "12:00");
  const [isLunar, setIsLunar] = useState(sajuData?.birthInfo?.isLunar || false);
  const [gender, setGender] = useState<"M" | "F">(sajuData?.birthInfo?.gender || "M");
  
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Mock consulting histories
  const [historyItems, setHistoryItems] = useState([
    { id: 1, date: "2026-06-15", type: "재물운 상담", summary: "현우 코치와의 평생 돈 낭비 개벽 비결 상담" },
    { id: 2, date: "2026-06-14", type: "궁합 분석", summary: "나와 파트너 간의 오행 오행 상생 관계 92% 점쳐짐" },
    { id: 3, date: "2026-06-12", type: "대운 처방", summary: "병오년 나에게 필요한 물(水)의 개운 보완 처방전 접수" }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, birthDate, birthTime, isLunar, gender);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const clearHistory = () => {
    if (confirm("상담 이력 및 저장된 가치를 영구 소거하시겠습니까?")) {
      setHistoryItems([]);
      onClearData();
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Birth Information Form */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 mb-4">
          <User className="w-4 h-4 text-amber-500" />
          <span>내 명주(命柱) 정보 설정</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">이름</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500/80 transition-colors font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">성별</label>
              <div className="grid grid-cols-2 gap-1.5 p-0.5 bg-black/40 border border-zinc-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGender("M")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    gender === "M" ? "bg-amber-500 text-black" : "text-zinc-400"
                  }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setGender("F")}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    gender === "F" ? "bg-amber-500 text-black" : "text-zinc-400"
                  }`}
                >
                  여성
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">생년월일</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-2.5 focus:outline-none focus:border-amber-500/80 transition-colors font-medium font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold block mb-1">태어난 시간</label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-2.5 focus:outline-none focus:border-amber-500/80 transition-colors font-medium font-mono"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-zinc-850">
            <span className="text-xs text-zinc-400 font-medium">달력 기점 (음양 선택)</span>
            <div className="flex gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setIsLunar(false)}
                className={`px-3 py-1 text-[11px] font-bold rounded-md ${!isLunar ? "bg-zinc-800 text-amber-500" : "text-zinc-500"}`}
              >
                양력(중요)
              </button>
              <button
                type="button"
                onClick={() => setIsLunar(true)}
                className={`px-3 py-1 text-[11px] font-bold rounded-md ${isLunar ? "bg-zinc-800 text-amber-500" : "text-zinc-500"}`}
              >
                음력
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-800 hover:bg-zinc-700 hover:border-amber-500/50 text-zinc-100 border border-zinc-700 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <span>{isSaved ? "사주 기운 저장완료 ✓" : "내 사주 정보 갱신하기"}</span>
          </button>
        </form>
      </div>

      {/* 2. Chat Settings Switches */}
      <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-3.5">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 mb-1">
          <Sliders className="w-4 h-4 text-zinc-400" />
          <span>애플리케이션 환경 설정</span>
        </h3>

        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="text-zinc-200 block font-semibold">매일 아침 사주 요약 팁 발송</span>
            <span className="text-zinc-500 text-[10px]">오늘 가장 유익한 개운 처방 푸시 알람</span>
          </div>
          <button
            type="button"
            onClick={() => setAlarmEnabled(!alarmEnabled)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${alarmEnabled ? "bg-amber-500" : "bg-zinc-800"}`}
          >
            <div className={`w-5 h-5 bg-black rounded-full shadow-md transform duration-300 ${alarmEnabled ? "translate-x-5" : "translate-x-0"}`}></div>
          </button>
        </div>

        <div className="flex justify-between items-center text-xs pt-2 border-t border-zinc-850">
          <div>
            <span className="text-zinc-200 block font-semibold">상담 내역 로컬 저장</span>
            <span className="text-zinc-500 text-[10px]">대화 일지를 웹 브라우저 로컬 저장소에 고정 기록</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveHistory(!saveHistory)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ${saveHistory ? "bg-amber-500" : "bg-zinc-800"}`}
          >
            <div className={`w-5 h-5 bg-black rounded-full shadow-md transform duration-300 ${saveHistory ? "translate-x-5" : "translate-x-0"}`}></div>
          </button>
        </div>
      </div>

      {/* 3. Simulated consulting histories list */}
      {historyItems.length > 0 && (
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30 space-y-3">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 mb-1">
            <History className="w-4 h-4 text-zinc-400" />
            <span>최근 운세 상담 기록 이력</span>
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {historyItems.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-black/40 border border-zinc-850 flex justify-between items-start gap-3">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wide text-amber-500/90">{item.type}</span>
                    <span className="text-[9px] text-zinc-600 font-mono">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-normal">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Dangerous Clean Cache action */}
      <div className="p-5 rounded-2xl border border-rose-950 bg-rose-950/5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-start gap-2 max-w-md">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-rose-400 block">설정 및 대화기록 영구 초기화</span>
            <p className="text-[10px] text-rose-500/80 leading-normal font-normal">
              이름, 생년월일, 결제 권한 및 세 명의 사주 코치와의 모든 상담 히스토리가 소멸됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="w-full sm:w-auto px-4 py-1.5 bg-rose-950 border border-rose-900 hover:bg-rose-900 hover:border-rose-700 text-rose-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          전체 소거하기
        </button>
      </div>

      {/* Security Privacy policy badge */}
      <div className="flex gap-1.5 justify-center items-center text-[10px] text-zinc-550">
        <Shield className="w-3.5 h-3.5" />
        <span>명리학 데이터는 외부 익명 처리되어 철저히 암호 관리됩니다.</span>
      </div>
    </div>
  );
};
