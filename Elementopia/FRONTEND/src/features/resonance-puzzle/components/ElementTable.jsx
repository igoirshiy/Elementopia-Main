import React from "react";
import { Grid, Card, CardActionArea, Typography, Box, Tooltip } from "@mui/material";
import periodicTableData from "../data/periodic-table-lookup.json";

const symbolToCategory = {};
periodicTableData.order.forEach(name => {
  const element = periodicTableData[name];
  if (element && element.symbol) {
    symbolToCategory[element.symbol] = element.category;
  }
});

const getCategoryStyles = (category) => {
  if (!category) return { base: "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/30 hover:text-white", selected: "bg-white/20 border-white shadow-[0_0_15px_rgba(255,255,255,0.6)]" };
  
  if (category.includes("alkali metal")) return {
    base: "bg-rose-500/10 border-rose-500/20 text-rose-500/70 hover:bg-rose-500/20 hover:border-rose-500/50 hover:text-rose-400 hover:shadow-[0_0_10px_rgba(244,63,94,0.3)]",
    selected: "bg-rose-500/30 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
  };
  if (category.includes("alkaline earth metal")) return {
    base: "bg-orange-500/10 border-orange-500/20 text-orange-500/70 hover:bg-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]",
    selected: "bg-orange-500/30 border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.6)]"
  };
  if (category.includes("transition metal")) return {
    base: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500/70 hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-400 hover:shadow-[0_0_10px_rgba(234,179,8,0.3)]",
    selected: "bg-yellow-500/30 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.6)]"
  };
  if (category.includes("post-transition metal")) return {
    base: "bg-teal-500/10 border-teal-500/20 text-teal-500/70 hover:bg-teal-500/20 hover:border-teal-500/50 hover:text-teal-400 hover:shadow-[0_0_10px_rgba(20,184,166,0.3)]",
    selected: "bg-teal-500/30 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.6)]"
  };
  if (category.includes("metalloid")) return {
    base: "bg-green-500/10 border-green-500/20 text-green-500/70 hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-400 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    selected: "bg-green-500/30 border-green-400 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
  };
  if (category.includes("nonmetal")) return {
    base: "bg-cyan-500/10 border-cyan-500/20 text-cyan-500/70 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]",
    selected: "bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
  };
  if (category.includes("noble gas")) return {
    base: "bg-indigo-500/10 border-indigo-500/20 text-indigo-500/70 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]",
    selected: "bg-indigo-500/30 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
  };
  if (category.includes("lanthanide")) return {
    base: "bg-sky-500/10 border-sky-500/20 text-sky-500/70 hover:bg-sky-500/20 hover:border-sky-500/50 hover:text-sky-400 hover:shadow-[0_0_10px_rgba(14,165,233,0.3)]",
    selected: "bg-sky-500/30 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.6)]"
  };
  if (category.includes("actinide")) return {
    base: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-500/70 hover:bg-fuchsia-500/20 hover:border-fuchsia-500/50 hover:text-fuchsia-400 hover:shadow-[0_0_10px_rgba(217,70,239,0.3)]",
    selected: "bg-fuchsia-500/30 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.6)]"
  };
  
  return {
    base: "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/30 hover:text-white",
    selected: "bg-white/20 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.6)]"
  };
};

const elementGroups = [
  ["H", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "He"],
  ["Li", "Be", null, null, null, null, null, null, null, null, null, null, "B", "C", "N", "O", "F", "Ne"],
  ["Na", "Mg", null, null, null, null, null, null, null, null, null, null, "Al", "Si", "P", "S", "Cl", "Ar"],
  ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
  ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
  ["Cs", "Ba", null, "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
  ["Fr", "Ra", null, "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
  [null, null, "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", null],
  [null, null, "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", null],
];

const ElementTable = ({ selectedElement, setSelectedElement }) => {
  return (
    <Box
      className="mx-auto rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur shadow-[0_0_15px_rgba(236,72,153,0.05)]"
      sx={{ width: "fit-content", marginBottom: 0 }}
    >
      <div className="flex flex-col gap-1.5">
        {elementGroups.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex gap-1.5 justify-center ${rowIndex === 7 ? 'mt-3' : ''}`}>
            {row.map((element, colIndex) => {
              if (!element) return <div key={colIndex} className="w-[34px] h-[34px]"></div>;
              const isSelected = selectedElement === element;
              const styles = getCategoryStyles(symbolToCategory[element]);
              return (
                <div key={colIndex} className="w-[34px] h-[34px]">
                  <Tooltip title={`Click to select ${element}`} arrow>
                    <button
                      onClick={() => setSelectedElement(element)}
                      className={`w-full h-full rounded border font-mono font-bold text-[0.65rem] transition-all duration-300 flex items-center justify-center ${
                        isSelected 
                          ? `${styles.selected} z-10 relative scale-[1.15]` 
                          : styles.base
                      }`}
                    >
                      {element}
                    </button>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ElementTable;
