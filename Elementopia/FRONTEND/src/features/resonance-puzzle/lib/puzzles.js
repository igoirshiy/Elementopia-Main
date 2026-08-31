// Competitive chemistry puzzle pool.
// Each puzzle: a target compound, the exact element sequence required (optimal path),
// and an inventory of element tiles (with decoys).

const POOL = [
  // --- EASY (2-3 steps) ---
  { id: "h2o", target: "H₂O", targetName: "Water",
    sequence: ["H", "H", "O"], optimalSteps: 3, difficulty: "easy" },
  { id: "co2", target: "CO₂", targetName: "Carbon Dioxide",
    sequence: ["C", "O", "O"], optimalSteps: 3, difficulty: "easy" },
  { id: "nacl", target: "NaCl", targetName: "Salt",
    sequence: ["Na", "Cl"], optimalSteps: 2, difficulty: "easy" },
  { id: "hcl", target: "HCl", targetName: "Hydrochloric Acid",
    sequence: ["H", "Cl"], optimalSteps: 2, difficulty: "easy" },
  { id: "co", target: "CO", targetName: "Carbon Monoxide",
    sequence: ["C", "O"], optimalSteps: 2, difficulty: "easy" },
  { id: "h2", target: "H₂", targetName: "Hydrogen Gas",
    sequence: ["H", "H"], optimalSteps: 2, difficulty: "easy" },
  { id: "o2", target: "O₂", targetName: "Oxygen Gas",
    sequence: ["O", "O"], optimalSteps: 2, difficulty: "easy" },

  // --- MEDIUM (4-5 steps) ---
  { id: "nh3", target: "NH₃", targetName: "Ammonia",
    sequence: ["N", "H", "H", "H"], optimalSteps: 4, difficulty: "medium" },
  { id: "ch4", target: "CH₄", targetName: "Methane",
    sequence: ["C", "H", "H", "H", "H"], optimalSteps: 5, difficulty: "medium" },
  { id: "h2o2", target: "H₂O₂", targetName: "Hydrogen Peroxide",
    sequence: ["H", "H", "O", "O"], optimalSteps: 4, difficulty: "medium" },
  { id: "so2", target: "SO₂", targetName: "Sulfur Dioxide",
    sequence: ["S", "O", "O"], optimalSteps: 3, difficulty: "medium" },
  { id: "n2o", target: "N₂O", targetName: "Nitrous Oxide",
    sequence: ["N", "N", "O"], optimalSteps: 3, difficulty: "medium" },
  { id: "o3", target: "O₃", targetName: "Ozone",
    sequence: ["O", "O", "O"], optimalSteps: 3, difficulty: "medium" },

  // --- HARD (6-7+ steps) ---
  { id: "h2so4", target: "H₂SO₄", targetName: "Sulfuric Acid",
    sequence: ["H", "H", "S", "O", "O", "O", "O"], optimalSteps: 7, difficulty: "hard" },
  { id: "h3po4", target: "H₃PO₄", targetName: "Phosphoric Acid",
    sequence: ["H", "H", "H", "P", "O", "O", "O", "O"], optimalSteps: 8, difficulty: "hard" },
  { id: "c2h4", target: "C₂H₄", targetName: "Ethylene",
    sequence: ["C", "C", "H", "H", "H", "H"], optimalSteps: 6, difficulty: "hard" },
  { id: "nahco3", target: "NaHCO₃", targetName: "Sodium Bicarbonate",
    sequence: ["Na", "H", "C", "O", "O", "O"], optimalSteps: 6, difficulty: "hard" },
  { id: "hno3", target: "HNO₃", targetName: "Nitric Acid",
    sequence: ["H", "N", "O", "O", "O"], optimalSteps: 5, difficulty: "hard" },
];

const ELEMENT_META = {
  H: { name: "Hydrogen", color: "oklch(0.85 0.18 80)" },
  O: { name: "Oxygen", color: "oklch(0.72 0.22 25)" },
  C: { name: "Carbon", color: "oklch(0.45 0.04 230)" },
  N: { name: "Nitrogen", color: "oklch(0.72 0.18 250)" },
  Na: { name: "Sodium", color: "oklch(0.8 0.16 320)" },
  Cl: { name: "Chlorine", color: "oklch(0.82 0.18 145)" },
  S: { name: "Sulfur", color: "oklch(0.88 0.18 95)" },
  Fe: { name: "Iron", color: "oklch(0.55 0.1 30)" },
  K: { name: "Potassium", color: "oklch(0.78 0.16 280)" },
  Mg: { name: "Magnesium", color: "oklch(0.75 0.12 120)" },
  F: { name: "Fluorine", color: "oklch(0.85 0.2 160)" },
  Li: { name: "Lithium", color: "oklch(0.75 0.15 340)" },
  P: { name: "Phosphorus", color: "oklch(0.7 0.18 40)" },
};

export function elementInfo(sym) {
  const m = ELEMENT_META[sym] ?? { name: sym, color: "oklch(0.6 0.05 220)" };
  return { symbol: sym, ...m };
}

// Deterministic PRNG so both clients render identical inventory from the same seed.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generatePuzzle(seed, difficulty = "easy") {
  const s = seed ?? Math.floor(Math.random() * 1_000_000);
  const rand = mulberry32(s);
  
  // Filter POOL by difficulty, default to easy if not matched or pool empty
  const normDifficulty = (difficulty ?? "easy").toLowerCase();
  const poolByDifficulty = POOL.filter((p) => p.difficulty === normDifficulty);
  const activePool = poolByDifficulty.length > 0 ? poolByDifficulty : POOL;
  
  const base = activePool[Math.floor(rand() * activePool.length)];
  
  // Build inventory: required atoms + decoys, shuffled deterministically.
  const decoyPool = ["H", "O", "C", "N", "Na", "Cl", "S", "Fe", "K", "Mg", "F", "Li", "P"];
  const inventory = [...base.sequence];
  const targetInventorySize = Math.max(8, base.sequence.length + 2);
  
  while (inventory.length < targetInventorySize) {
    inventory.push(decoyPool[Math.floor(rand() * decoyPool.length)]);
  }
  // Shuffle
  for (let i = inventory.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [inventory[i], inventory[j]] = [inventory[j], inventory[i]];
  }
  return { ...base, seed: s, inventory };
}
