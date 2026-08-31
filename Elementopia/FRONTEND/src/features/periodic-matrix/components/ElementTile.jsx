import React from "react";
import { getFamilyClasses } from "@/features/dr-atom-workshop";

export function ElementTile({ element, onClick, isDimmed }) {
  const familyClass = getFamilyClasses(element.family);

  return (
    <button
      type="button"
      onClick={() => onClick(element)}
      className={`element-tile rounded-xl border p-1 flex flex-col justify-between transition-all duration-200 cursor-pointer select-none ${familyClass} ${
        isDimmed ? "opacity-15 pointer-events-none scale-95" : "opacity-100 scale-100 hover:scale-115 hover:z-30"
      }`}
      style={{
        aspectRatio: "1 / 1",
        padding: "4px",
      }}
    >
      <span className="text-[9px] font-mono leading-none self-start opacity-80">{element.num}</span>
      <span className="text-base font-bold font-sans text-center leading-none my-0.5">{element.symbol}</span>
      <span className="text-[8px] opacity-75 font-mono truncate leading-none text-center w-full">{element.name}</span>
    </button>
  );
}
