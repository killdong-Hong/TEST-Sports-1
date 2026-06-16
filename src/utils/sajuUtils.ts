import { SajuPillar, SajuAnalysis, ChemistryResult } from "../types";

const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const STEMS_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const BRANCHES_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const STEM_ELEMENTS: Record<string, string> = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

const BRANCH_ELEMENTS: Record<string, string> = {
  인: "목", 묘: "목",
  사: "화", 오: "화",
  진: "토", 축: "토", 미: "토", 술: "토",
  신: "금", 유: "금",
  해: "수", 자: "수",
};

export function getPillar(stemIdx: number, branchIdx: number): SajuPillar {
  const s = STEMS[stemIdx % 10];
  const b = BRANCHES[branchIdx % 12];
  return {
    stem: s,
    branch: b,
    stemHanja: STEMS_HANJA[stemIdx % 10],
    branchHanja: BRANCHES_HANJA[branchIdx % 12],
    element: STEM_ELEMENTS[s],
  };
}

export function calculateSaju(
  birthDate: string, // YYYY-MM-DD
  birthTime: string, // HH:MM
  isLunar: boolean,
  gender: "M" | "F"
) {
  const [yStr, mStr, dStr] = birthDate.split("-");
  const [hStr, minStr] = (birthTime || "12:00").split(":");
  
  let year = parseInt(yStr, 10) || 1995;
  let month = parseInt(mStr, 10) || 5;
  let day = parseInt(dStr, 10) || 15;
  let hour = parseInt(hStr, 10) || 12;

  // Saju Year Pillar
  // Year Stem: (year - 4) % 10
  // Year Branch: (year - 4) % 12
  const yearStemIdx = (year - 4 + 10) % 10;
  const yearBranchIdx = (year - 4 + 12) % 12;
  const yearPillar = getPillar(yearStemIdx, yearBranchIdx);

  // Saju Month Pillar
  // Approximate standard Month determination (using Year Stem to find Month Stem)
  // Month Branch: 寅(2) is Jan solar term, so branches start with寅 for Jan, etc.
  // Branch index is: 2 corresponds to 寅. Lunar Months 1-12 mapped to 寅(2) to 丑(1)
  const monthBranchIdx = (month + 1) % 12; // month 1 = 寅(2), month 11 = 子(0), 12 = 丑(1)
  // Month Stem starts:
  // Year stem index % 5 -> 0(갑기:병), 1(을경:무), 2(병신:경), 3(정임:임), 4(무계:갑)
  const monthStartStemIdx = ((yearStemIdx % 5) * 2 + 2) % 10;
  const monthStemIdx = (monthStartStemIdx + (month - 1)) % 10;
  const monthPillar = getPillar(monthStemIdx, monthBranchIdx);

  // Saju Day Pillar
  // Calculated from baseline 2000-01-01 which is 戊午 (Stem 4, Branch 6)
  const epoch = Date.UTC(2000, 0, 1);
  const target = Date.UTC(year, month - 1, day);
  const diffDays = Math.floor((target - epoch) / (1000 * 60 * 60 * 24));
  
  // 60-cycle index for baseline is 54 (戊午)
  const dayCycleIdx = (54 + (diffDays % 60) + 60) % 60;
  const dayStemIdx = dayCycleIdx % 10;
  const dayBranchIdx = dayCycleIdx % 12;
  const dayPillar = getPillar(dayStemIdx, dayBranchIdx);

  // Saju Hour Pillar
  // Hour Branch (2-hour block starting from 23:00 as 子)
  const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);
  // Hour Stem based on Day Stem:
  // Day Stem index % 5 -> 0(갑기:갑), 1(을경:병), 2(병신:무), 3(정임:경), 4(무계:임)
  const hourStartStemIdx = ((dayStemIdx % 5) * 2) % 10;
  const hourStemIdx = (hourStartStemIdx + hourBranchIdx) % 10;
  const hourPillar = getPillar(hourStemIdx, hourBranchIdx);

  // Calculate Five Elements Distribution (out of 8 characters)
  const elementsCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const pillarsList = [yearPillar, monthPillar, dayPillar, hourPillar];
  
  pillarsList.forEach(p => {
    // Stem Element
    const sEl = STEM_ELEMENTS[p.stem];
    if (sEl === "목") elementsCount.wood++;
    else if (sEl === "화") elementsCount.fire++;
    else if (sEl === "토") elementsCount.earth++;
    else if (sEl === "금") elementsCount.metal++;
    else if (sEl === "수") elementsCount.water++;

    // Branch Element
    const bEl = BRANCH_ELEMENTS[p.branch];
    if (bEl === "목") elementsCount.wood++;
    else if (bEl === "화") elementsCount.fire++;
    else if (bEl === "토") elementsCount.earth++;
    else if (bEl === "금") elementsCount.metal++;
    else if (bEl === "수") elementsCount.water++;
  });

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    fiveElements: {
      wood: Math.round((elementsCount.wood / 8) * 100),
      fire: Math.round((elementsCount.fire / 8) * 100),
      earth: Math.round((elementsCount.earth / 8) * 100),
      metal: Math.round((elementsCount.metal / 8) * 100),
      water: Math.round((elementsCount.water / 8) * 100),
    },
    dayStem: dayPillar.stem,
  };
}

