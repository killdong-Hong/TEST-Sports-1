import React, { useState, useEffect, useRef } from "react";
import { SajuAnalysis, ChatMessage, SajuCoach } from "../types";
import { Send, User, Sparkles, MessageCircle, HelpCircle } from "lucide-react";

interface ChatSectionProps {
  sajuData: SajuAnalysis;
}

const COACHES: SajuCoach[] = [
  {
    id: "wealth",
    name: "현우",
    role: "재물운·투자 설계 마스터",
    description: "현실적이고 이성적인 자산 증식 설계 전문가. 돈이 새는 곳을 날카롭게 짚고, 부자 대운 타이밍을 집요하게 분석합니다.",
    avatar: "💰",
    color: "from-amber-500 to-yellow-600",
    greetings: "반갑습니다. 자산 설계인 현우입니다. 사주에서 재물 구멍을 찾아 극대화하고 이성적으로 대운을 당겨올 비법을 설계하겠습니다. 투자나 지출, 이사 등에 대해 편하게 질문 주십시오."
  },
  {
    id: "love",
    name: "지수",
    role: "연애·대인 관계 상담사",
    description: "따스하고 공감 능력이 탁월한 힐러. 연인 궁합, 인연 흐름, 대인 관계 오해 극대화 해결 및 심리 카운슬링을 전문으로 합니다.",
    avatar: "🌸",
    color: "from-rose-400 to-pink-500",
    greetings: "안녕하세요~! 따뜻한 동행인 지수예요. 마음이 다치셨거나, 소중한 인연과의 어긋남으로 혼자 속상해하셨나요? 사주의 다정함을 엮어 당신을 위한 포근한 개운법을 함께 털어놓을게요. 무엇이든 기대어 주세요."
  },
  {
    id: "career",
    name: "도윤",
    role: "이직·성공 커리어 코치",
    description: "뜨거운 추진력을 불사르는 동기부여 전문가. 합격운, 진로 전환, 직장 탈출, 승진 기운을 명리 전술과 결합해 단단하게 지시합니다.",
    avatar: "🔥",
    color: "from-emerald-500 to-teal-600",
    greetings: "반갑습니다! 인생 설계 마스터 도윤입니다. 멈춰있는 현실과 막막한 미래를 강력하게 부숴낼 타이밍입니다. 승진, 시험 대운, 이직 전략을 사주 비기(祕器)로 속 시원하게 돌파합시다. 질문하십시오!"
  }
];

const SUGGESTION_CHIPS: Record<string, string[]> = {
  wealth: [
    "내 평생 돈복이 가장 크게 트이는 시기는?",
    "자산 투자를 할 때 주의해야 할 년도가 궁금해요.",
    "돈이 새는 사주 구멍을 메우는 개운 비책은?"
  ],
  love: [
    "나와 천생연분이 될 궁합의 오행 조합은?",
    "올해 연애운이 가장 강력한 달이 궁금해요.",
    "자주 부딪치는 사람이 있는데 개운 대처법이 있나요?"
  ],
  career: [
    "올해 이직이나 부서 이동은 길한가요?",
    "시험 준비 중인데 합격운을 키울 방법은?",
    "나의 오행과 시너지를 내는 최상의 직무 직종은?"
  ]
};

