export function getDynamicChemistryLesson(workbench) {
  const symbols = Object.keys(workbench).filter(s => workbench[s] > 0);
  if (symbols.length === 0) return "Add elements to the workbench to analyze bonding rules.";

  const hasMetal = symbols.some(s => ["Na", "Mg", "K"].includes(s));
  const hasNonMetal = symbols.some(s => ["H", "O", "N", "C", "Cl"].includes(s));
  const hasNoble = symbols.some(s => ELEMENTS[s]?.noble);

  if (hasNoble) {
    return "Noble gases have full outer electron shells (8/8 or 2/2). They do not participate in chemical bonding!";
  }

  if (hasMetal && hasNonMetal) {
    return "Ionic Bond Rule: Metal atoms surrender outer electrons to non-metal atoms to form stable ionic lattices.";
  }

  if (!hasMetal && hasNonMetal) {
    return "Covalent Bond Rule: Non-metal atoms share valence electrons to achieve stable outer-shell octets.";
  }

  return "Chemical Bonding Rule: Atoms combine to achieve stable, filled outer electron shells.";
}

export const ELEMENTS = {
  H: {
    symbol: "H", name: "Hydrogen", valence: 1, partners: "Oxygen, Nitrogen, Carbon",
    fact: "1 valence electron — desperate for one more to feel complete. Bonds with almost any nonmetal.",
    gradient: "from-pink-500/80 to-fuchsia-600/80"
  },
  O: {
    symbol: "O", name: "Oxygen", valence: 6, partners: "Almost everything",
    fact: "Needs 2 more electrons to fill its shell. Greedy — happily takes from Hydrogen, Carbon, metals, anything.",
    gradient: "from-cyan-400/80 to-sky-600/80"
  },
  N: {
    symbol: "N", name: "Nitrogen", valence: 5, partners: "Hydrogen, Oxygen",
    fact: "Needs 3 more electrons. Often pairs with 3 Hydrogens, or forms strong triple bonds with itself.",
    gradient: "from-violet-500/80 to-indigo-600/80"
  },
  C: {
    symbol: "C", name: "Carbon", valence: 4, partners: "Almost everything, including itself",
    fact: "4 valence electrons, 4 open bonds. The skeleton of every organic molecule on Earth.",
    gradient: "from-zinc-400/80 to-zinc-700/80"
  },
  Na: {
    symbol: "Na", name: "Sodium", valence: 1, partners: "Chlorine, Oxygen, Hydroxide",
    fact: "A metal with 1 spare electron it desperately wants to give away. Needs a nonmetal that wants to take.",
    gradient: "from-amber-400/80 to-orange-600/80"
  },
  Cl: {
    symbol: "Cl", name: "Chlorine", valence: 7, partners: "Metals like Na and Mg",
    fact: "Needs just 1 more electron. Snatches it from metals — that's an ionic bond.",
    gradient: "from-lime-400/80 to-emerald-600/80"
  },
  Mg: {
    symbol: "Mg", name: "Magnesium", valence: 2, partners: "Chlorine, Oxygen",
    fact: "A metal with 2 spare electrons to donate. Needs partners that together can take both.",
    gradient: "from-teal-400/80 to-emerald-600/80"
  },
  He: {
    symbol: "He", name: "Helium", valence: 2, partners: "NONE — noble gas",
    fact: "NOBLE GAS. Its outer shell is already full (2/2). It needs nothing, gives nothing, bonds with nothing. A distractor — do not place it on the workbench.",
    gradient: "from-yellow-300/80 to-yellow-500/80", noble: true
  },
  Ne: {
    symbol: "Ne", name: "Neon", valence: 8, partners: "NONE — noble gas",
    fact: "NOBLE GAS. Outer shell completely full (8/8). Inert — refuses every bond. Glows in signs but never reacts. A distractor.",
    gradient: "from-rose-300/80 to-red-500/80", noble: true
  },
};