// Map Day Stem and dominant elements to personalities
export function getStaticSajuPersonality(dayStem: string, dominantElement: string) {
  const profiles: Record<string, { title: string; description: string; strengths: string[]; weaknesses: string[] }> = {
    갑: {
      title: "우뚝 솟은 큰 소나무 (甲木)",
      description: "갑목은 하늘을 향해 우뚝 솟은 거목과 닮았습니다. 추진력이 강하고 리더십이 뛰어나며, 한번 결심한 일은 끝까지 밀어붙이는 강한 의지를 가집니다. 솔직하고 정의감이 강해 신뢰를 주는 성품입니다.",
      strengths: ["탁월한 리더십", "강건한 의지력", "정직함과 우직함", "도전 정신"],
      weaknesses: ["타인의 조언을 꺼려함", "융통성 부족", "가끔 지나친 고집", "한번 꺾이면 회복이 느림"],
    },
    을: {
      title: "바람에 흔들리지만 꺾이지 않는 잡초 (乙木)",
      description: "을목은 유연하고 섬세한 덩굴이나 잡초와 같습니다. 환경 적응력이 매우 뛰어나며 인화 관계가 부드럽고 외유내강형 세심함을 가지고 있습니다. 역경을 부드럽게 이겨내는 지혜가 돋보입니다.",
      strengths: ["매우 강한 적응력", "친화적이고 부드러움", "엄청난 끈기", "창의적 표현력"],
      weaknesses: ["타인의 시선에 예민함", "우유부단함", "사려 깊음이 소심함으로 오해됨", "의존적인 성향"],
    },
    병: {
      title: "만물을 비추는 찬란한 태양 (丙火)",
      description: "병화는 하늘 위 이글거리는 태양과 같습니다. 정열적이고 활발하며 세상을 비추는 공헌욕이 큽니다. 매사에 긍정적이고 솔직하며, 숨김 없이 솔직하게 마음을 표현합니다.",
      strengths: ["뛰어난 자기표현력", "지치지 않는 열정과 에너지", "화끈하고 시원시원함", "낙천적 성격"],
      weaknesses: ["쉽게 욱하고 가라앉음", "인내심 부족", "너무 솔직해 남에게 상처를 줌", "자기중심적 생각"],
    },
    정: {
      title: "어둠을 부드럽게 밝히는 등대 (丁火)",
      description: "정화는 밤하늘의 별빛, 혹은 따뜻한 촛불과 같습니다. 내형적으로 조용하지만 섬세하고 헌신적인 사랑을 나눕니다. 분석력이 예리하며 한 분야에 깊은 장인적 집중력을 보입니다.",
      strengths: ["따뜻하고 헌신적인 정수", "깊은 예술성 및 직관", "뛰어난 학구열과 치밀함"],
      weaknesses: ["속에 화를 쌓아둠", "한번 질투하면 깊음", "예민하고 상처받기 쉬움"],
    },
    무: {
      title: "모든 것을 품는 거대한 태산 (戊土)",
      description: "무토는 넓고 두터운 대지 혹은 태산과 같아 신용이 깊고 흔들리지 않습니다. 포용력이 넓고 듬직해 주변 사람들이 늘 의지하는 기둥 같은 존재입니다.",
      strengths: ["우직한 흔들림 없음", "높은 포용력", "높은 신용과 책임감"],
      weaknesses: ["변화를 싫어함", "고집스럽고 주관이 지나침", "감정 표현이 무뚝뚝함"],
    },
    기: {
      title: "비옥하고 윤택한 전원흙 (己土)",
      description: "기토는 씨앗을 키우는 비옥한 텃밭과 같습니다. 어머니의 품처럼 따뜻하고 수용적이며, 세심히 정원을 가꾸듯 뛰어난 관리력과 실리적인 지혜를 가집니다.",
      strengths: ["섬세하고 실리적임", "부드러운 포용과 타협", "안정지향적 꼼꼼함"],
      weaknesses: ["소심하고 의심이 많음", "우유부단하며 속내를 숨김", "과도한 걱정"],
    },
    경: {
      title: "불을 입지 않은 단단한 강철 (庚金)",
      description: "경금은 가공되지 않은 원석이나 단단한 무쇠와 같이 의리에 살고 의리에 죽는 성정을 가집니다. 과단성이 있으며 불의를 보면 못 참으며 강인한 추진력이 돋보입니다.",
      strengths: ["정의롭고 의리가 강함", "매우 과감한 결단력", "깔끔한 마무리"],
      weaknesses: ["냉정하고 날카로움", "융통성 없는 흑백논리", "남에게 강요하는 경향"],
    },
    신: {
      title: "정교하게 제련된 아름다운 보석 (辛金)",
      description: "신금은 빛나는 섬세한 보석 혹은 날카로운 칼끝과 같습니다. 자존심이 무척 강하며 세련된 미적 감각을 지녔고, 매사에 분석적이고 논리정연한 지적인 면모를 품고 있습니다.",
      strengths: ["섬세하고 세련됨", "대단히 날카롭고 예리한 두뇌", "본인의 강한 원칙 준수"],
      weaknesses: ["냉철하고 비판적임", "자존심 상하면 마음에 상처를 쌓음", "의부증이나 깔끔증"],
    },
    임: {
      title: "끝없이 흘러 흘러 바다를 이루는 강물 (壬水)",
      description: "임수는 드넓은 바다나 호수와 같아 지혜가 깊고 임기응변에 매우 능합니다. 도량이 크고 흐르듯이 융통성이 있어 모든 사물과 지혜롭게 화합합니다.",
      strengths: ["바다 같은 지혜", "최고의 융통성과 친화력", "웅장하고 넓은 스케일"],
      weaknesses: ["속내를 알기 매우 어려움", "속에 어두운 생각이나 우울감", "지나치게 과장하기도 함"],
    },
    계: {
      title: "하늘에서 내리는 맑은 빗방울 (癸水)",
      description: "계수는 아침이슬 혹은 하늘에서 내리는 맑은 단비와 같아 두뇌가 아주 비상하고 총명합니다. 성정이 순수하며 한 방울의 물이 돌을 뚫듯 깊은 흡수력과 적응력을 안고 삽니다.",
      strengths: ["비상하고 총명한 두뇌", "뛰어난 감수성과 예술성", "부드러운 은근함"],
      weaknesses: ["매우 예민하고 변덕스러움", "주관이 무너지기 쉬움", "사소한 일에 전전긍긍함"],
    }
  };

  const defaultProfile = {
    title: "깊은 조화를 가진 명리적 운명",
    description: "사주의 근본적인 균형이 매우 훌륭합니다. 자신만의 독자적인 중심을 잡고 인생의 굴곡을 극복해 나가는 단단함을 갖고 있습니다.",
    strengths: ["균형 감각", "탁월한 직관", "인내와 조화"],
    weaknesses: ["자기 과신", "표현의 무뚝뚝함"]
  };

  return profiles[dayStem] || defaultProfile;
}

