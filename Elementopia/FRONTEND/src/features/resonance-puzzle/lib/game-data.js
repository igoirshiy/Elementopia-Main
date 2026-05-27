// ============================================================
// game-data.js — Elements, Domains, and game helper functions
// ============================================================

export const ELEMENTS = {
  H:  { symbol: "H",  name: "Hydrogen",  valence: 1, partners: "Oxygen, Nitrogen, Carbon",
        fact: "1 valence electron — desperate for one more to feel complete. Bonds with almost any nonmetal.",
        gradient: "from-pink-500/80 to-fuchsia-600/80" },
  O:  { symbol: "O",  name: "Oxygen",    valence: 6, partners: "Almost everything",
        fact: "Needs 2 more electrons to fill its shell. Greedy — happily takes from Hydrogen, Carbon, metals, anything.",
        gradient: "from-cyan-400/80 to-sky-600/80" },
  N:  { symbol: "N",  name: "Nitrogen",  valence: 5, partners: "Hydrogen, Oxygen",
        fact: "Needs 3 more electrons. Often pairs with 3 Hydrogens, or forms strong triple bonds with itself.",
        gradient: "from-violet-500/80 to-indigo-600/80" },
  C:  { symbol: "C",  name: "Carbon",    valence: 4, partners: "Almost everything, including itself",
        fact: "4 valence electrons, 4 open bonds. The skeleton of every organic molecule on Earth.",
        gradient: "from-zinc-400/80 to-zinc-700/80" },
  Na: { symbol: "Na", name: "Sodium",    valence: 1, partners: "Chlorine, Oxygen, Hydroxide",
        fact: "A metal with 1 spare electron it desperately wants to give away. Needs a nonmetal that wants to take.",
        gradient: "from-amber-400/80 to-orange-600/80" },
  Cl: { symbol: "Cl", name: "Chlorine",  valence: 7, partners: "Metals like Na and Mg",
        fact: "Needs just 1 more electron. Snatches it from metals — that's an ionic bond.",
        gradient: "from-lime-400/80 to-emerald-600/80" },
  Mg: { symbol: "Mg", name: "Magnesium", valence: 2, partners: "Chlorine, Oxygen",
        fact: "A metal with 2 spare electrons to donate. Needs partners that together can take both.",
        gradient: "from-teal-400/80 to-emerald-600/80" },
  He: { symbol: "He", name: "Helium",    valence: 2, partners: "NONE — noble gas",
        fact: "NOBLE GAS. Its outer shell is already full (2/2). It needs nothing, gives nothing, bonds with nothing. A distractor — do not place it on the workbench.",
        gradient: "from-yellow-300/80 to-yellow-500/80", noble: true },
  Ne: { symbol: "Ne", name: "Neon",      valence: 8, partners: "NONE — noble gas",
        fact: "NOBLE GAS. Outer shell completely full (8/8). Inert — refuses every bond. Glows in signs but never reacts. A distractor.",
        gradient: "from-rose-300/80 to-red-500/80", noble: true },
};

export const DOMAINS = [
  {
    id: "water",
    name: "Water Cavern",
    type: "element",
    tagline: "Covalent bonds. Hydrogen seeks completion.",
    story:
      "Deep beneath the earth, a passage has run dry for centuries. The ancient texts speak of a molecule so fundamental it makes up 71% of Earth's surface — two hydrogen atoms in a loving embrace with one oxygen. But the cavern holds more secrets: hydrogen can bond in other ways too, forming compounds both healing and reactive. Your knowledge of hydrogen's bonding habits is the only key. Beware: not every element in this cavern wants to bond.",
    palette: ["H", "O", "N", "C", "He"],
    required: [
      { formula: "H₂O",  name: "Water",             recipe: { H: 2, O: 1 } },
      { formula: "H₂O₂", name: "Hydrogen Peroxide", recipe: { H: 2, O: 2 } },
      { formula: "NH₃",  name: "Ammonia",           recipe: { H: 3, N: 1 } },
    ],
    validInDomain: ["H", "O", "N"],
    decoys: ["He"],
    accent: "cyan",
  },
  {
    id: "salt",
    name: "Salt Flats",
    type: "compound",
    tagline: "Ionic bonds. Metals surrender electrons.",
    story:
      "The flats are crusted with ionic bonds — metals surrendering electrons to nonmetals in a charged exchange. Sodium, desperate to lose its lone outer electron, seeks partners like Chlorine and Oxygen. Understanding how metals bond ionically will dissolve the crust and open the path. The flats also contain inert gases that look enticing but bond with nothing.",
    palette: ["Na", "Cl", "O", "H", "Mg", "Ne"],
    required: [
      { formula: "NaCl",  name: "Table Salt",         recipe: { Na: 1, Cl: 1 } },
      { formula: "NaOH",  name: "Sodium Hydroxide",   recipe: { Na: 1, O: 1, H: 1 } },
      { formula: "MgCl₂", name: "Magnesium Chloride", recipe: { Mg: 1, Cl: 2 } },
    ],
    validInDomain: ["Na", "Cl", "O", "H", "Mg"],
    decoys: ["Ne"],
    accent: "magenta",
  },
  {
    id: "carbon",
    name: "Carbon Forge",
    type: "compound",
    tagline: "Carbon — four bonds, infinite possibilities.",
    story:
      "Carbon is the backbone of all life — four valence electrons that can bond in four directions simultaneously. Here in the forge, carbon combines with oxygen and hydrogen to form the molecules that fuel every living thing. Master carbon's versatility to survive the heat. Two noble gases drift through the forge as distractions — recognize them by their full outer shells.",
    palette: ["C", "H", "O", "N", "He", "Ne"],
    required: [
      { formula: "CO₂",     name: "Carbon Dioxide", recipe: { C: 1, O: 2 } },
      { formula: "CH₄",     name: "Methane",        recipe: { C: 1, H: 4 } },
      { formula: "C₆H₁₂O₆", name: "Glucose",        recipe: { C: 6, H: 12, O: 6 } },
    ],
    validInDomain: ["C", "H", "O"],
    decoys: ["He", "Ne"],
    accent: "forge",
  },
];

