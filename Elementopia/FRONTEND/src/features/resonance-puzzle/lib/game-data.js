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
          { formula: "H₂O", name: "Water", recipe: { H: 2, O: 1 }, missionRole: "Cooling Solvent", clue: "The cavern heat is rising! Synthesize the universal cooling solvent to lower the temperature.", hint: "Oxygen (needs 2 e⁻) pairs with 2 Hydrogen atoms (2× H + 1× O).", localVideo: "/videos/water.mp4" },
          { formula: "H₂O₂", name: "Hydrogen Peroxide", recipe: { H: 2, O: 2 }, missionRole: "Disinfectant Oxidizer", clue: "Sterilize the toxic fungal spore barrier blocking the passage!", hint: "Two Oxygen atoms form a bridge, each holding one Hydrogen (2× H + 2× O)." },
          { formula: "NH₃", name: "Ammonia", recipe: { H: 3, N: 1 }, missionRole: "Alkaline Neutralizer", clue: "Neutralize the sharp acidic vapors lingering in the cavern air!", hint: "Nitrogen (needs 3 e⁻) shares single bonds with 3 Hydrogens (3× H + 1× N).", localVideo: "/videos/ammonia.mp4" },
          { formula: "HCl", name: "Hydrogen Chloride", recipe: { H: 1, Cl: 1 }, missionRole: "Mineral Dissolver", clue: "Dissolve the tough limestone crust sealing the chamber door!", hint: "Chlorine (needs 1 e⁻) shares 1 electron pair with Hydrogen (1× H + 1× Cl).", localVideo: "/videos/hydrogen_chloride.mp4" },
        ],
        validInDomain: ["H", "O", "N", "Cl"],
      },
      2: {
        title: "Stage 2: Ternary Multiple Bonding & Carbon Sharing",
        story: "As you descend deeper, explore 3-element compounds! Carbon has 4 open valence slots while Oxygen seeks 2 electrons. Nonmetals can share multiple electron pairs simultaneously. Deduce how to balance 3 elements at once!",
        palette: ["H", "O", "N", "C", "Cl", "He"],
        required: [
          { formula: "CO₂", name: "Carbon Dioxide", recipe: { C: 1, O: 2 }, missionRole: "Fire Extinguisher", clue: "Fill the fire suppression nozzles with non-flammable gas to extinguish the flames!", hint: "Carbon shares two double bonds with 2 Oxygen atoms (1× C + 2× O).", localVideo: "/videos/carbon_dioxide.mp4" },
          { formula: "CH₄", name: "Methane", recipe: { C: 1, H: 4 }, missionRole: "Clean Fuel", clue: "Power up the thermal generator with the simplest tetrahedral hydrocarbon gas!", hint: "Carbon forms 4 single covalent bonds with 4 Hydrogens (1× C + 4× H).", localVideo: "/videos/methane.mp4" },
          { formula: "CH₂O₂", name: "Formic Acid", recipe: { C: 1, H: 2, O: 2 }, missionRole: "Organic Etching Agent", clue: "Synthesize the defense acid found in natural ant venom to etch through glass!", hint: "Combine 1 Carbon, 2 Hydrogens, and 2 Oxygens in a stable octet (1× C + 2× H + 2× O)." },
          { formula: "HCN", name: "Hydrogen Cyanide", recipe: { H: 1, C: 1, N: 1 }, missionRole: "Volatile Precursor", clue: "Synthesize the linear precursor with a strong carbon-nitrogen triple bond!", hint: "1 Hydrogen single-bonded to Carbon, triple-bonded to Nitrogen (1× H + 1× C + 1× N).", localVideo: "/videos/hydrogen%20cyanide.mp4" },
          { formula: "N₂O", name: "Nitrous Oxide", recipe: { N: 2, O: 1 }, missionRole: "Resonance Gas", clue: "Synthesize the calming laughing gas to neutralize chamber pressure oscillations!", hint: "2 Nitrogen atoms resonance-bonded to 1 Oxygen atom (2× N + 1× O)." },
        ],
        validInDomain: ["C", "O", "N", "H"],
      },
      3: {
        title: "Stage 3: Polyatomic Organic Core (4-Element Macromolecules)",
        story: "Entering the domain core, Carbon chains link together into complex 3-and-4 element organic backbones. Combine Carbon, Hydrogen, Nitrogen, and Oxygen in precise ratios so every valence electron finds a partner!",
        palette: ["C", "H", "O", "N", "Cl", "He"],
        required: [
          { formula: "C₆H₁₂O₆", name: "Glucose", recipe: { C: 6, H: 12, O: 6 }, missionRole: "Cellular Energy Sugar", clue: "Synthesize the primary cellular energy fuel to reactivate the bioluminescent crystals!", hint: "6 Carbons, 12 Hydrogens, and 6 Oxygens (6× C + 12× H + 6× O)." },
          { formula: "CH₄N₂O", name: "Urea", recipe: { C: 1, H: 4, N: 2, O: 1 }, missionRole: "Organic Milestone", clue: "Synthesize the historical compound that proved organic molecules can be created in a lab!", hint: "1 Carbon, 4 Hydrogens, 2 Nitrogens, and 1 Oxygen (1× C + 4× H + 2× N + 1× O).", localVideo: "/videos/urea.mp4" },
          { formula: "C₂H₅NO₂", name: "Glycine Amino Acid", recipe: { C: 2, H: 5, N: 1, O: 2 }, missionRole: "Protein Building Block", clue: "Build the foundational amino acid needed to repair the organic seal!", hint: "2 Carbons, 5 Hydrogens, 1 Nitrogen, and 2 Oxygens (2× C + 5× H + 1× N + 2× O)." },
          { formula: "C₂H₄O₂", name: "Acetic Acid", recipe: { C: 2, H: 4, O: 2 }, missionRole: "Fermentation Acid", clue: "Synthesize the pungent acid found in vinegar to balance pH levels!", hint: "2 Carbons, 4 Hydrogens, and 2 Oxygens (2× C + 4× H + 2× O)." },
          { formula: "C₂H₆O", name: "Ethanol", recipe: { C: 2, H: 6, O: 1 }, missionRole: "Bio-Alcohol Solvent", clue: "Produce the versatile renewable bio-alcohol solvent to clean delicate sensors!", hint: "2 Carbons, 6 Hydrogens, and 1 Oxygen (2× C + 6× H + 1× O)." },
          { formula: "HNO₃", name: "Nitric Acid", recipe: { H: 1, N: 1, O: 3 }, missionRole: "Strong Oxidizing Acid", clue: "Produce the powerful oxidizing acid to dissolve high-density mineral ores!", hint: "1 Hydrogen, 1 Nitrogen, and 3 Oxygens (1× H + 1× N + 3× O).", localVideo: "/videos/nitric%20acid.mp4" },
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
        title: "Stage 1: Binary Electron Transfer",
        story: "In the surface salt flats, electropositive metals surrender outer valence electrons to nonmetal acceptors. Deduce how 2 elements balance electrons to form neutral binary ionic compounds!",
        palette: ["Na", "Cl", "O", "H", "Mg", "Ne"],
        required: [
          { formula: "NaCl", name: "Table Salt", recipe: { Na: 1, Cl: 1 }, missionRole: "Electrolyte Crystal", clue: "Crystallize the foundational ionic mineral to stabilize the salt flat ground!", hint: "1 Sodium metal donates 1 e⁻ to 1 Chlorine nonmetal (1× Na + 1× Cl).", localVideo: "/videos/sodium%20chloride.mp4" },
          { formula: "Na₂O", name: "Sodium Oxide", recipe: { Na: 2, O: 1 }, missionRole: "Alkaline Oxide", clue: "Synthesize the strong basic oxide crystal to neutralize acidic brine!", hint: "Oxygen needs 2 electrons; balance with 2 Sodium donors (2× Na + 1× O).", localVideo: "/videos/sodium%20oxide.mp4" },
          { formula: "MgO", name: "Magnesium Oxide", recipe: { Mg: 1, O: 1 }, missionRole: "Refractory Shield", clue: "Form the ultra-heat resistant refractory mineral to shield against magma heat!", hint: "Magnesium (+2 donation) balances Oxygen (-2 acceptance) (1× Mg + 1× O).", localVideo: "/videos/magnesium%20oxide.mp4" },
          { formula: "MgCl₂", name: "Magnesium Chloride", recipe: { Mg: 1, Cl: 2 }, missionRole: "Desiccant Salt", clue: "Synthesize the moisture-absorbing brine salt to prevent humidity short-circuits!", hint: "1 Magnesium metal donates 2 electrons to 2 Chlorine atoms (1× Mg + 2× Cl).", localVideo: "/videos/magnesium%20chloride.mp4" },
        ],
        validInDomain: ["Na", "Cl", "O", "Mg"],
      },
      2: {
        title: "Stage 2: Ternary Metal & Polyatomic Ions",
        story: "Deeper in the flats, explore 3-element ionic salts! Divalent metals like Magnesium (Mg, 2 valence e⁻) and alkali metals surrender electrons across polyatomic groups. Determine the correct ratio for 3 elements!",
        palette: ["Mg", "Cl", "O", "Na", "H", "C", "Ne"],
        required: [
          { formula: "NaOH", name: "Sodium Hydroxide", recipe: { Na: 1, O: 1, H: 1 }, missionRole: "Caustic Lye Base", clue: "Synthesize the potent caustic lye to clear away stubborn grease blockages!", hint: "1 Sodium cation binds 1 Hydroxide polyatomic anion (1× Na + 1× O + 1× H).", localVideo: "/videos/sodium_hydroxide.mp4" },
          { formula: "Mg(OH)₂", name: "Magnesium Hydroxide", recipe: { Mg: 1, O: 2, H: 2 }, missionRole: "Milk of Magnesia", clue: "Form the soothing antacid compound to coat and protect delicate pipelines!", hint: "1 Magnesium metal (+2) balances 2 Hydroxide groups (1× Mg + 2× O + 2× H).", localVideo: "/videos/magnesium_hydroxide.mp4" },
          { formula: "Na₂CO₃", name: "Sodium Carbonate", recipe: { Na: 2, C: 1, O: 3 }, missionRole: "Washing Soda", clue: "Synthesize washing soda crystals to precipitate hard mineral ions out of water!", hint: "2 Sodium cations balance 1 Carbonate anion (2× Na + 1× C + 3× O).", localVideo: "/videos/sodium_carbonate.mp4" },
          { formula: "MgCO₃", name: "Magnesium Carbonate", recipe: { Mg: 1, C: 1, O: 3 }, missionRole: "Insoluble Carbonate", clue: "Create the natural chalk mineral deposit to absorb excess humidity!", hint: "1 Magnesium (+2) binds 1 Carbonate (-2) group (1× Mg + 1× C + 3× O).", localVideo: "/videos/magnesium_carbonate.mp4" },
        ],
        validInDomain: ["Mg", "Cl", "O", "Na", "H", "C"],
      },
      3: {
        title: "Stage 3: Polyatomic Bicarbonate & Complex Core (4-Element Lattices)",
        story: "Entering the core salt cave, metals bind 3-and-4 element polyatomic groups like bicarbonate and ammonium. Deduce the exact element ratios needed to stabilize the ionic crystal!",
        palette: ["Na", "H", "C", "O", "Mg", "Cl", "N"],
        required: [
          { formula: "NaHCO₃", name: "Baking Soda", recipe: { Na: 1, H: 1, C: 1, O: 3 }, missionRole: "pH Buffer & Leavener", clue: "Synthesize sodium bicarbonate to buffer the corrosive acid lake!", hint: "1 Sodium, 1 Hydrogen, 1 Carbon, and 3 Oxygens (1× Na + 1× H + 1× C + 3× O)." },
          { formula: "NH₄Cl", name: "Ammonium Chloride", recipe: { N: 1, H: 4, Cl: 1 }, missionRole: "Volatile Sal Ammoniac", clue: "Synthesize the ionic salt composed of an ammonium cation and chloride anion!", hint: "1 Nitrogen, 4 Hydrogens, and 1 Chlorine (1× N + 4× H + 1× Cl)." },
          { formula: "NaNO₃", name: "Sodium Nitrate", recipe: { Na: 1, N: 1, O: 3 }, missionRole: "Chile Saltpeter", clue: "Form the nitrate salt required for chemical resonance fuel synthesis!", hint: "1 Sodium, 1 Nitrogen, and 3 Oxygens (1× Na + 1× N + 3× O)." },
          { formula: "MgCO₃", name: "Magnesium Carbonate", recipe: { Mg: 1, C: 1, O: 3 }, missionRole: "Chalk Mineral", clue: "Form the durable carbonate mineral to pave the core pathway!", hint: "1 Magnesium, 1 Carbon, and 3 Oxygens (1× Mg + 1× C + 3× O).", localVideo: "/videos/magnesium_carbonate.mp4" },
          { formula: "Mg(OH)₂", name: "Magnesium Hydroxide", recipe: { Mg: 1, O: 2, H: 2 }, missionRole: "Protective Hydroxide", clue: "Synthesize magnesium hydroxide to seal the conduit cracks!", hint: "1 Magnesium, 2 Oxygens, and 2 Hydrogens (1× Mg + 2× O + 2× H).", localVideo: "/videos/magnesium_hydroxide.mp4" },
          { formula: "Na₂CO₃", name: "Sodium Carbonate", recipe: { Na: 2, C: 1, O: 3 }, missionRole: "Soda Ash", clue: "Refine soda ash to glassify the glowing silica pillars!", hint: "2 Sodiums, 1 Carbon, and 3 Oxygens (2× Na + 1× C + 3× O).", localVideo: "/videos/sodium_carbonate.mp4" },
          { formula: "NaOH", name: "Sodium Hydroxide", recipe: { Na: 1, O: 1, H: 1 }, missionRole: "Caustic Catalyst", clue: "Produce sodium hydroxide to initiate the core crystallization!", hint: "1 Sodium, 1 Oxygen, and 1 Hydrogen (1× Na + 1× O + 1× H).", localVideo: "/videos/sodium_hydroxide.mp4" },
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
          { formula: "CH₄", name: "Methane", recipe: { C: 1, H: 4 }, missionRole: "Natural Gas", clue: "Synthesize the simplest saturated hydrocarbon to power the carbon engine!", hint: "Carbon needs 4 bonds; connect 4 Hydrogen atoms (1× C + 4× H).", localVideo: "/videos/methane.mp4" },
          { formula: "CO₂", name: "Carbon Dioxide", recipe: { C: 1, O: 2 }, missionRole: "Plant Nutrient Gas", clue: "Produce the dense gas needed to feed the underground hydroponic flora!", hint: "Carbon shares 2 double bonds with 2 Oxygen atoms (1× C + 2× O).", localVideo: "/videos/carbon_dioxide.mp4" },
          { formula: "C₂H₂", name: "Acetylene", recipe: { C: 2, H: 2 }, missionRole: "Torch Gas", clue: "Synthesize the ultra-hot welding gas containing a carbon-carbon triple bond!", hint: "2 Carbons sharing a triple bond with 2 Hydrogens (2× C + 2× H).", localVideo: "/videos/ethyne.mp4" },
        ],
        validInDomain: ["C", "H", "O"],
      },
      2: {
        title: "Stage 2: Ternary Carbon-Oxygen Hydrocarbons",
        story: "As you descend deeper, Carbon forms dual double bonds with Oxygen and Hydrogen simultaneously across 3 elements. Figure out the ratio between Carbon, Hydrogen, and Oxygen!",
        palette: ["C", "O", "H", "N", "He", "Ne"],
        required: [
          { formula: "CH₂O", name: "Formaldehyde", recipe: { C: 1, H: 2, O: 1 }, missionRole: "Preservative Aldehyde", clue: "Synthesize the planar aldehyde molecule used to preserve biological specimens!", hint: "1 Carbon double-bonded to Oxygen and single-bonded to 2 Hydrogens (1× C + 2× H + 1× O).", localVideo: "/videos/formaldehye.mp4" },
          { formula: "CH₄O", name: "Methanol", recipe: { C: 1, H: 4, O: 1 }, missionRole: "Wood Alcohol", clue: "Synthesize clean wood alcohol fuel to charge the backup generator!", hint: "1 Carbon, 4 Hydrogens, and 1 Oxygen (1× C + 4× H + 1× O).", localVideo: "/videos/methanol.mp4" },
          { formula: "C₂H₄O₂", name: "Acetic Acid", recipe: { C: 2, H: 4, O: 2 }, missionRole: "Carboxylic Acid", clue: "Synthesize the pure carboxylic acid found in vinegar to clean oxidized plates!", hint: "2 Carbons, 4 Hydrogens, and 2 Oxygens (2× C + 4× H + 2× O)." },
          { formula: "HCN", name: "Hydrogen Cyanide", recipe: { H: 1, C: 1, N: 1 }, missionRole: "Organic Intermediate", clue: "Deduce the high-energy triple-bonded nitrile compound!", hint: "1 Hydrogen, 1 Carbon, and 1 Nitrogen (1× H + 1× C + 1× N).", localVideo: "/videos/hydrogen%20cyanide.mp4" },
          { formula: "CO₂", name: "Carbon Dioxide", recipe: { C: 1, O: 2 }, missionRole: "Heavy Atmosphere Gas", clue: "Synthesize carbon dioxide to test the life-support scrubber systems!", hint: "1 Carbon atom with 2 Oxygen atoms (1× C + 2× O).", localVideo: "/videos/carbon_dioxide.mp4" },
        ],
        validInDomain: ["C", "O", "H", "N"],
      },
      3: {
        title: "Stage 3: Polyatomic Macromolecular Core (4-Element Organic Backbones)",
        story: "Entering the core, Carbon chains link together into complex 4-element organic macromolecules. Deduce the exact ratios of Carbon, Hydrogen, Nitrogen, and Oxygen required to synthesize life building blocks!",
        palette: ["C", "H", "O", "N", "Cl", "He"],
        required: [
          { formula: "C₆H₁₂O₆", name: "Glucose", recipe: { C: 6, H: 12, O: 6 }, missionRole: "Life Fuel Sugar", clue: "Synthesize glucose sugar to nourish the core synthetic ecosystem!", hint: "6 Carbons, 12 Hydrogens, and 6 Oxygens (6× C + 12× H + 6× O)." },
          { formula: "C₂H₅NO₂", name: "Glycine Amino Acid", recipe: { C: 2, H: 5, N: 1, O: 2 }, missionRole: "Basic Amino Acid", clue: "Construct the fundamental amino acid building block of proteins!", hint: "2 Carbons, 5 Hydrogens, 1 Nitrogen, and 2 Oxygens (2× C + 5× H + 1× N + 2× O)." },
          { formula: "CH₄N₂O", name: "Urea", recipe: { C: 1, H: 4, N: 2, O: 1 }, missionRole: "Synthetic Organic Salt", clue: "Form the nitrogenous organic compound to neutralize alkaline runoff!", hint: "1 Carbon, 4 Hydrogens, 2 Nitrogens, and 1 Oxygen (1× C + 4× H + 2× N + 1× O).", localVideo: "/videos/urea.mp4" },
          { formula: "C₃H₈O₃", name: "Glycerol", recipe: { C: 3, H: 8, O: 3 }, missionRole: "Lipid Backbone", clue: "Synthesize the sweet triol backbone essential for cell membranes!", hint: "3 Carbons, 8 Hydrogens, and 3 Oxygens (3× C + 8× H + 3× O)." },
          { formula: "C₂H₆O", name: "Ethanol", recipe: { C: 2, H: 6, O: 1 }, missionRole: "Bio-Fuel", clue: "Produce bio-ethanol to calibrate high-octane combustion thrusters!", hint: "2 Carbons, 6 Hydrogens, and 1 Oxygen (2× C + 6× H + 1× O)." },
          { formula: "C₂H₄O₂", name: "Vinegar", recipe: { C: 2, H: 4, O: 2 }, missionRole: "Vinegar Acid", clue: "Synthesize natural vinegar acid to dissolve mineral buildup!", hint: "2 Carbons, 4 Hydrogens, and 2 Oxygens (2× C + 4× H + 2× O)." },
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

  const requiredList = domain?.stages ? (domain.stages[currentStage]?.required || domain.stages[1]?.required) : domain?.required;
  if (requiredList) {
    for (const c of requiredList) {
      if (isMatch(c)) return c;
    }
  }

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

export function calculateValenceStatus(workbench = {}) {
  const entries = Object.entries(workbench).filter(([, n]) => (n ?? 0) > 0);
  if (entries.length === 0) {
    return {
      status: "empty",
      message: "Click elements below to add them to the workbench.",
      slotsNeeded: 0,
      slotsFilled: 0,
      balanced: false,
      isNoble: false
    };
  }

  const nobleEntry = entries.find(([s]) => ELEMENTS[s]?.noble);
  if (nobleEntry) {
    const el = ELEMENTS[nobleEntry[0]];
    return {
      status: "noble",
      message: `${el.name} (${el.symbol}) is an inert Noble Gas with a complete outer shell. It cannot bond!`,
      slotsNeeded: 0,
      slotsFilled: 0,
      balanced: false,
      isNoble: true
    };
  }

  let totalBondsNeeded = 0;
  let totalBondsSupplied = 0;
  let metalDonation = 0;
  let nonmetalAcceptance = 0;
  let hasMetals = false;
  let hasNonMetals = false;

  entries.forEach(([sym, count]) => {
    const el = ELEMENTS[sym];
    if (!el) return;
    const isMet = ["Na", "Mg", "K", "Ca", "Fe"].includes(sym);
    if (isMet) {
      hasMetals = true;
      metalDonation += el.valence * count;
    } else {
      hasNonMetals = true;
      if (sym === "H") {
        totalBondsSupplied += 1 * count;
        nonmetalAcceptance += 1 * count;
      } else if (sym === "C") {
        totalBondsNeeded += 4 * count;
      } else if (sym === "N") {
        totalBondsNeeded += 3 * count;
        nonmetalAcceptance += 3 * count;
      } else if (sym === "O") {
        totalBondsNeeded += 2 * count;
        nonmetalAcceptance += 2 * count;
      } else if (sym === "Cl") {
        totalBondsNeeded += 1 * count;
        nonmetalAcceptance += 1 * count;
      }
    }
  });

  // Metal + Metal clash
  if (hasMetals && !hasNonMetals) {
    return {
      status: "metal_clash",
      message: "Two metal atoms cannot form a salt alone! Metals need nonmetal acceptors (like Cl or O).",
      slotsNeeded: metalDonation,
      slotsFilled: 0,
      balanced: false,
      isNoble: false
    };
  }

  // Ionic Bond evaluation
  if (hasMetals && hasNonMetals) {
    const diff = metalDonation - nonmetalAcceptance;
    if (diff === 0 && metalDonation > 0) {
      return {
        status: "balanced",
        message: `Electrons Donated (${metalDonation} e⁻) = Electrons Accepted (${nonmetalAcceptance} e⁻). Neutral ionic crystal ready!`,
        slotsNeeded: metalDonation,
        slotsFilled: metalDonation,
        balanced: true,
        isNoble: false
      };
    } else if (diff < 0) {
      const missingMetals = Math.abs(diff);
      return {
        status: "incomplete",
        message: `Nonmetals need ${missingMetals} more electron${missingMetals > 1 ? "s" : ""}! Add more metal donor atoms.`,
        slotsNeeded: nonmetalAcceptance,
        slotsFilled: metalDonation,
        balanced: false,
        isNoble: false
      };
    } else {
      return {
        status: "incomplete",
        message: `Surplus ${diff} metal electron${diff > 1 ? "s" : ""} without an acceptor. Add more nonmetal atoms.`,
        slotsNeeded: metalDonation,
        slotsFilled: nonmetalAcceptance,
        balanced: false,
        isNoble: false
      };
    }
  }

  // Covalent Bond evaluation
  // Total needed vs supplied
  let openSlots = 0;
  if (totalBondsNeeded > 0) {
    openSlots = Math.max(0, totalBondsNeeded - totalBondsSupplied);
  }

  if (entries.length === 1 && entries[0][1] === 1) {
    const el = ELEMENTS[entries[0][0]];
    const needed = el.valence === 1 ? 1 : 8 - el.valence;
    return {
      status: "incomplete",
      message: `${el.name} has ${el.valence} valence e⁻ (needs ${needed} bond${needed > 1 ? "s" : ""}). Add partner atoms!`,
      slotsNeeded: needed,
      slotsFilled: 0,
      balanced: false,
      isNoble: false
    };
  }

  return {
    status: openSlots === 0 && totalBondsSupplied > 0 ? "balanced" : "incomplete",
    message: openSlots === 0 && totalBondsSupplied > 0
      ? "Octet sharing stable! Ready to synthesize."
      : `Valence imbalance: ${openSlots} more electron bond${openSlots > 1 ? "s" : ""} required.`,
    slotsNeeded: totalBondsNeeded || 4,
    slotsFilled: totalBondsSupplied,
    balanced: openSlots === 0 && totalBondsSupplied > 0,
    isNoble: false
  };
}

export function liveCommentary(workbench) {
  const status = calculateValenceStatus(workbench);
  return status.message;
}

export function explainFailure(workbench, currentTarget = null) {
  const entries = Object.entries(workbench).filter(([, n]) => (n ?? 0) > 0);
  if (entries.length === 0) return "Empty workbench. Select elements from the palette before synthesizing.";

  const symbols = entries.map(([s]) => s);
  const counts = Object.fromEntries(entries);

  const noble = symbols.find(s => ELEMENTS[s]?.noble);
  if (noble) {
    const e = ELEMENTS[noble];
    return `Dr. Atom: ${e.name} (${e.symbol}) is an inert Noble Gas with a full outer shell (2/2 or 8/8). It does not participate in chemical reactions! Remove it.`;
  }

  const isMetalOnly = symbols.every(s => ["Na", "Mg", "K", "Ca"].includes(s));
  if (isMetalOnly && symbols.length > 0) {
    return "Dr. Atom: Metals only surrender electrons; they cannot accept them. To make a stable salt, you must pair metals with a nonmetal like Chlorine or Oxygen!";
  }

  if (symbols.includes("O") && symbols.includes("H")) {
    if (counts.H === 1 && counts.O === 1) {
      return "Dr. Atom: Hydroxyl (OH) is an incomplete radical! Oxygen has 6 valence electrons and needs 2 bonds. Add 1 more Hydrogen to synthesize Water (H₂O).";
    }
    if (counts.H === 3 && counts.O === 1) {
      return "Dr. Atom: H₃O is an unstable hydronium ion in free nature. Stable water requires a 2:1 ratio (H₂O).";
    }
  }

  if (symbols.includes("C") && symbols.includes("H")) {
    if (counts.C === 1 && counts.H === 2) {
      return "Dr. Atom: Carbon has 4 open valence slots. With only 2 Hydrogens, 2 slots remain empty. Add 2 more Hydrogens to make Methane (CH₄)!";
    }
    if (counts.C === 1 && counts.H === 3) {
      return "Dr. Atom: Methyl (CH₃) has 1 unpaired electron. Add 1 more Hydrogen to achieve a stable octet (CH₄).";
    }
  }

  if (symbols.includes("Na") && symbols.includes("O") && counts.Na === 1 && counts.O === 1) {
    return "Dr. Atom: Oxygen needs 2 electrons to complete its octet, but Sodium can only donate 1! You need 2 Sodium atoms for every 1 Oxygen (Na₂O).";
  }

  if (symbols.includes("Mg") && symbols.includes("Cl") && counts.Mg === 1 && counts.Cl === 1) {
    return "Dr. Atom: Magnesium surrenders 2 electrons (+2 charge), but 1 Chlorine only accepts 1 (-1 charge). You need 2 Chlorine atoms (MgCl₂)!";
  }

  if (currentTarget?.hint) {
    return `Dr. Atom: Incorrect atom ratio! Clue for ${currentTarget.name}: ${currentTarget.hint}`;
  }

  return `Dr. Atom: This combination cannot form a stable octet in nature. Check each atom's valence electrons and try again!`;
}


export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
