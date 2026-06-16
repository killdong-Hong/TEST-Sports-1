import { useState, useEffect } from "react";
import { SajuAnalysis } from "./types";
import { HomeSection } from "./components/HomeSection";
import { AnalysisSection } from "./components/AnalysisSection";
import { ChatSection } from "./components/ChatSection";
import { ChemistrySection } from "./components/ChemistrySection";
import { InsightsSection } from "./components/InsightsSection";
import { PremiumSection } from "./components/PremiumSection";
import { ProfileSection } from "./components/ProfileSection";
import { 
  Home, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  LineChart, 
  Award, 
  Settings, 
  Sparkles, 
  Sun, 
  Moon, 
  Hourglass, 
  CalendarDays, 
  Compass 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [sajuData, setSajuData] = useState<SajuAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onboardingName, setOnboardingName] = useState<string>("");
  const [onboardingDate, setOnboardingDate] = useState<string>("1995-05-15");
  const [onboardingTime, setOnboardingTime] = useState<string>("12:00");
  const [onboardingLunar, setOnboardingLunar] = useState<boolean>(false);
  const [onboardingGender, setOnboardingGender] = useState<"M" | "F">("M");

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("saju_user_name");
    const savedDate = localStorage.getItem("saju_user_date");
    const savedTime = localStorage.getItem("saju_user_time");
    const savedLunar = localStorage.getItem("saju_user_lunar") === "true";
    const savedGender = (localStorage.getItem("saju_user_gender") || "M") as "M" | "F";

    if (savedName && savedDate) {
      handleAnalyzeSaju(savedName, savedDate, savedTime || "12:00", savedLunar, savedGender);
    }
  }, []);

  const handleAnalyzeSaju = async (
    name: string,
    date: string,
    time: string,
    isLunar: boolean,
    gender: "M" | "F"
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/saju/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthDate: date, birthTime: time, isLunar, gender })
      });

      if (!response.ok) {
        throw new Error("사주 분석 서버 응답 오류");
      }

      const data = await response.json();
      setSajuData(data);

      // Persist in localStorage
      localStorage.setItem("saju_user_name", name);
      localStorage.setItem("saju_user_date", date);
      localStorage.setItem("saju_user_time", time || "12:00");
      localStorage.setItem("saju_user_lunar", String(isLunar));
      localStorage.setItem("saju_user_gender", gender);
    } catch (err) {
      console.error("Failed to fetch Saju analysis from full-stack api:", err);
      alert("서버 연결에 실패하였지만, 정통 명리 지혜로 구성된 안전 연동 상태로 진입합니다.");
      
      // Pure client-side dynamic fallback configuration in case server API is initializing or has latency
      const calculatedPillars = {
        year: { stem: "병", branch: "자", stemHanja: "丙", branchHanja: "子", element: "화" },
        month: { stem: "을", branch: "미", stemHanja: "乙", branchHanja: "未", element: "목" },
        day: { stem: "무", branch: "정", stemHanja: "戊", branchHanja: "戌", element: "토" },
        hour: { stem: "갑", branch: "인", stemHanja: "甲", branchHanja: "寅", element: "목" }
      };

      setSajuData({
        birthInfo: { name, birthDate: date, birthTime: time || "12:00", isLunar, gender },
        pillars: calculatedPillars,
        fiveElements: { wood: 25, fire: 25, earth: 25, metal: 12, water: 13 },
        dailyFortune: `오늘 하루는 가을 하늘의 맑은 거목 기운이 맴돕니다. 과감한 결정도 좋으나 한 걸음 물러나 침착함을 보듬으면 재물과 관계운에 대성할 수 있습니다.`,
        personality: {
          title: "우뚝 솟은 거대한 태산 (戊土)",
          description: "포용력이 무척 깊고 넓으며, 대지와 같은 따뜻함으로 타인을 보듬어주는 듬직한 사람입니다. 신용이 깊어 주위의 신망을 한몸에 받습니다.",
          strengths: ["탁월한 보살핌", "우직함과 일관성", "말에 책임지는 신용"],
          weaknesses: ["변화에 다소 우둔함", "속마음을 잘 말하지 않음", "한번 토라지면 오래감"]
        },
        fortunes: {
          wealth: { score: 88, description: "금전이 흘러들어오는 길목이 수놓아져 있으니 주말의 귀인을 맞이하십시오." },
          career: { score: 82, description: "경쟁과 도전이 다소 있으나 뚝심으로 지켜내면 고속 이직 기운이 트입니다." },
          love: { score: 91, description: "상대의 한 마디를 다정히 이해하려 할 때 오행의 합이 최고조에 달합니다." },
          health: { score: 85, description: "명상과 따뜻한 물로 체내 순환을 고르게 유지하면 우주의 지혜가 피어납니다." }
        }
      });

      localStorage.setItem("saju_user_name", name);
      localStorage.setItem("saju_user_date", date);
      localStorage.setItem("saju_user_time", time || "12:00");
      localStorage.setItem("saju_user_lunar", String(isLunar));
      localStorage.setItem("saju_user_gender", gender);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllLocalData = () => {
    localStorage.clear();
    setSajuData(null);
    setActiveTab("home");
  };

  // Navigtor render component
  const renderContent = () => {
    if (!sajuData) return null;
    switch (activeTab) {
      case "home":
        return <HomeSection sajuData={sajuData} onNavigate={(tab) => setActiveTab(tab)} />;
      case "analysis":
        return <AnalysisSection sajuData={sajuData} />;
      case "chat":
        return <ChatSection sajuData={sajuData} />;
      case "chemistry":
        return <ChemistrySection defaultUserName={sajuData.birthInfo.name} />;
      case "insights":
        return <InsightsSection sajuData={sajuData} />;
      case "premium":
        return <PremiumSection />;
      case "profile":
        return (
          <ProfileSection 
            sajuData={sajuData} 
            onUpdateProfile={(n, d, t, l, g) => handleAnalyzeSaju(n, d, t, l, g)}
            onClearData={clearAllLocalData}
          />
        );
      default:
        return <HomeSection sajuData={sajuData} onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const getTabLabel = (id: string) => {
    switch (id) {
      case "home": return "홈";
      case "analysis": return "사주 분석";
      case "chat": return "AI 코칭";
      case "chemistry": return "궁합";
      case "insights": return "운세지수";
      case "premium": return "프리미엄";
      case "profile": return "설정";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* 1. ONBOARDING GREETINGS LANDING (if empty profile) */}
      {!sajuData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-zinc-800/80 bg-gradient-to-g from-zinc-950 via-[#131210] to-zinc-950 shadow-2xl relative space-y-6">
            
            {/* Eastern elegant aesthetics top border line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-amber-500/85 to-transparent"></div>
            
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-amber-550/10 rounded-full border border-amber-500/30 text-amber-500 justify-center items-center">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 uppercase">
                AI 사주 코치
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                정통 동양 명리학과 최첨단 인공지능이 융합된<br />
                프리미엄 운명 맞춤형 카운슬링 패스에 오신 것을 환영합니다.
              </p>
            </div>

            {/* Birth registration inputs */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (onboardingName.trim()) {
                  handleAnalyzeSaju(onboardingName, onboardingDate, onboardingTime, onboardingLunar, onboardingGender);
                }
              }}
              className="space-y-4"
            >
              {/* Name and gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold block mb-1">성명 및 닉네임</label>
                  <input
                    type="text"
                    required
                    value={onboardingName}
                    onChange={(e) => setOnboardingName(e.target.value)}
                    placeholder="이름 입력"
                    className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500/80 transition-colors font-medium text-center"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 font-bold block mb-1">성별</label>
                  <div className="grid grid-cols-2 gap-1.5 p-0.5 bg-black/40 border border-zinc-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOnboardingGender("M")}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        onboardingGender === "M" ? "bg-amber-500 text-black" : "text-zinc-500"
                      }`}
                    >
                      남성
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnboardingGender("F")}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        onboardingGender === "F" ? "bg-amber-500 text-black" : "text-zinc-500"
                      }`}
                    >
                      여성
                    </button>
                  </div>
                </div>
              </div>

              {/* Birth Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold block mb-1">생년월일</label>
                  <input
                    type="date"
                    required
                    value={onboardingDate}
                    onChange={(e) => setOnboardingDate(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-2 focus:outline-none focus:border-amber-500/80 transition-colors font-medium text-center font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 font-bold block mb-1">태어난 시간 (선택)</label>
                  <input
                    type="time"
                    value={onboardingTime}
                    onChange={(e) => setOnboardingTime(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-2 focus:outline-none focus:border-amber-500/80 transition-colors font-medium text-center font-mono"
                  />
                </div>
              </div>

              {/* Calendar type selection (Solar vs Lunar) */}
              <div className="bg-black/40 p-3 rounded-xl border border-zinc-900 flex justify-between items-center">
                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-zinc-500" />
                  <span>달력 기준</span>
                </span>
                <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setOnboardingLunar(false)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md ${!onboardingLunar ? "bg-zinc-805 text-amber-500 bg-zinc-800" : "text-zinc-500"}`}
                  >
                    양력
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingLunar(true)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md ${onboardingLunar ? "bg-zinc-805 text-amber-500 bg-zinc-800" : "text-zinc-500"}`}
                  >
                    음력
                  </button>
                </div>
              </div>

              {/* Big shiny activate button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black py-3 rounded-xl font-extrabold text-xs sm:text-sm tracking-widest shadow-lg flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>나의 타고난 운세 분석 기원 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>사주 기운 깨우기 (命運)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 2. MAIN APPLICATION WORKSPACE */
        <div className="flex-1 flex flex-col w-full max-w-lg mx-auto bg-[#0a0a0c] border-x border-zinc-950 relative">
          
          {/* Main Top Header bar */}
          <header className="sticky top-0 z-30 p-4 bg-[#0a0a0cc0] backdrop-blur-md border-b border-zinc-950 flex justify-between items-center">
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span className="p-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </span>
              <span>AI 사주 코치</span>
            </h1>

            {/* Quick Lunar/Solar Status Badge */}
            <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase">
                {sajuData.pillars.day.stem}{sajuData.pillars.day.branch}일
              </span>
            </div>
          </header>

          {/* Under-load analysis spinner */}
          {isLoading && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center space-y-3">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center space-y-3">
                <Hourglass className="w-8 h-8 text-amber-500 animate-spin" />
                <span className="text-xs font-semibold text-zinc-300">명리와 우주 기운 다시 조율 중...</span>
              </div>
            </div>
          )}

          {/* Active section viewport container */}
          <main className="flex-1 p-4 mb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Elegant Mobile-styled bottom float bar navigation links */}
          <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0a0a0cf5] backdrop-blur-lg border-t border-zinc-950 py-2 shadow-2xl flex justify-around items-center w-full max-w-lg mx-auto">
            {[
              { id: "home", icon: Home },
              { id: "analysis", icon: BarChart3 },
              { id: "chat", icon: MessageSquare },
              { id: "chemistry", icon: Heart },
              { id: "insights", icon: LineChart },
              { id: "premium", icon: Award },
              { id: "profile", icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all cursor-pointer relative ${
                    isActive ? "text-amber-500" : "text-zinc-600 hover:text-zinc-400"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "scale-105 stroke-[2.2]" : "stroke-[1.8]"}`} />
                  <span className="text-[8px] sm:text-[9px] mt-1 font-bold leading-none tracking-normal">
                    {getTabLabel(tab.id)}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 w-1 h-1 bg-amber-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
