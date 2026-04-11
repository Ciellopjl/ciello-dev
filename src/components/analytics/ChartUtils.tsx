"use client";

export const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-white">
          {payload[0].value} {payload[0].name === "value" ? "Visitas" : ""}
        </p>
      </div>
    );
  }
  return null;
};