export function generateStaticChemistry(name1: string, name2: string): ChemistryResult {
  // Simple deterministic algorithm to generate consistent compatibility scores based on names
  const combinedNames = `${name1}_with_${name2}`;
  let hash = 0;
  for (let i = 0; i < combinedNames.length; i++) {
    hash = (hash << 5) - hash + combinedNames.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const score = Math.abs(hash % 31) + 70; // score between 70 and 100

  let grade: '천생연분' | '구실좋음' | '서로격려' | '주의필요' | '상극관계' = '서로격려';
  let description = '';
  let strengths: string[] = [];
  let conflictAdvice = '';

  if (score >= 95) {
    grade = '천생연분';
    description = `${name1}님과 ${name2}님은 오행이 서로 완벽하게 순환하는 천생연분입니다. 서로의 부족한 기운을 자연스럽게 채워주고, 함께 있는 것만으로도 행운이 따릅니다.`;
    strengths = ['완벽한 소통과 이해', '서로의 재물운 동반 상승', '함께할 때 극대화되는 시너지'];
    conflictAdvice = '워낙 궁합이 좋아 큰 갈등은 없으나, 서로 당연하게 여기는 마음에 감사의 표현을 잊지 않는 것이 더욱 완벽한 관계를 해나가는 열쇠가 됩니다.';
  } else if (score >= 88) {
    grade = '구실좋음';
    description = `${name1}님과 ${name2}님은 가치관이 매우 유사하고 추구하는 인생의 방향성이 조화롭습니다. 서로가 신뢰할 수 있는 든든한 등대 같은 관계입니다.`;
    strengths = ['높은 도덕적 상호 신뢰', '현실적인 상조 능력', '안정감 넘치는 대화법'];
    conflictAdvice = '가끔 서로 너무 조심스러워 솔직한 불만을 숨길 수 있으니, 정기적으로 가벼운 대화를 통해 작은 오해를 즉각 털어내길 추천합니다.';
  } else if (score >= 80) {
    grade = '서로격려';
    description = `${name1}님과 ${name2}님은 각자 개성이 확실하지만, 서로의 다름을 인정하고 격려해 줄 때 가장 밝게 빛나는 관계입니다. 배울 점이 아주 풍부합니다.`;
    strengths = ['서로의 지적인 영감 자극', '독립성 보장과 상호 존중', '역경 해결 능력이 동반 향상됨'];
    conflictAdvice = '때론 각자의 강한 주관 때문에 의견 대립이 보일 수 있으니, 상대방이 말을 끝마칠 때까지 조용히 경청해주는 습관을 지녀보세요.';
  } else {
    grade = '주의필요';
    description = `${name1}님과 ${name2}님은 끌림은 정말 강력하지만, 오행의 기운이 한쪽으로 치우쳐 조율에 다소 노력이 요구되는 자극적인 궁합입니다.`;
    strengths = ['처음 만났을 때 불꽃같은 끌림', '특징이 뚜렷한 상호적 자극', '서로의 부족한 현실 감각 보완'];
    conflictAdvice = '서로의 자존심을 건드리지 않고, 격렬한 비판 대신 "나는 이렇게 느낀다"라며 평화로운 대화 방식을 취하는 개운법(開運法)이 절실히 필요합니다.';
  }

  return {
    user1Name: name1,
    user2Name: name2,
    score,
    grade,
    description,
    strengths,
    conflictAdvice
  };
}
