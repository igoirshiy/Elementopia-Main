// Competitive chemistry puzzle pool.
// Each puzzle: a target compound, the exact element sequence required (optimal path),
// and an inventory of element tiles (with decoys).

const POOL = [
  { id: "h2o", target: "H₂O", targetName: "Water",
    sequence: ["H", "H", "O"], optimalSteps: 3 },
  { id: "co2", target: "CO₂", targetName: "Carbon Dioxide",
    sequence: ["C", "O", "O"], optimalSteps: 3 },
  { id: "nacl", target: "NaCl", targetName: "Salt",
    sequence: ["Na", "Cl"], optimalSteps: 2 },
  { id: "nh3", target: "NH₃", targetName: "Ammonia",
    sequence: ["N", "H", "H", "H"], optimalSteps: 4 },
  { id: "ch4", target: "CH₄", targetName: "Methane",
    sequence: ["C", "H", "H", "H", "H"], optimalSteps: 5 },
  { id: "h2so4", target: "H₂SO₄", targetName: "Sulfuric Acid",
    sequence: ["H", "H", "S", "O", "O", "O", "O"], optimalSteps: 7 },
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

export function generatePuzzle(seed) {
  const s = seed ?? Math.floor(Math.random() * 1_000_000);
  const rand = mulberry32(s);
  const base = POOL[Math.floor(rand() * POOL.length)];
  // Build inventory: required atoms + decoys, shuffled deterministically.
  const decoyPool = ["H", "O", "C", "N", "Na", "Cl", "S", "Fe", "K"];
  const inventory = [...base.sequence];
  while (inventory.length < 8) {
    inventory.push(decoyPool[Math.floor(rand() * decoyPool.length)]);
  }
  // Shuffle
  for (let i = inventory.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [inventory[i], inventory[j]] = [inventory[j], inventory[i]];
  }
  return { ...base, seed: s, inventory };
}