export function getDomain(id) {
  return DOMAINS.find(d => d.id === id);
}

export function matchCompound(workbench, domain) {
  const keys = Object.keys(workbench).filter(k => (workbench[k] ?? 0) > 0);
  for (const c of domain.required) {
    const ckeys = Object.keys(c.recipe);
    if (ckeys.length !== keys.length) continue;
    let ok = true;
    for (const k of ckeys) {
      if ((workbench[k] ?? 0) !== (c.recipe[k] ?? 0)) { ok = false; break; }
    }
    if (ok) return c;
  }
  return null;
}

export function liveCommentary(workbench) {
  const entries = Object.entries(workbench).filter(([, n]) => (n ?? 0) > 0);
  if (entries.length === 0) return "Workbench empty. Click an element to begin reasoning about bonds.";

  const noble = entries.find(([s]) => ELEMENTS[s].noble);
  if (noble) {
    const e = ELEMENTS[noble[0]];
    return `⚠ ${e.name} (${e.symbol}) added — but its outer shell is already full. Noble gases bond with nothing. This will never react.`;
  }

  if (entries.length === 1) {
    const [s, n] = entries[0];
    const e = ELEMENTS[s];
    if (n === 1) return `${s} added — ${e.name} has ${e.valence} valence electron${e.valence === 1 ? "" : "s"}, looking for a partner…`;
    return `${n}× ${s} on the bench — ${e.name} alone can't form a stable compound. It needs a different element to bond with.`;
  }

  const parts = entries.map(([s, n]) => `${n}× ${s}`).join(" + ");
  const detail = entries.map(([s]) => {
    const e = ELEMENTS[s];
    const needs = 8 - e.valence;
    if (e.valence <= 4) return `${e.symbol} has ${e.valence} to give`;
    return `${e.symbol} needs ${needs} more`;
  }).join(", ");

  return `${parts} — ${detail}. Check the ratio: every electron offered should find a home.`;
}

export function explainFailure(workbench) {
  const entries = Object.entries(workbench).filter(([, n]) => (n ?? 0) > 0);
  if (entries.length === 0) return "Empty workbench. Add at least two elements before synthesizing.";

  const symbols = entries.map(([s]) => s);
  const counts = Object.fromEntries(entries);

  const noble = symbols.find(s => ELEMENTS[s].noble);
  if (noble) {
    const e = ELEMENTS[noble];
    return `${e.name} (${e.symbol}) is a noble gas — its outer shell is already full, so it forms no bonds. It's a distractor placed here to test whether you remember the noble gas rule. Remove it.`;
  }
  if (symbols.length === 1 && symbols[0] === "H" && (counts.H ?? 0) >= 2) {
    return "Two hydrogens alone just form H₂ gas, which floats away. Hydrogen is desperately trying to complete itself — pair it with an element that has unfilled outer shells.";
  }
  if (symbols.length === 1 && (counts[symbols[0]] ?? 0) >= 2 && (symbols[0] === "Na" || symbols[0] === "Mg")) {
    return "Two metals can't bond ionically — both want to give electrons away. A metal needs a nonmetal that wants to receive.";
  }
  if (symbols.length === 1 && symbols[0] === "C") {
    return "Carbon bonded only to itself forms graphite or diamond — not what this domain wants. Pair carbon with another element.";
  }
  if (symbols.includes("N") && symbols.includes("H") && symbols.length === 2 && (counts.H ?? 0) < 3) {
    return "Nitrogen needs 3 more electrons; Hydrogen brings 1 each. You're close — count carefully how many Hydrogens Nitrogen actually needs.";
  }
  if (symbols.includes("O") && symbols.includes("H")) {
    return "Right ingredients, wrong arithmetic. Oxygen wants 2 bonds, Hydrogen offers 1 each. Adjust your ratio.";
  }
  if (symbols.includes("C") && symbols.includes("H") && !symbols.includes("O")) {
    return "Carbon + Hydrogen forms hydrocarbons. Carbon wants 4 bonds — make sure every one is satisfied.";
  }
  if (symbols.includes("C") && symbols.includes("O")) {
    return "Carbon and Oxygen combine, but ratios matter. Carbon offers 4 bonds; each Oxygen wants 2. Recount.";
  }
  if (symbols.includes("Na") && symbols.includes("Cl")) {
    return "Sodium gives 1 electron, Chlorine takes 1. The ratio must be exact — no spectators.";
  }
  if (symbols.includes("Mg") && symbols.includes("Cl")) {
    return "Magnesium has 2 electrons to donate. Chlorine takes only 1 each. How many Chlorines does Magnesium actually need?";
  }
  return "These elements don't form anything this domain accepts. Reconsider which atoms actually want each other's electrons.";
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
