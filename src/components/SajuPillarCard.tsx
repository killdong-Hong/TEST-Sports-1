import React from "react";
import { SajuPillar } from "../types";

interface SajuPillarCardProps {
  label: string; // "년주", "월주", "일주", "시주"
  pillar: SajuPillar;
}

const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  목: { bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-800/60", glow: "shadow-emerald-500/10" },
  화: { bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-800/60", glow: "shadow-rose-500/10" },
  토: { bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-800/60", glow: "shadow-amber-500/10" },
  금: { bg: "bg-zinc-850/40", text: "text-zinc-200", border: "border-zinc-700/60", glow: "shadow-zinc-300/10" },
  수: { bg: "bg-indigo-950/40", text: "text-indigo-400", border: "border-indigo-800/60", glow: "shadow-indigo-500/10" },
};

export const SajuPillarCard: React.FC<SajuPillarCardProps> = ({ label, pillar }) => {
  const meta = ELEMENT_COLORS[pillar.element] || {
    bg: "bg-zinc-900/60",
    text: "text-zinc-400",
    border: "border-zinc-800",
    glow: "shadow-transparent"
  };

  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border ${meta.border} ${meta.bg} shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">{label}</span>
      
      {/* Pillar Character Box */}
      <div className="flex flex-col items-center gap-1.5 my-1">
        {/* Heavenly Stem */}
        <div className="flex flex-col items-center">
          <span className={`text-xl font-bold ${meta.text}`}>{pillar.stem}</span>
          <span className="text-[11px] text-zinc-500 font-mono">{pillar.stemHanja}</span>
        </div>

        <div className="w-5 h-[1px] bg-zinc-800 my-0.5"></div>

        {/* Earthly Branch */}
        <div className="flex flex-col items-center">
          <span className={`text-xl font-bold ${meta.text}`}>{pillar.branch}</span>
          <span className="text-[11px] text-zinc-500 font-mono">{pillar.branchHanja}</span>
        </div>
      </div>

      <div className="mt-2.5 px-2 py-0.5 bg-black/60 rounded-full border border-zinc-800/80">
        <span className={`text-[10px] font-medium leading-none ${meta.text}`}>
          {pillar.element}
        </span>
      </div>
    </div>
  );
};