export const DOMAINS = [
  {
    id: "covalent",
    name: "Covalent Bonding Cavern",
    type: "element",
    tagline: "Covalent Bonding: Nonmetals sharing valence electron pairs to reach Octet Stability.",
    story:
      "Covalent bonding occurs when two nonmetal atoms share pairs of outer valence electrons to complete their outer shells (Octet Rule). In this cavern, you will explore single, double, and complex organic covalent structures.",
    stages: {
      1: {
        title: "Stage 1: Foundational Binary Covalent Sharing",
        story: "In this surface layer, nonmetals with 1 to 3 missing valence electrons seek partners. Experiment with electron-sharing pairs between 2 elements to reach octet stability. Deduce the ratios based on each atom's valence needs!",
        palette: ["H", "O", "Cl", "N", "He", "Ne"],
        required: [
          { formula: "H₂O", name: "Water", recipe: { H: 2, O: 1 }, localVideo: "/videos/water.mp4" },
          { formula: "H₂O₂", name: "Hydrogen Peroxide", recipe: { H: 2, O: 2 } },
          { formula: "NH₃", name: "Ammonia", recipe: { H: 3, N: 1 }, localVideo: "/videos/ammonia.mp4" },
          { formula: "HCl", name: "Hydrogen Chloride", recipe: { H: 1, Cl: 1 }, localVideo: "/videos/hydrogen_chloride.mp4" },
        ],
        validInDomain: ["H", "O", "N", "Cl"],
      },
      2: {
        title: "Stage 2: Ternary Multiple Bonding & Carbon Sharing",
        story: "As you descend deeper, explore 3-element compounds! Carbon has 4 open valence slots while Oxygen seeks 2 electrons. Nonmetals can share multiple electron pairs simultaneously. Deduce how to balance 3 elements at once!",
        palette: ["H", "O", "N", "C", "Cl", "He"],
        required: [
          { formula: "CO₂", name: "Carbon Dioxide", recipe: { C: 1, O: 2 }, localVideo: "/videos/carbon_dioxide.mp4" },
          { formula: "CH₄", name: "Methane", recipe: { C: 1, H: 4 }, localVideo: "/videos/methane.mp4" },
          { formula: "CH₂O₂", name: "Formic Acid", recipe: { C: 1, H: 2, O: 2 } },
          { formula: "HCN", name: "Hydrogen Cyanide", recipe: { H: 1, C: 1, N: 1 }, localVideo: "/videos/hydrogen%20cyanide.mp4" },
          { formula: "N₂O", name: "Nitrous Oxide", recipe: { N: 2, O: 1 } },
        ],
        validInDomain: ["C", "O", "N", "H"],
      },
      3: {
        title: "Stage 3: Polyatomic Organic Core (4-Element Macromolecules)",
        story: "Entering the domain core, Carbon chains link together into complex 3-and-4 element organic backbones. Combine Carbon, Hydrogen, Nitrogen, and Oxygen in precise ratios so every valence electron finds a partner!",
        palette: ["C", "H", "O", "N", "Cl", "He"],
        required: [
          { formula: "C₆H₁₂O₆", name: "Glucose", recipe: { C: 6, H: 12, O: 6 } },
          { formula: "CH₄N₂O", name: "Urea", recipe: { C: 1, H: 4, N: 2, O: 1 }, localVideo: "/videos/urea.mp4" },
          { formula: "C₂H₅NO₂", name: "Glycine Amino Acid", recipe: { C: 2, H: 5, N: 1, O: 2 } },
          { formula: "C₂H₄O₂", name: "Acetic Acid", recipe: { C: 2, H: 4, O: 2 } },
          { formula: "C₂H₆O", name: "Ethanol", recipe: { C: 2, H: 6, O: 1 } },
          { formula: "HNO₃", name: "Nitric Acid", recipe: { H: 1, N: 1, O: 3 }, localVideo: "/videos/nitric%20acid.mp4" },
        ],
        validInDomain: ["C", "H", "O", "N"],
      }
    },
    accent: "cyan",
  },

  {
    id: "salt",
    name: "Ionic Bonding Salt Flats",
    type: "compound",
    tagline: "Ionic Bonding: Metal electron donation to Nonmetal acceptors forming charged lattices.",
    story:
      "Ionic bonding occurs when electropositive metals surrender valence electrons to electronegative nonmetals, creating oppositely charged ions (cations and anions) that attract into rigid crystal lattices.",
    stages: {
      1: {
        title: "Stage 1: Binary 1:1 Electron Transfer",
        story: "In the surface salt flats, electropositive metals surrender outer valence electrons to nonmetal acceptors. Deduce how 2 elements balance electrons to form neutral binary ionic compounds!",
        palette: ["Na", "Cl", "O", "H", "Mg", "Ne"],
        required: [
          { formula: "NaCl", name: "Table Salt", recipe: { Na: 1, Cl: 1 }, localVideo: "/videos/sodium%20chloride.mp4" },
          { formula: "Na₂O", name: "Sodium Oxide", recipe: { Na: 2, O: 1 }, localVideo: "/videos/sodium%20oxide.mp4" },
        ],
        validInDomain: ["Na", "Cl", "O"],
      },
      2: {
        title: "Stage 2: Ternary Metal & Polyatomic Ions",
        story: "Deeper in the flats, explore 3-element ionic salts! Divalent metals like Magnesium (Mg, 2 valence e⁻) surrender electrons across polyatomic groups. Determine the correct ratio for 3 elements!",
        palette: ["Mg", "Cl", "O", "Na", "H", "Ne"],
        required: [
          { formula: "MgCl₂", name: "Magnesium Chloride", recipe: { Mg: 1, Cl: 2 }, localVideo: "/videos/magnesium%20chloride.mp4" },
          { formula: "MgO", name: "Magnesium Oxide", recipe: { Mg: 1, O: 1 }, localVideo: "/videos/magnesium%20oxide.mp4" },
          { formula: "NaOH", name: "Sodium Hydroxide", recipe: { Na: 1, O: 1, H: 1 }, localVideo: "/videos/sodium_hydroxide.mp4" },
          { formula: "Mg(OH)₂", name: "Magnesium Hydroxide", recipe: { Mg: 1, O: 2, H: 2 }, localVideo: "/videos/magnesium_hydroxide.mp4" },
        ],
        validInDomain: ["Mg", "Cl", "O", "Na", "H"],
      },
      3: {
        title: "Stage 3: Polyatomic Bicarbonate & Complex Core (4-Element Lattices)",
        story: "Entering the core salt cave, metals bind 3-and-4 element polyatomic groups like bicarbonate and ammonium. Deduce the exact element ratios needed to stabilize the ionic crystal!",
        palette: ["Na", "H", "C", "O", "Mg", "Cl"],
        required: [
          { formula: "NaHCO₃", name: "Baking Soda", recipe: { Na: 1, H: 1, C: 1, O: 3 } },
          { formula: "NH₄Cl", name: "Ammonium Chloride", recipe: { N: 1, H: 4, Cl: 1 } },
          { formula: "NaNO₃", name: "Sodium Nitrate", recipe: { Na: 1, N: 1, O: 3 } },
          { formula: "MgCO₃", name: "Magnesium Carbonate", recipe: { Mg: 1, C: 1, O: 3 }, localVideo: "/videos/magnesium_carbonate.mp4" },
          { formula: "Mg(OH)₂", name: "Magnesium Hydroxide", recipe: { Mg: 1, O: 2, H: 2 }, localVideo: "/videos/magnesium_hydroxide.mp4" },
          { formula: "Na₂CO₃", name: "Sodium Carbonate", recipe: { Na: 2, C: 1, O: 3 }, localVideo: "/videos/sodium_carbonate.mp4" },
          { formula: "NaOH", name: "Sodium Hydroxide", recipe: { Na: 1, O: 1, H: 1 }, localVideo: "/videos/sodium_hydroxide.mp4" },
        ],
        validInDomain: ["Na", "H", "C", "O", "Mg", "N", "Cl"],
      }
    },
    accent: "magenta",
  },

  {
    id: "carbon",
    name: "Carbon Tetravalence & Noble Gas Inertness",
    type: "compound",
    tagline: "Carbon Tetravalence: 4 Open Covalent Slots vs Inert Noble Gas Full Shells.",
    story:
      "Carbon possesses 4 valence electrons and requires 4 shared electrons to complete its octet, making it the building block of organic chemistry. Meanwhile, Noble Gases (He, Ne) have completely full shells and remain inert.",
    stages: {
      1: {
        title: "Stage 1: Binary Tetravalent Sharing",
        story: "Carbon possesses 4 open valence slots and requires 4 shared electrons to complete its octet. Combine Carbon with 1 other element while avoiding inert Noble Gas distractors (He, Ne)!",
        palette: ["C", "H", "O", "He", "Ne", "Cl"],
        required: [
          { formula: "CH₄", name: "Methane", recipe: { C: 1, H: 4 }, localVideo: "/videos/methane.mp4" },
          { formula: "CO₂", name: "Carbon Dioxide", recipe: { C: 1, O: 2 }, localVideo: "/videos/carbon_dioxide.mp4" },
          { formula: "C₂H₂", name: "Acetylene", recipe: { C: 2, H: 2 }, localVideo: "/videos/ethyne.mp4" },
        ],
        validInDomain: ["C", "H", "O"],
      },
      2: {
        title: "Stage 2: Ternary Carbon-Oxygen Hydrocarbons",
        story: "As you descend deeper, Carbon forms dual double bonds with Oxygen and Hydrogen simultaneously across 3 elements. Figure out the ratio between Carbon, Hydrogen, and Oxygen!",
        palette: ["C", "O", "H", "N", "He", "Ne"],
        required: [
          { formula: "CH₂O", name: "Formaldehyde", recipe: { C: 1, H: 2, O: 1 }, localVideo: "/videos/formaldehye.mp4" },
          { formula: "CH₄O", name: "Methanol", recipe: { C: 1, H: 4, O: 1 }, localVideo: "/videos/methanol.mp4" },
          { formula: "C₂H₄O₂", name: "Acetic Acid", recipe: { C: 2, H: 4, O: 2 } },
          { formula: "HCN", name: "Hydrogen Cyanide", recipe: { H: 1, C: 1, N: 1 }, localVideo: "/videos/hydrogen%20cyanide.mp4" },
          { formula: "CO₂", name: "Carbon Dioxide", recipe: { C: 1, O: 2 }, localVideo: "/videos/carbon_dioxide.mp4" },
        ],
        validInDomain: ["C", "O", "H", "N"],
      },
      3: {
        title: "Stage 3: Polyatomic Macromolecular Core (4-Element Organic Backbones)",
        story: "Entering the core, Carbon chains link together into complex 4-element organic macromolecules. Deduce the exact ratios of Carbon, Hydrogen, Nitrogen, and Oxygen required to synthesize life building blocks!",
        palette: ["C", "H", "O", "N", "Cl", "He"],
        required: [
          { formula: "C₆H₁₂O₆", name: "Glucose", recipe: { C: 6, H: 12, O: 6 } },
          { formula: "C₂H₅NO₂", name: "Glycine Amino Acid", recipe: { C: 2, H: 5, N: 1, O: 2 } },
          { formula: "CH₄N₂O", name: "Urea", recipe: { C: 1, H: 4, N: 2, O: 1 }, localVideo: "/videos/urea.mp4" },
          { formula: "C₃H₈O₃", name: "Glycerol", recipe: { C: 3, H: 8, O: 3 } },
          { formula: "C₂H₆O", name: "Ethanol", recipe: { C: 2, H: 6, O: 1 } },
          { formula: "C₂H₄O₂", name: "Vinegar", recipe: { C: 2, H: 4, O: 2 } },
        ],
        validInDomain: ["C", "H", "O", "N"],
      }
    },
    accent: "violet",
  }
];