export const ChatSection: React.FC<ChatSectionProps> = ({ sajuData }) => {
  const [selectedCoach, setSelectedCoach] = useState<SajuCoach>(COACHES[0]);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    wealth: [
      { id: "init-w", sender: "coach", text: COACHES[0].greetings, timestamp: new Date().toLocaleTimeString() }
    ],
    love: [
      { id: "init-l", sender: "coach", text: COACHES[1].greetings, timestamp: new Date().toLocaleTimeString() }
    ],
    career: [
      { id: "init-c", sender: "coach", text: COACHES[2].greetings, timestamp: new Date().toLocaleTimeString() }
    ]
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever active history changes
  const activeHistory = chatHistories[selectedCoach.id] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeHistory, isSending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    // 1. Append user message to active chat history
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedHistory = [...activeHistory, userMsg];
    setChatHistories(prev => ({
      ...prev,
      [selectedCoach.id]: updatedHistory
    }));
    setInputMessage("");
    setIsSending(true);

    try {
      // 2. Query our Express backend
      const response = await fetch("/api/saju/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.slice(-6), // Send last 6 messages to stay inside quick context limit
          coachId: selectedCoach.id,
          sajuData: sajuData
        })
      });

      if (!response.ok) {
        throw new Error("서버 연동 실패");
      }

      const data = await response.json();

      // 3. Append core coach response
      const coachMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: "coach",
        text: data.text || "사주 순환이 풍부하오나 기선이 흐트러졌습니다. 다시 여쭤봐 주시겠습니까?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChatHistories(prev => ({
        ...prev,
        [selectedCoach.id]: [...updatedHistory, coachMsg]
      }));
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback response inside error state
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "coach",
        text: "우주의 기운이 다소 어지럽거나 연결이 소원해졌습니다. 오행의 균형을 찾아 명상을 제안하며, 잠시 후 질문을 새겨 주시면 대답해 가겠습니다.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatHistories(prev => ({
        ...prev,
        [selectedCoach.id]: [...updatedHistory, fallbackMsg]
      }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[65vh] md:h-[70vh] border border-zinc-900 rounded-3xl overflow-hidden bg-black/40">
      {/* 1. Coach Selector Header bar */}
      <div className="p-3 bg-zinc-900/60 border-b border-zinc-900 flex justify-around gap-2">
        {COACHES.map(coach => {
          const isSelected = selectedCoach.id === coach.id;
          return (
            <button
              key={coach.id}
              type="button"
              onClick={() => setSelectedCoach(coach)}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                isSelected 
                  ? "bg-zinc-800/80 border border-amber-500/30 scale-102 shadow-lg" 
                  : "hover:bg-zinc-900/30 border border-transparent opacity-60"
              }`}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${coach.color} flex items-center justify-center text-lg mb-1 shadow-md`}>
                {coach.avatar}
              </div>
              <span className="text-xs font-bold text-zinc-100">{coach.name}</span>
              <span className="text-[9px] text-zinc-400 mt-0.5">{coach.id === "wealth" ? "재물" : coach.id === "love" ? "관계" : "이직"} 전문</span>
            </button>
          );
        })}
      </div>

      {/* 2. Coach Quick Bio bar */}
      <div className="py-2.5 px-4 bg-zinc-950/40 border-b border-zinc-900/60 text-center">
        <p className="text-[10px] text-amber-500/80 uppercase font-mono tracking-widest leading-none">
          {selectedCoach.role}
        </p>
        <p className="text-[11px] text-zinc-400 mt-1 italic line-clamp-1">
          "{selectedCoach.description}"
        </p>
      </div>

      {/* 3. Speech bubble logs list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {activeHistory.map(msg => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}>
              {/* Coach Avatar Icon */}
              {!isUser && (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${selectedCoach.color} flex items-center justify-center text-sm shadow-md flex-shrink-0 self-start mt-1`}>
                  {selectedCoach.avatar}
                </div>
              )}

              {/* Speech bubble */}
              <div className="max-w-[75%] flex flex-col">
                <span className={`text-[9px] text-zinc-500 mb-0.5 font-mono ${isUser ? "text-right" : ""}`}>
                  {isUser ? sajuData.birthInfo.name : `${selectedCoach.name} 코치`}
                </span>
                <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser 
                    ? "bg-amber-500 text-black rounded-tr-none font-medium" 
                    : "bg-zinc-900/90 text-zinc-200 border border-zinc-800/60 rounded-tl-none font-medium whitespace-pre-wrap"
                }`}>
                  {msg.text}
                </div>
                <span className={`text-[8px] text-zinc-600 mt-0.5 font-mono ${isUser ? "text-right" : ""}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* AI Generating Indicator */}
        {isSending && (
          <div className="flex justify-start items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${selectedCoach.color} flex items-center justify-center text-sm animate-pulse`}>
              {selectedCoach.avatar}
            </div>
            <div className="max-w-[75%]">
              <div className="bg-zinc-900/50 text-zinc-500 border border-zinc-900 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span className="font-medium animate-pulse">코치가 사주의 기운을 풀이하고 있습니다...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 4. Suggestion starter chips container */}
      <div className="p-3 bg-zinc-950/20 border-t border-zinc-900/45 space-y-1.5 flex flex-wrap gap-1.5 justify-center items-center">
        <div className="w-full flex justify-center items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-600" />
          <span>이렇게 질문해 보세요</span>
        </div>
        {SUGGESTION_CHIPS[selectedCoach.id].map((chip, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isSending}
            onClick={() => handleSendMessage(chip)}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-[10px] sm:text-xs text-zinc-300 rounded-full transition-all text-center leading-normal cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 5. Footer message composer form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-zinc-900 border-t border-zinc-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          disabled={isSending}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`사주 코치 ${selectedCoach.name}에게 무엇이든 질문해 보세요...`}
          className="flex-1 min-w-0 bg-black/60 border border-zinc-800 text-zinc-200 text-xs sm:text-sm rounded-xl py-2 px-3 focus:outline-none focus:border-amber-500/80 transition-colors disabled:opacity-50 font-medium"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="p-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 focus:outline-none disabled:opacity-40 disabled:hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </form>
    </div>
  );
};
