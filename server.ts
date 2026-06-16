import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { calculateSaju, getStaticSajuPersonality, generateStaticChemistry } from "./src/utils/sajuUtils.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client with standard user-agent header
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API client initialized successfully on server.");
  } catch (error) {
    console.error("Failed to initialize Gemini API client:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. Saju Analysis will use elegant traditional pre-calculated backups.");
}

// ----------------------------------------------------
// AI Saju API Routes
// ----------------------------------------------------

/**
 * POST /api/saju/analyze
 * Generates an extensive Saju analysis including traditional pillars, five elements, and personalized Gemini daily fortune.
 */
app.post("/api/saju/analyze", async (req, res) => {
  try {
    const { name, birthDate, birthTime, isLunar, gender } = req.body;

    if (!name || !birthDate) {
      return res.status(400).json({ error: "이름과 생년월일은 필수 입력 항목입니다." });
    }

    // 1. Calculate physical pillars & five elements
    const rawSaju = calculateSaju(birthDate, birthTime || "12:00", !!isLunar, gender || "M");
    const staticPersonality = getStaticSajuPersonality(rawSaju.dayStem, Object.keys(rawSaju.fiveElements).reduce((a, b) => 
      (rawSaju.fiveElements[a as keyof typeof rawSaju.fiveElements] > rawSaju.fiveElements[b as keyof typeof rawSaju.fiveElements] ? a : b)
    ));

    // Calculate baseline scores deterministically so there is a realistic ground-truth
    const combinedHash = `${name}_${birthDate}_${gender}`;
    let hashNum = 0;
    for (let i = 0; i < combinedHash.length; i++) {
      hashNum = (hashNum << 5) - hashNum + combinedHash.charCodeAt(i);
      hashNum |= 0;
    }
    const absHash = Math.abs(hashNum);
    const wealthScore = (absHash % 25) + 75; // 75 ~ 99
    const careerScore = ((absHash >> 2) % 25) + 73; // 73 ~ 97
    const loveScore = ((absHash >> 4) % 30) + 70; // 70 ~ 99
    const healthScore = ((absHash >> 6) % 20) + 80; // 80 ~ 99

    let dailyFortune = `오늘 하루는 ${staticPersonality.title}의 기운이 맴도는 멋진 가을날 같습니다. 하늘의 기운이 돕고 있으니 과감하고 침착하게 신념을 관철하십시오.`;
    let wealthDesc = "기회가 눈앞에 도래하고 있으니 실리적인 투자를 늘리고 지출을 낭비하지 마십시오.";
    let careerDesc = "주변 동료와 의견 대립이 살짝 예상되니 넓은 아량으로 양보하고 묵묵하고 성실하게 행동하는 것이 길합니다.";
    let loveDesc = "따스한 기운이 연인 간 흐릅니다. 평소 표현하지 못했던 깊은 진심의 언어로 보듬어주면 궁합이 한껏 밝아집니다.";
    let healthDesc = "오행의 순환이 전반적으로 고릅니다. 가벼운 명상과 유산소 운동으로 탁한 기운을 풀어내면 신체 활력이 도모됩니다.";

    // 2. Enhance with custom Gemini generation if API key is present
    if (ai) {
      try {
        const prompt = `
          사주 명리학 분석 요청:
          - 이름: ${name}
          - 성별: ${gender === "M" ? "남성" : "여성"}
          - 생년월일: ${birthDate} (${isLunar ? "음력" : "양력"})
          - 사주 간지:
            * 년주: ${rawSaju.pillars.year.stem}${rawSaju.pillars.year.branch}
            * 월주: ${rawSaju.pillars.month.stem}${rawSaju.pillars.month.branch}
            * 일주: ${rawSaju.pillars.day.stem}${rawSaju.pillars.day.branch}
            * 시주: ${rawSaju.pillars.hour.stem}${rawSaju.pillars.hour.branch}
          - 오행 비중: 목 ${rawSaju.fiveElements.wood}%, 화 ${rawSaju.fiveElements.fire}%, 토 ${rawSaju.fiveElements.earth}%, 금 ${rawSaju.fiveElements.metal}%, 수 ${rawSaju.fiveElements.water}%
          - 성격 프로필: ${staticPersonality.title} - ${staticPersonality.description}

          작성 가이드라인:
          1. '오늘의 한줄 운세 (dailyFortune)'를 수묵화의 아름다움과 깊은 통찰력이 우러나오는 시적인 운세 문장으로 작성해 주세요. (200자 내외)
          2. 재물운 상세설명(wealth), 직업운 상세설명(career), 연애운 상세설명(love), 건강운 상세설명(health)에 어울리는 한국 정통 사주 명리적 격언 및 따뜻하고 품격 있는 현실적 조언을 각각 150자 내외로 문장만 한글로 작성해 주세요.

          결과는 반드시 아래의 JSON 형식 규칙을 완벽하게 지켜서 출력하십시오. 어떤 부가 인사말이나 백틱 마크가 없는 순수 JSON 문자열이어야 합니다.

          JSON 출력 양식 (반드시 이 키 이름만 지킬 것):
          {
            "dailyFortune": "내용",
            "wealth": "내용",
            "career": "내용",
            "love": "내용",
            "health": "내용"
          }
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.dailyFortune) dailyFortune = parsed.dailyFortune;
          if (parsed.wealth) wealthDesc = parsed.wealth;
          if (parsed.career) careerDesc = parsed.career;
          if (parsed.love) loveDesc = parsed.love;
          if (parsed.health) healthDesc = parsed.health;
        }
      } catch (gemError) {
        console.error("Gemini Saju generation failed, using high-quality local template fallback.", gemError);
      }
    }

    res.json({
      birthInfo: { name, birthDate, birthTime, isLunar, gender },
      pillars: rawSaju.pillars,
      fiveElements: rawSaju.fiveElements,
      dailyFortune,
      personality: {
        title: staticPersonality.title,
        description: staticPersonality.description,
        strengths: staticPersonality.strengths,
        weaknesses: staticPersonality.weaknesses,
      },
      fortunes: {
        wealth: { score: wealthScore, description: wealthDesc },
        career: { score: careerScore, description: careerDesc },
        love: { score: loveScore, description: loveDesc },
        health: { score: healthScore, description: healthDesc },
      },
    });
  } catch (error: any) {
    console.error("Saju analysis error:", error);
    res.status(500).json({ error: "사주 분석 진행 중 예상치 못한 오류가 발생했습니다." });
  }
});

/**
 * POST /api/saju/chat
 * Persona-based chat consulting with professional Saju coaches.
 */
app.post("/api/saju/chat", async (req, res) => {
  try {
    const { messages, coachId, sajuData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "채팅 메세지 내역이 필요합니다." });
    }

    const latestMessage = messages[messages.length - 1]?.text || "안녕하세요";

    // Standard fallback strings based on coach
    let reply = "대단히 흥미로운 사주 구조를 가지고 계십니다. 천간과 지지가 조화롭게 순환하는 형태네요. 어떤 것이든 저에게 물어보세요!";
    if (coachId === "wealth") {
      reply = "재물은 하늘이 내리는 기회이지만, 이를 잡는 것은 이성적인 타이밍 설계입니다. 귀하의 오행 구조를 보면 슬슬 금전운의 씨앗을 크게 틔울 적기가 밀려오는 흐름입니다. 투자나 저축에 대한 더 상세한 사주 타이밍을 함께 점쳐볼까요?";
    } else if (coachId === "love") {
      reply = "마음과 마음이 조화되는 것 만큼 대단한 복은 없지요. 귀하의 따뜻한 오행 구성을 볼 때, 올해는 연인 혹은 귀인과의 소통운이 특히 부드럽게 트이는 시기입니다. 누구보다 소중한 사람과의 깊은 감정 조율법을 이야기 나눠봐요.";
    } else if (coachId === "career") {
      reply = "지금 품고 계신 직로 고민은 하늘을 향해 자라나기 전 튼튼한 뿌리를 다지는 과정입니다. 귀하의 거목 같은 열정이 직장운, 경쟁운과 마주하고 있으니 조금 더 야무지게 집중할 방법을 세부적으로 짚어봅시다.";
    }

    // Enhance response with custom persona on Gemini
    if (ai) {
      try {
        let personaPrompt = "";
        if (coachId === "wealth") {
          personaPrompt = `
            너는 날카롭고 현실적이며 솔직한 30대 남성 재물운 전문 사주 코치 '현우'이다. 
            돈을 낭비하는 습관이 있다면 단호하면서도 재치 있게 집어주고, 투자와 자산 분배에 대한 조언을 사주 기운과 연결하여 조크를 섞어 말한다.
            존댓말을 쓰며, 이성적이고 금전 증식 타이밍에 집중하는 명리학 마스터이다. 말투는 친절하되 주관이 확실하고 날카롭다.
          `;
        } else if (coachId === "love") {
          personaPrompt = `
            너는 세상에서 가장 따스하고 이해심 깊은 20대 여성 연애/밀착관계 전문 사주 코치 '지수'이다.
            상대방의 약한 마음을 먼저 100% 공감해 주고, 감수성 넘치는 따뜻한 위로와 사주 궁합의 지혜를 전수한다.
            부드럽고 싹싹하며, 이모티콘과 다정한 비유를 적절히 융화시켜 포근하게 조언한다.
          `;
        } else if (coachId === "career") {
          personaPrompt = `
            너는 40대 추진력 높고 학구열 넘치는 비즈니스/직업 설계의 대가 사주 코치 '도윤'이다.
            강인하게 동기부여를 심어주며, '시험 합격', '이직', '승진' 등을 위해 지금 즉시 실천해야 하는 명리 학문적 개운 비책을 단단하고 신뢰 있는 눈빛으로 제시한다.
            논리적이며 가슴이 뛰는 격려를 보낸다.
          `;
        } else {
          personaPrompt = "너는 친절하고 인품이 높은 대한민국 최고의 정통 AI 사주 코치 마스터이다.";
        }

        const systemInstruction = `
          ${personaPrompt}
          
          카운슬링 대상자의 사주 요약 정보:
          - 이름: ${sajuData?.birthInfo?.name || "고객"}
          - 성별: ${sajuData?.birthInfo?.gender === "M" ? "남성" : "여성"}
          - 사주 일간: ${sajuData?.personality?.title || "안정된 사주 가치"}
          - 오행 분포: 목 ${sajuData?.fiveElements?.wood || 20}%, 화 ${sajuData?.fiveElements?.fire || 20}%, 토 ${sajuData?.fiveElements?.earth || 20}%, 금 ${sajuData?.fiveElements?.metal || 20}%, 수 ${sajuData?.fiveElements?.water || 20}%

          대화 규칙:
          1. 친밀하고 카운슬러다운 어조로 반갑게 유저를 대할 것.
          2. 유저가 고민을 이야기하면 사주 비중과 일주 정보(예: ${sajuData?.personality?.title || "당신의 일주"})를 가볍게 엮어서 현실감 높은 인생 설계를 조언해 줄 것.
          3. 한국 정통 사주의 신비로운 원리를 현대적으로 쉽게 설명할 것.
          4. 답변 길이는 3-4문장 내외로 매우 직관적이고 읽기 편하게 제공할 것.
        `;

        // Format conversational history for Gemini contents array
        // Standard shape is: [{ role: "user", parts: [{ text: "..." }] }, { role: "model", parts: [...] }]
        const contents = messages.map((m: any) => ({
          role: m.sender === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.8
          }
        });

        if (response.text) {
          reply = response.text.trim();
        }
      } catch (gemError) {
        console.error("Gemini Saju Chat failed, using high-quality local fallback reply.", gemError);
      }
    }

    res.json({ text: reply });
  } catch (error: any) {
    console.error("Saju Chat Error:", error);
    res.status(500).json({ error: "상담 진행 중 서버 내부 조율 오류가 발생했습니다." });
  }
});

/**
 * POST /api/saju/chemistry
 * Dynamic chemistry calculations.
 */
app.post("/api/saju/chemistry", async (req, res) => {
  try {
    const { name1, name2 } = req.body;
    if (!name1 || !name2) {
      return res.status(400).json({ error: "궁합을 볼 두 사람의 이름을 입력해 주세요." });
    }

    const result = generateStaticChemistry(name1, name2);

    if (ai) {
      try {
        const prompt = `
          오행 궁합 분석 요청:
          - 대상자 1: ${name1}
          - 대상자 2: ${name2}
          - 기본 매칭 점수: ${result.score}점
          - 기본 매칭 등급: ${result.grade}

          작성 요청:
          1. 두 사람의 조화와 기운에 대한 사주 학술적 풀이를 서정적이고 현대적인 문체로 작성하십시오. (description, 약 150자)
          2. 갈등을 피하고 천생의 조화를 키워가는 구체적인 연애 대화법이나 개운법 조언을 제시해 주세요. (conflictAdvice, 약 150자)

          결과는 반드시 아래의 JSON 형식 규격을 지켜서 응답하십시오. 백틱 등이 없는 순수 JSON 문자열이어야 합니다.
          JSON 양식:
          {
            "description": "풀이 내용",
            "conflictAdvice": "조언 설명"
          }
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.description) result.description = parsed.description;
          if (parsed.conflictAdvice) result.conflictAdvice = parsed.conflictAdvice;
        }
      } catch (gemError) {
        console.error("Gemini Chemistry generator failed, using accurate local fallback.", gemError);
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Chemistry calculation error:", error);
    res.status(500).json({ error: "궁합 조율 진행 중 예상치 못한 상태 오류가 발생했습니다." });
  }
});

// ----------------------------------------------------
// dev / production environment configuration
// ----------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for active development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    // Static file serving of compiled production files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist folder.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started in ${process.env.NODE_ENV || "development"} mode.`);
    console.log(`Ingress points initialized. Hosting on port ${PORT}`);
  });
}

start().catch(err => {
  console.error("Critical error in starting Express+Vite service:", err);
});