export function getDomain(id) {
  return DOMAINS.find(d => d.id === id);
}

export function matchCompound(workbench, domain, currentStage = 1) {
  const keys = Object.keys(workbench).filter(k => (workbench[k] ?? 0) > 0);

  const isMatch = (c) => {
    const ckeys = Object.keys(c.recipe);
    if (ckeys.length !== keys.length) return false;
    for (const k of ckeys) {
      if ((workbench[k] ?? 0) !== (c.recipe[k] ?? 0)) return false;
    }
    return true;
  };

  // 1. Check current stage first
  const requiredList = domain?.stages ? (domain.stages[currentStage]?.required || domain.stages[1]?.required) : domain?.required;
  if (requiredList) {
    for (const c of requiredList) {
      if (isMatch(c)) return c;
    }
  }

  // 2. Global fallback: search all domains and stages
  for (const d of DOMAINS) {
    if (d.stages) {
      for (const stageKey in d.stages) {
        if (!d.stages[stageKey].required) continue;
        for (const c of d.stages[stageKey].required) {
          if (isMatch(c)) return c;
        }
      }
    } else if (d.required) {
      for (const c of d.required) {
        if (isMatch(c)) return c;
      }
    }
  }

  return null;
}

export function isCompoundInCurrentStage(workbench, domain, currentStage = 1) {
  const keys = Object.keys(workbench).filter(k => (workbench[k] ?? 0) > 0);

  const isMatch = (c) => {
    const ckeys = Object.keys(c.recipe);
    if (ckeys.length !== keys.length) return false;
    for (const k of ckeys) {
      if ((workbench[k] ?? 0) !== (c.recipe[k] ?? 0)) return false;
    }
    return true;
  };

  const requiredList = domain?.stages ? (domain.stages[currentStage]?.required || domain.stages[1]?.required) : domain?.required;
  if (requiredList) {
    for (const c of requiredList) {
      if (isMatch(c)) return true;
    }
  }
  return false;
}

export function isCompoundInDomain(workbench, domain) {
  const keys = Object.keys(workbench).filter(k => (workbench[k] ?? 0) > 0);

  const isMatch = (c) => {
    const ckeys = Object.keys(c.recipe);
    if (ckeys.length !== keys.length) return false;
    for (const k of ckeys) {
      if ((workbench[k] ?? 0) !== (c.recipe[k] ?? 0)) return false;
    }
    return true;
  };

  if (domain.stages) {
    for (const stageKey in domain.stages) {
      if (!domain.stages[stageKey].required) continue;
      for (const c of domain.stages[stageKey].required) {
        if (isMatch(c)) return true;
      }
    }
  } else if (domain.required) {
    for (const c of domain.required) {
      if (isMatch(c)) return true;
    }
  }
  return false;
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
