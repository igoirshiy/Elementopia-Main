import React, { useState } from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Trophy, CheckCircle, CheckCircle2, ArrowRight, ArrowLeft, RotateCcw, Sparkles, Film, Atom, Layers, LayoutDashboard, X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
const BOND_THEORY_METADATA = {
	"H₂O": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "2 single shared O-H covalent bonds, 2 unshared lone pairs on central Oxygen",
		valenceBudget: "8 valence e⁻ total · 2 bonding pairs (4 e⁻), 2 lone pairs on O (4 e⁻)",
		geometry: "Bent / Angular (104.5°)",
		polarity: "Strongly Polar (ΔEN = 1.24) · Net Dipole Moment (1.85 D)",
		stateOfMatter: "Liquid at 25°C · Extensive Intermolecular H-Bonding",
		reactionEq: "2H₂ + O₂ → 2H₂O (Exothermic, ΔH = -285.8 kJ/mol)",
		theory: "Oxygen's high electronegativity (3.44 vs 2.20 for H) strongly pulls shared electron density toward itself, creating distinct partial negative (δ⁻) and positive (δ⁺) dipole poles. Oxygen satisfies its complete octet ([2,8]) while both Hydrogens satisfy the duet rule ([2]).",
		utility: "Universal biological cooling solvent, cellular hydration buffer, and chemical reactant in metabolic hydrolysis.",
		video: "/videos/water.mp4"
	},
	"H₂O₂": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "H—O—O—H single-bond bridge with 2 lone pairs on each Oxygen atom",
		valenceBudget: "14 valence e⁻ total · 3 single bonds (6 e⁻), 4 lone pairs (8 e⁻)",
		geometry: "Non-Planar Skewed / Book-like (90.2° dihedral angle)",
		polarity: "Polar (ΔEN = 1.24) · Net Dipole Moment (2.26 D)",
		stateOfMatter: "Viscous Pale Blue Liquid at 25°C · Unstable Peroxide",
		reactionEq: "2H₂O₂ → 2H₂O + O₂↑ (Catalytic Decomposition)",
		theory: "Features an unstable single covalent peroxide bridge (-O-O-) where each oxygen is in a -1 oxidation state. Readily decomposes into water while releasing nascent oxygen radicals that disrupt bacterial cell walls.",
		utility: "Topical antiseptic disinfectant (Agua oxigenada), wound cleanser, and industrial bleaching oxidizer.",
		video: null
	},
	"NH₃": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "3 single shared N-H covalent pairs with 1 localized lone pair on Nitrogen",
		valenceBudget: "8 valence e⁻ total · 3 bonding pairs (6 e⁻), 1 lone pair on N (2 e⁻)",
		geometry: "Trigonal Pyramidal (107.8° bond angle)",
		polarity: "Polar (ΔEN = 0.84) · Strong Dipole Moment (1.47 D)",
		stateOfMatter: "Pungent Alkaline Gas at 25°C · Extremely Water-Soluble",
		reactionEq: "N₂ + 3H₂ ⇌ 2NH₃ (Haber-Bosch Process, Fe Catalyst)",
		theory: "Nitrogen completes its valence octet ([2,8]) by sharing 3 electron pairs with 3 Hydrogens. The lone electron pair on top repels the N-H bonding pairs downward into a trigonal pyramid and readily accepts protons (acting as a Brønsted-Lowry base).",
		utility: "Primary chemical feedstock for synthetic agricultural nitrogen fertilizers and industrial alkaline glass cleaner.",
		video: "/videos/ammonia.mp4"
	},
	"HCl": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "1 shared H-Cl single covalent bond, 3 non-bonding lone pairs on Chlorine",
		valenceBudget: "8 valence e⁻ total · 1 bonding pair (2 e⁻), 3 lone pairs on Cl (6 e⁻)",
		geometry: "Linear (180°)",
		polarity: "Strongly Polar (ΔEN = 0.96) · Dipole Moment (1.08 D)",
		stateOfMatter: "Colorless Fuming Gas at 25°C · Strong Acid in Solution",
		reactionEq: "H₂ + Cl₂ → 2HCl (Exothermic Photochemical Reaction)",
		theory: "Chlorine possesses a high electronegativity (3.16) relative to Hydrogen (2.20), polarizing the covalent bond heavily toward Chlorine. In aqueous solution, it completely dissociates into hydronium (H₃O⁺) and chloride (Cl⁻) ions.",
		utility: "Human gastric digestive acid (stomach juice breakdown) and commercial muriatic acid for pool and masonry cleaning.",
		video: "/videos/hydrogen_chloride.mp4"
	},
	"CH₄": {
		bondType: "Nonpolar Covalent",
		typeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		lewis: "Central Carbon forming 4 single C-H covalent bonds directed to 4 Hydrogens",
		valenceBudget: "8 valence e⁻ total · 4 bonding pairs (8 shared e⁻), 0 lone pairs",
		geometry: "Regular Tetrahedral (109.5° bond angle)",
		polarity: "Nonpolar (ΔEN = 0.35) · Zero Net Dipole (Dipoles cancel)",
		stateOfMatter: "Odorless Flammable Gas at 25°C · Saturated Alkane",
		reactionEq: "CH₄ + 2O₂ → CO₂ + 2H₂O (Clean Hydrocarbon Combustion)",
		theory: "Carbon sp³ hybridizes its valence shell to form 4 equal covalent bonds with Hydrogens. The perfect tetrahedral symmetry causes the 4 weak C-H bond dipoles to completely cancel each other out in 3D space, yielding a nonpolar molecule.",
		utility: "Clean-burning primary component of natural gas fuel, domestic cooking gas (LPG component), and thermal electricity generation.",
		video: "/videos/methane.mp4"
	},
	"CO₂": {
		bondType: "Nonpolar Covalent (Polar Bonds, Nonpolar Molecule)",
		typeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		lewis: "O=C=O with 2 double covalent bonds (4 shared pairs), 2 lone pairs on each Oxygen",
		valenceBudget: "16 valence e⁻ total · 4 bonding pairs (8 e⁻), 4 lone pairs (8 e⁻)",
		geometry: "Linear (180° bond angle)",
		polarity: "Nonpolar (ΔEN = 0.89) · Opposing C=O Dipoles Cancel (μ = 0 D)",
		stateOfMatter: "Dense Gas at 25°C · Sublimes to Dry Ice at -78.5°C",
		reactionEq: "C + O₂ → CO₂ (Complete Carbon Oxidation)",
		theory: "Carbon achieves octet stability by sharing 2 pairs of electrons with each Oxygen atom (forming 2 double bonds: 2 σ bonds + 2 π bonds). Because the molecule is strictly linear (180°), the two strong polar C=O dipoles pull in exact opposite directions and neutralize.",
		utility: "Essential reactant in plant photosynthesis, effervescent carbonated beverage fizz, and cryogenic dry ice refrigerant.",
		video: "/videos/carbon_dioxide.mp4"
	},
	"CH₂O₂": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Planar Carbon bonded to =O (double), -H (single), and -O-H (single hydroxyl)",
		valenceBudget: "18 valence e⁻ total · 5 bonding pairs (10 e⁻), 4 lone pairs (8 e⁻)",
		geometry: "Trigonal Planar around Carbon (~120°)",
		polarity: "Strongly Polar · Carboxylic Acid Dipole",
		stateOfMatter: "Pungent Fuming Liquid at 25°C · Formic Acid",
		reactionEq: "CO + H₂O → HCOOH (Industrial Synthesis)",
		theory: "Simplest carboxylic acid where negative charge delocalizes between both oxygen atoms via resonance. Strong intermolecular hydrogen bonding networks enable high water solubility and rapid proton donation.",
		utility: "Chemical defense venom in red stinging ants, industrial leather tanning, and organic textile etching agent.",
		video: null
	},
	"HCN": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "H—C≡N with a single H-C bond, triple C≡N bond, and 1 lone pair on Nitrogen",
		valenceBudget: "10 valence e⁻ total · 4 bonding pairs (8 e⁻), 1 lone pair on N (2 e⁻)",
		geometry: "Linear (180° bond angle)",
		polarity: "Strongly Polar (ΔEN: C-H 0.35, C≡N 0.49) · Dipole Moment (2.98 D)",
		stateOfMatter: "Volatile Colorless Liquid/Gas at 25°C · Faint Bitter Almond Odor",
		reactionEq: "2CH₄ + 2NH₃ + 3O₂ → 2HCN + 6H₂O (Andrussow Oxidation)",
		theory: "Carbon is sp-hybridized, sharing 1 pair with Hydrogen (single σ bond) and 3 pairs with Nitrogen (one σ bond + two π bonds). Both Carbon and Nitrogen satisfy complete octets, but Nitrogen pulls electron density heavily along the linear axis.",
		utility: "Precursor in synthetic organic nylon manufacturing, gold cyanidation mining, and organic intermediate synthesis.",
		video: "/videos/hydrogen cyanide.mp4"
	},
	"N₂O": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "N=N=O resonance stabilized with major contributor [:N≡N—Ö:]",
		valenceBudget: "16 valence e⁻ total · 4 bonding pairs (8 e⁻), 4 lone pairs (8 e⁻)",
		geometry: "Linear (180° bond angle)",
		polarity: "Slightly Polar (Dipole Moment 0.166 D)",
		stateOfMatter: "Sweet-smelling Colorless Gas at 25°C · Nitrous Oxide",
		reactionEq: "NH₄NO₃(s) → N₂O(g) + 2H₂O(g) (Thermal Decomposition at 170°C)",
		theory: "Resonance hybrid where electrons delocalize across all three atoms to achieve octet satisfaction. The linear arrangement allows overlapping p-orbitals to form continuous π-electron delocalization.",
		utility: "Medical anesthetic laughing gas in dental sedation, aerosol whipped cream propellant, and rocket motor oxidizer.",
		video: null
	},
	"C₂H₄O₂": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Methyl group (CH₃-) bonded to carbonyl Carbon (C=O) and hydroxyl (-OH)",
		valenceBudget: "24 valence e⁻ total · 8 bonding pairs (16 e⁻), 4 lone pairs on Oxygens (8 e⁻)",
		geometry: "Tetrahedral around CH₃, Trigonal Planar around Carbonyl Carbon",
		polarity: "Polar (ΔEN = 0.89) · Forms Hydrogen-Bonded Dimers",
		stateOfMatter: "Pungent Sour Liquid at 25°C · Acetic Acid (Vinegar)",
		reactionEq: "C₂H₅OH + O₂ → CH₃COOH + H₂O (Acetobacter Fermentation)",
		theory: "Carboxylic acid where electronegative carbonyl oxygen draws electron density away from the hydroxyl hydrogen, making the proton easily ionizable in water to create acetate (CH₃COO⁻) and hydronium (H₃O⁺).",
		utility: "Active sour acid in culinary kitchen vinegar (suka), food preservation pickling, and industrial vinyl acetate monomer synthesis.",
		video: null
	},
	"C₂H₆O": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Ethyl backbone (CH₃-CH₂-) single-bonded to terminal hydroxyl (-OH) group",
		valenceBudget: "20 valence e⁻ total · 8 single bonds (16 e⁻), 2 lone pairs on O (4 e⁻)",
		geometry: "Tetrahedral at Carbons (109.5°), Bent at Oxygen (104.5°)",
		polarity: "Polar at -OH group with nonpolar ethyl tail · Amphiphilic",
		stateOfMatter: "Volatile Flammable Liquid at 25°C · Complete Water Miscibility",
		reactionEq: "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (Yeast Sugar Fermentation)",
		theory: "The polar terminal hydroxyl (-OH) group participates in extensive hydrogen bonding with water molecules, explaining why ethanol dissolves in water in all proportions, while the ethyl hydrocarbon tail provides organic solvent properties.",
		utility: "Hospital disinfectant (70% rubbing alcohol), renewable biofuel additive, and universal laboratory solvent.",
		video: null
	},
	"CH₄N₂O": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Planar carbonyl center (C=O) bonded to two amino groups (-NH₂)",
		valenceBudget: "24 valence e⁻ total · 8 bonding pairs (16 e⁻), 4 lone pairs (8 e⁻)",
		geometry: "Trigonal Planar around Carbon (~120°)",
		polarity: "Strongly Polar · High Hydrogen-Bonding Capacity",
		stateOfMatter: "White Crystalline Solid at 25°C · Highly Soluble in Water",
		reactionEq: "2NH₃ + CO₂ ⇌ NH₂CONH₂ + H₂O (Bosch-Meiser Urea Synthesis)",
		theory: "Nitrogen lone pairs delocalize into the carbonyl π* antibonding orbital, giving the C-N bonds partial double-bond character and creating a planar resonance hybrid with remarkable stability.",
		utility: "Milestone first organic compound synthesized from inorganic chemicals (Wöhler, 1828) and high-nitrogen agricultural fertilizer.",
		video: "/videos/urea.mp4"
	},
	"NaCl": {
		bondType: "Ionic Bond",
		typeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		lewis: "Na⁺ [2,8] cation electrostatically bound to Cl⁻ [2,8,8] chloride anion",
		valenceBudget: "8 valence e⁻ transferred to complete Cl⁻ octet; Na⁺ shell is empty [2,8]",
		geometry: "Face-Centered Cubic (FCC) Crystal Lattice (6:6 coordination)",
		polarity: "Fully Ionic (ΔEN = 2.23) · Complete Valence Electron Transfer",
		stateOfMatter: "White Crystalline Solid at 25°C · High Melting Point (801°C)",
		reactionEq: "2Na(s) + Cl₂(g) → 2NaCl(s) (Lattice Energy = -787 kJ/mol)",
		theory: "Electropositive Sodium (EN 0.93) surrenders its single 3s¹ valence electron to electronegative Chlorine (EN 3.16). Both achieve stable noble gas octets (Neon and Argon configurations). Strong non-directional electrostatic forces bind them into an alternating 3D cubic lattice.",
		utility: "Human nervous signal electrolyte conduction, osmotic blood pressure regulation, and essential culinary table salt.",
		video: "/videos/sodium chloride.mp4"
	},
	"Na₂O": {
		bondType: "Ionic Bond",
		typeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		lewis: "2 Na⁺ [2,8] cations surround 1 O²⁻ [2,8] oxide anion in antifluorite lattice",
		valenceBudget: "2 electrons transferred (1 from each Na) to complete Oxygen's [2,8] octet",
		geometry: "Antifluorite Cubic Crystal Lattice (4:8 coordination)",
		polarity: "Strongly Ionic (ΔEN = 2.51) · Complete Double Electron Transfer",
		stateOfMatter: "White Solid Granules at 25°C · Reacts Violently with Water",
		reactionEq: "4Na + O₂ → 2Na₂O | Na₂O + H₂O → 2NaOH (Exothermic Hydrolysis)",
		theory: "Two electropositive sodium atoms each surrender 1 valence electron to an oxygen atom, allowing Oxygen to fill its 2p subshell and achieve neon octet stability ([2,8]) while producing a strongly basic oxide anion (O²⁻).",
		utility: "Strong basic flux in industrial commercial glassmaking, ceramics glaze synthesis, and heavy alkali manufacturing.",
		video: "/videos/sodium oxide.mp4"
	},
	"MgO": {
		bondType: "Ionic Bond",
		typeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		lewis: "Mg²⁺ [2,8] divalent cation bound to O²⁻ [2,8] oxide anion lattice",
		valenceBudget: "2 valence electrons transferred from Mg to O; both attain [2,8] Ne octets",
		geometry: "Rock-Salt Halite Cubic Lattice (6:6 coordination)",
		polarity: "Strongly Ionic (ΔEN = 2.13) · High Charge Density Attraction",
		stateOfMatter: "White Refractory Powder at 25°C · Ultra-High Melting Point (2,852°C)",
		reactionEq: "2Mg(s) + O₂(g) → 2MgO(s) (Brilliant White Light Reaction)",
		theory: "Magnesium surrenders both 3s² valence electrons to Oxygen. The resulting +2 and -2 charge combination yields an enormous electrostatic lattice energy (-3,791 kJ/mol), giving MgO extraordinary thermal resistance.",
		utility: "Thermal refractory brick insulation for smelting blast furnaces, antacid medicine, and gymnast/climber grip chalk.",
		video: "/videos/magnesium oxide.mp4"
	},
	"NaOH": {
		bondType: "Ionic + Covalent (Dual Bonding)",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "Na⁺ ion electrostatically bound to polyatomic [:Ö—H]⁻ hydroxide anion",
		valenceBudget: "Na⁺ cation (+1) electrostatically balances [OH]⁻ anion (-1) with 8 valence e⁻",
		geometry: "Orthorhombic Crystal Lattice of alternating Na⁺ and OH⁻ ions",
		polarity: "Ionic metal-to-polyatomic bond with Polar Covalent internal O-H bond",
		stateOfMatter: "White Deliquescent Pellets at 25°C · Caustic Alkaline Base",
		reactionEq: "2Na + 2H₂O → 2NaOH + H₂↑ (Exothermic Alkali Reaction)",
		theory: "Exhibits dual bonding: an electropositive metal (Na) transfers an electron to form an ionic bond with a polyatomic hydroxide radical, which internally holds a polar covalent bond between oxygen and hydrogen.",
		utility: "Industrial caustic lye for soap saponification, grease hydrolysis, and chemical drain pipe cleaning.",
		video: "/videos/sodium_hydroxide.mp4"
	},
	"MgCl₂": {
		bondType: "Ionic Bond",
		typeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		lewis: "Mg²⁺ [2,8] cation electrostatically coordinated by two Cl⁻ [2,8,8] anions",
		valenceBudget: "2 valence e⁻ transferred (1 to each Cl); Mg²⁺ and both Cl⁻ have noble gas octets",
		geometry: "Cadmium Chloride Hexagonal Layered Lattice",
		polarity: "Ionic (ΔEN = 1.85) · 1:2 Stoichiometric Electrostatic Neutrality",
		stateOfMatter: "Hygroscopic White Flakes at 25°C · Rapidly Exothermic in Water",
		reactionEq: "Mg + 2HCl → MgCl₂ + H₂↑",
		theory: "Magnesium surrenders 2 valence electrons (one to each Chlorine atom). The resulting divalent Mg²⁺ cation is surrounded by two monovalent Cl⁻ anions to balance charges into an electrically neutral ionic solid.",
		utility: "Sub-zero roadway de-icing salt, culinary tofu coagulant (nigari), and industrial dust control suppression.",
		video: "/videos/magnesium chloride.mp4"
	},
	"Mg(OH)₂": {
		bondType: "Ionic + Covalent (Dual Bonding)",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "Mg²⁺ cation electrostatically balanced by two polyatomic [:Ö—H]⁻ anions",
		valenceBudget: "Mg²⁺ transfers 2 e⁻ (1 to each OH⁻); all entities satisfy noble gas octets",
		geometry: "Cadmium Iodide Hexagonal Layered Crystal Structure",
		polarity: "Ionic lattice with Polar Covalent O-H bonds inside hydroxide ions",
		stateOfMatter: "White Insoluble Suspension at 25°C · Milk of Magnesia",
		reactionEq: "MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl (Precipitation Reaction)",
		theory: "Divalent magnesium (Mg²⁺) coordinates two covalently bonded hydroxide groups ([OH]⁻). Its low aqueous solubility prevents dangerous caustic burns while safely neutralizing excess stomach hydrochloric acid.",
		utility: "Milk of Magnesia antacid medicine for hyperacidity, laxative suspension, and non-toxic flame retardant filler.",
		video: "/videos/magnesium_hydroxide.mp4"
	},
	"Na₂CO₃": {
		bondType: "Ionic + Covalent (Dual Bonding)",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "Two Na⁺ cations electrostatically balancing a resonance-stabilized [CO₃]²⁻ anion",
		valenceBudget: "24 valence e⁻ in trigonal carbonate ion; 2 electrons contributed by two Na atoms",
		geometry: "Monoclinic Crystal Lattice with Trigonal Planar [CO₃]²⁻ anions",
		polarity: "Ionic metal-to-polyatomic bond with Delocalized C-O Covalent Resonance",
		stateOfMatter: "White Odorless Hygroscopic Powder at 25°C · Washing Soda",
		reactionEq: "2NaOH + CO₂ → Na₂CO₃ + H₂O (Solvay Process Intermediate)",
		theory: "Two sodium cations balance a planar carbonate polyatomic anion ([CO₃]²⁻). The carbonate ion achieves extreme stability through delocalization of its 2 extra electrons across all three C-O bonds equally.",
		utility: "Commercial soda ash in glass blowing, laundry detergent water-softener (precipitating hard Ca²⁺/Mg²⁺), and pH buffer.",
		video: "/videos/sodium_carbonate.mp4"
	},
	"MgCO₃": {
		bondType: "Ionic + Covalent (Dual Bonding)",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "Mg²⁺ cation electrostatically bound to planar [CO₃]²⁻ carbonate polyatomic ion",
		valenceBudget: "Mg²⁺ transfers 2 e⁻ directly to satisfy the [CO₃]²⁻ carbonate octet system",
		geometry: "Trigonal Calcite-Type Crystal Lattice",
		polarity: "Ionic crystal lattice with delocalized covalent π-bonding inside carbonate",
		stateOfMatter: "Insoluble White Powder at 25°C · Mineral Magnesite",
		reactionEq: "Mg²⁺(aq) + CO₃²⁻(aq) → MgCO₃(s)↓",
		theory: "Magnesium's +2 charge directly neutralizes the -2 charge of the carbonate polyatomic ion in a 1:1 ratio. The high lattice energy makes it practically insoluble in neutral water.",
		utility: "Gymnastics and rock-climbing friction chalk, mineral antacid tablets, and fireproofing insulation.",
		video: "/videos/magnesium_carbonate.mp4"
	},
	"HNO₃": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Planar nitrate [NO₃] unit coordinated to a single Hydrogen proton",
		valenceBudget: "24 valence e⁻ total · Delocalized π-electrons across 3 Oxygen atoms",
		geometry: "Planar around Nitrogen (~120°)",
		polarity: "Strongly Polar · Powerful Acid Dipole",
		stateOfMatter: "Colorless/Yellowish Corrosive Liquid at 25°C · Nitric Acid",
		reactionEq: "3NO₂ + H₂O → 2HNO₃ + NO (Ostwald Process)",
		theory: "Strong mineral acid characterized by complete resonance delocalization of negative charge across three oxygens upon ionization. Highly oxidizing acid capable of dissolving noble metals when mixed with HCl (aqua regia).",
		utility: "Industrial synthesis of ammonium nitrate fertilizers, explosives manufacturing, and semiconductor circuit board etching.",
		video: "/videos/nitric acid.mp4"
	},
	"C₂H₂": {
		bondType: "Nonpolar Covalent",
		typeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		lewis: "H—C≡C—H with a central Carbon-Carbon triple bond (1 σ bond + 2 π bonds)",
		valenceBudget: "10 valence e⁻ total · 5 bonding pairs (10 shared e⁻), 0 lone pairs",
		geometry: "Linear (180° bond angle)",
		polarity: "Nonpolar (Symmetric Linear Geometry cancels dipoles)",
		stateOfMatter: "Colorless Flammable Gas at 25°C · Acetylene / Ethyne",
		reactionEq: "CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂ (Calcium Carbide Hydrolysis)",
		theory: "Linear sp-hybridized carbons share 3 pairs of valence electrons between them (triple bond: bond length 120 pm) and 1 pair with each hydrogen. The high electron density in the cylindrical π-cloud makes it a potent fuel.",
		utility: "Ultra-high-temperature oxy-acetylene metal welding and cutting blowtorches (burns at >3,300°C).",
		video: "/videos/ethyne.mp4"
	},
	"CH₂O": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Planar Carbon bonded via double bond to Oxygen (C=O) and single bonds to two Hydrogens",
		valenceBudget: "12 valence e⁻ total · 4 bonding pairs (8 e⁻), 2 lone pairs on O (4 e⁻)",
		geometry: "Trigonal Planar (~120° bond angles)",
		polarity: "Strongly Polar (ΔEN = 0.89) · Carbonyl Dipole Moment (2.33 D)",
		stateOfMatter: "Pungent Suffocating Gas at 25°C · Formaldehyde (Formalin)",
		reactionEq: "2CH₃OH + O₂ → 2HCHO + 2H₂O (Catalytic Methanol Oxidation)",
		theory: "Carbon sp² hybridizes to form a planar structure. The electronegative oxygen draws electron density through the carbonyl double bond, making the carbon electron-deficient and reactive toward nucleophiles.",
		utility: "Biological tissue specimen preservative (formalin solution), industrial disinfectant, and bakelite resin synthesis.",
		video: "/videos/formaldehye.mp4"
	},
	"CH₄O": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Tetrahedral methyl group (CH₃-) bonded to hydroxyl (-OH) group",
		valenceBudget: "14 valence e⁻ total · 5 single bonds (10 e⁻), 2 lone pairs on O (4 e⁻)",
		geometry: "Tetrahedral at Carbon (109.5°), Bent at Oxygen (104.5°)",
		polarity: "Polar (Dipole Moment 1.70 D) · Hydrogen-Bonded Alcohol",
		stateOfMatter: "Volatile Toxic Liquid at 25°C · Methanol (Wood Alcohol)",
		reactionEq: "CO + 2H₂ → CH₃OH (Catalytic Syngas Synthesis)",
		theory: "Simplest monohydric alcohol containing polarized C-O and O-H single bonds. Readily forms hydrogen bonds with water and other alcohol molecules, producing a low boiling point liquid with high chemical reactivity.",
		utility: "High-octane racing fuel, industrial solvent, antifreeze component, and chemical precursor for biodiesel.",
		video: "/videos/methanol.mp4"
	},
	"C₆H₁₂O₆": {
		bondType: "Polar Covalent (Organic Polyol)",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "6-Carbon backbone with 5 hydroxyl (-OH) groups and 1 aldehyde/hemiacetal pyranose ring",
		valenceBudget: "72 valence e⁻ total · All Carbon, Oxygen, and Hydrogen atoms satisfy octets/duets",
		geometry: "Chair Conformation Pyranose Ring (Tetrahedral Carbons)",
		polarity: "Strongly Polar · Multiple Hydrogen-Bonding Hydroxyl Groups",
		stateOfMatter: "White Crystalline Sweet Solid at 25°C · D-Glucose",
		reactionEq: "6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂ (Photosynthesis)",
		theory: "Essential hexose monosaccharide where 6 Carbon atoms form a stable catenated backbone. In aqueous solution, it forms a 6-membered pyranose ring where equatorial hydroxyl groups minimize steric strain.",
		utility: "Universal primary energy substrate for cellular respiration in living organisms and medical intravenous nutrient fluid.",
		video: null
	},
	"C₂H₅NO₂": {
		bondType: "Polar Covalent (Zwitterionic Amino Acid)",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Central alpha-Carbon bonded to amino (-NH₂), carboxyl (-COOH), and 2 Hydrogens",
		valenceBudget: "30 valence e⁻ total · Complete octets across all C, N, and O atoms",
		geometry: "Tetrahedral at Alpha-Carbon, Planar at Carboxyl Group",
		polarity: "Internal Zwitterion (+NH₃-CH₂-COO⁻) · Highly Polar",
		stateOfMatter: "White Crystalline Solid at 25°C · Glycine Amino Acid",
		reactionEq: "ClCH₂COOH + 2NH₃ → H₂N-CH₂-COOH + NH₄Cl",
		theory: "Simplest proteinogenic amino acid. In aqueous solution, it exists as an electrically neutral dipolar ion (zwitterion) where the amino group accepts a proton while the carboxyl group donates one.",
		utility: "Fundamental protein building block in collagen, inhibitory neurotransmitter in the human central nervous system, and dietary supplement.",
		video: null
	},
	"C₃H₈O₃": {
		bondType: "Polar Covalent (Trihydric Alcohol)",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "3-Carbon chain with each Carbon bearing a hydroxyl (-OH) group",
		valenceBudget: "38 valence e⁻ total · 11 single covalent bonds, 6 lone pairs on Oxygens",
		geometry: "Tetrahedral around Carbons, Bent around Oxygens",
		polarity: "Strongly Polar · 3 Hydroxyl Groups produce dense H-Bond Network",
		stateOfMatter: "Clear Viscous Sweet Liquid at 25°C · Glycerol / Glycerin",
		reactionEq: "Triglyceride + 3NaOH → Glycerol + 3 Soap Salts (Saponification)",
		theory: "Triol molecule whose 3 hydroxyl groups create dense intermolecular hydrogen bonding networks, giving glycerol its characteristic high viscosity, sweet taste, and high boiling point (290°C).",
		utility: "Cosmetic moisturizer (humectant in skin lotions), pharmaceutical cough syrup base, and lipid structural backbone.",
		video: null
	},
	"NaHCO₃": {
		bondType: "Ionic + Covalent (Dual Bonding)",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "Na⁺ cation electrostatically bound to polyatomic bicarbonate [H-O-CO₂]⁻ anion",
		valenceBudget: "24 valence e⁻ in bicarbonate ion balanced electrostatically by Na⁺ cation",
		geometry: "Monoclinic Crystal Lattice with Planar Bicarbonate Radicals",
		polarity: "Ionic lattice with Polar Covalent bonds inside bicarbonate anion",
		stateOfMatter: "White Crystalline Powder at 25°C · Baking Soda",
		reactionEq: "Na₂CO₃ + CO₂ + H₂O → 2NaHCO₃ (Carbonation)",
		theory: "Sodium cation electrostatically balances an amphoteric bicarbonate anion ([HCO₃]⁻). When heated or treated with acid, it immediately releases carbon dioxide gas (CO₂).",
		utility: "Culinary baking leavening agent (makes dough rise), gentle antacid for stomach heartburn, and kitchen odor neutralizer.",
		video: null
	},
	"NH₄Cl": {
		bondType: "Ionic + Covalent (Dual Bonding)",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "[NH₄]⁺ tetrahedral cation electrostatically bound to Cl⁻ [2,8,8] chloride anion",
		valenceBudget: "8 valence e⁻ in NH₄⁺ (4 N-H bonds), 8 valence e⁻ in Cl⁻; total 16 e⁻",
		geometry: "Cesium Chloride / Rock Salt Cubic Lattice (Alternating NH₄⁺ & Cl⁻)",
		polarity: "Ionic crystal composed of non-metal atoms with Coordinate Covalent N-H bond",
		stateOfMatter: "White Crystalline Salt at 25°C · Sublimes upon heating",
		reactionEq: "NH₃(g) + HCl(g) → NH₄Cl(s) (Dense White Smoke Synthesis)",
		theory: "Ammonia donates its lone electron pair into a vacant proton orbital to form a coordinate covalent bond in the ammonium cation ([NH₄]⁺). This polyatomic cation then forms an ionic lattice with the chloride anion (Cl⁻).",
		utility: "Electrolyte in dry-cell batteries, metal soldering flux, and salty licorice seasoning (Salmiak).",
		video: null
	},
	"NaNO₃": {
		bondType: "Ionic + Covalent (Dual Bonding)",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "Na⁺ cation electrostatically bound to planar resonance-stabilized [NO₃]⁻ anion",
		valenceBudget: "24 valence e⁻ in nitrate anion balanced electrostatically by Na⁺ cation",
		geometry: "Trigonal Calcite-Type Crystal Structure",
		polarity: "Ionic lattice with Delocalized Covalent π-Resonance inside nitrate",
		stateOfMatter: "White Deliquescent Crystal at 25°C · Chile Saltpeter",
		reactionEq: "HNO₃ + NaOH → NaNO₃ + H₂O (Acid-Base Neutralization)",
		theory: "Electropositive sodium ion balances a planar nitrate ion with equal N-O bond lengths (128 pm) due to delocalized resonance across all 3 oxygen atoms.",
		utility: "Agricultural nitrogen fertilizer, curing agent for cured meats (bacon and ham), and pyrotechnic oxidizer.",
		video: null
	}
};

const NEXT_STAGE_METADATA = {
	"covalent-2": {
		concept: "Multiple Covalent Bonds & Ternary Molecules",
		mechanism: "Nonmetals share 2 or 3 pairs of valence electrons simultaneously to achieve stable octets (8 outer electrons).",
		valenceGuide: [
			{ elem: "C", valence: 4, tip: "Needs 4 e⁻ · 4 bonds" },
			{ elem: "O", valence: 6, tip: "Needs 2 e⁻ · Double bonds" },
			{ elem: "N", valence: 5, tip: "Needs 3 e⁻ · Triple bonds" },
			{ elem: "H", valence: 1, tip: "Needs 1 e⁻ · Single bond" }
		],
		tacticalTip: "Carbon serves as the central atom because it requires 4 shared electrons to fill its outer energy level."
	},
	"covalent-3": {
		concept: "Polyatomic Organic Chains & Macromolecular Backbones",
		mechanism: "Carbon atoms catenate (link to other carbons) while binding H, O, and N into multi-element functional chains.",
		valenceGuide: [
			{ elem: "C", valence: 4, tip: "Forms C-C backbone skeleton" },
			{ elem: "H", valence: 1, tip: "Caps outer open bonds" },
			{ elem: "O", valence: 6, tip: "Forms hydroxyl (-OH) & carbonyl (=O)" },
			{ elem: "N", valence: 5, tip: "Forms amino (-NH₂) groups" }
		],
		tacticalTip: "Ensure every Carbon atom achieves 4 bonds and every Oxygen forms 2 bonds for neutral octet stability."
	},
	"salt-2": {
		concept: "Ternary Metal & Polyatomic Ions",
		mechanism: "Metals surrender electrons to polyatomic groups like Hydroxide [OH]⁻ and Carbonate [CO₃]²⁻ which act as single units.",
		valenceGuide: [
			{ elem: "Na", valence: 1, tip: "Loses 1 e⁻ → Na⁺" },
			{ elem: "Mg", valence: 2, tip: "Loses 2 e⁻ → Mg²⁺" },
			{ elem: "OH", valence: -1, tip: "Hydroxide polyatomic anion (-1)" },
			{ elem: "CO₃", valence: -2, tip: "Carbonate polyatomic anion (-2)" }
		],
		tacticalTip: "Total cation charge must equal total anion charge. For example, Mg²⁺ requires two [OH]⁻ ions for electrical neutrality."
	},
	"salt-3": {
		concept: "Complex 4-Element Polyatomic Lattices",
		mechanism: "Metals coordinate with 3-and-4 element polyatomic groups such as bicarbonate [HCO₃]⁻ and ammonium [NH₄]⁺.",
		valenceGuide: [
			{ elem: "Na / Mg", valence: "+1 / +2", tip: "Electropositive metal cation" },
			{ elem: "HCO₃", valence: -1, tip: "Bicarbonate polyatomic group" },
			{ elem: "NH₄", valence: +1, tip: "Ammonium polyatomic cation" }
		],
		tacticalTip: "Treat multi-element radicals as cohesive ions with fixed overall charges when balancing the lattice."
	},
	"carbon-2": {
		concept: "Ternary Carbon-Oxygen Hydrocarbons",
		mechanism: "Carbon coordinates with both Hydrogen and Oxygen, forming carbonyl (=O) and alcohol (-OH) functional groups.",
		valenceGuide: [
			{ elem: "C", valence: 4, tip: "Central backbone · 4 bonds" },
			{ elem: "O", valence: 6, tip: "Terminal/bridge · 2 bonds" },
			{ elem: "H", valence: 1, tip: "Perimeter saturation · 1 bond" }
		],
		tacticalTip: "Noble gases (He, Ne) have full outer shells and never form chemical bonds — ignore them in your palette!"
	},
	"carbon-3": {
		concept: "Polyatomic Macromolecules (Sugars & Amino Acids)",
		mechanism: "Large biomolecules where Carbon, Hydrogen, Oxygen, and Nitrogen assemble into energy and protein structures.",
		valenceGuide: [
			{ elem: "C", valence: 4, tip: "Molecular backbone framework" },
			{ elem: "H", valence: 1, tip: "Perimeter bonding saturation" },
			{ elem: "O", valence: 6, tip: "Polar functional bridges" },
			{ elem: "N", valence: 5, tip: "Amino nitrogen branch points" }
		],
		tacticalTip: "Higher-order compounds require precise stoichiometric balancing — count each element's open valence slots!"
	}
};

export function DebriefingModal({
	domain,
	stats = {},
	stage,
	maxStages,
	nextStageData,
	onContinue,
	onAdvanceStage,
	onRetry,
	onReturnHome
}) {
	const isInterStage = Boolean(stage && maxStages && stage < maxStages);

	const allDomainCompounds = React.useMemo(() => {
		if (!domain) return [];
		if (stage && domain.stages?.[stage]?.required) {
			return domain.stages[stage].required;
		}
		if (domain.stages) {
			return Object.values(domain.stages).flatMap(s => s.required || []);
		}
		return domain.required || [];
	}, [domain, stage]);

	const compoundsCreated = (stats?.compounds && stats.compounds.length > 0)
		? stats.compounds
		: allDomainCompounds.length > 0
			? allDomainCompounds
			: [{ name: "Water", formula: "H₂O" }, { name: "Ammonia", formula: "NH₃" }, { name: "Methane", formula: "CH₄" }];

	const compoundCount = stats?.compoundCount ?? compoundsCreated.length;
	const accuracy = stats?.accuracy ?? 95;
	const timeTaken = stats?.time ?? "01:45";
	const [activePage, setActivePage] = useState(0);
	const [selectedIdx, setSelectedIdx] = useState(0);
	const activeCompound = compoundsCreated[selectedIdx] || compoundsCreated[0];
	const activeFormula = typeof activeCompound === 'string' ? activeCompound : activeCompound?.formula || "H₂O";
	const activeName = typeof activeCompound === 'string' ? '' : activeCompound?.name || "";

	const rewardHint = React.useMemo(() => {
		if (!nextStageData?.required || nextStageData.required.length === 0) return null;
		return nextStageData.required[0];
	}, [nextStageData]);

	const nextStageMeta = React.useMemo(() => {
		if (!nextStageData) return null;
		const nextStageNum = (stage || 1) + 1;
		const key = `${domain?.id}-${nextStageNum}`;
		if (NEXT_STAGE_METADATA[key]) {
			return NEXT_STAGE_METADATA[key];
		}
		return {
			concept: nextStageData.title || `Stage ${nextStageNum} Directive`,
			mechanism: nextStageData.story || "Synthesize multi-element compounds by satisfying valence requirements.",
			valenceGuide: (nextStageData.validInDomain || nextStageData.palette || []).slice(0, 4).map(sym => ({
				elem: sym,
				tip: "Balance valence electrons"
			})),
			tacticalTip: "Observe each element's valence slots to reach octet stability."
		};
	}, [domain?.id, stage, nextStageData]);

	const theoryInfo = BOND_THEORY_METADATA[activeFormula] || {
		bondType: domain?.id === "covalent" ? "Covalent Bond" : "Ionic Bond",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Valence electrons paired to satisfy the stable octet configuration.",
		valenceBudget: "Valence octet achieved through stable electron configuration",
		geometry: "Stable Molecular Geometry",
		polarity: domain?.id === "covalent" ? "Polar Covalent" : "Ionic Lattice Attraction",
		stateOfMatter: "Standard State at 25°C",
		reactionEq: null,
		theory: domain?.story || "Atoms bond to achieve outer shell stability.",
		utility: activeCompound?.missionRole || "Essential chemical compound.",
		video: activeCompound?.localVideo || null
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
			<div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md grid-bg" />
			<div className="relative w-full max-w-md md:max-w-4xl rounded-3xl border border-cyan/40 bg-slate-950/95 p-4 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up max-h-[92vh] overflow-y-auto text-left">

				{/* Header Section */}
				<div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
					<div className="flex items-center gap-2.5">
						<div className="p-2 sm:p-2.5 rounded-xl bg-cyan/20 text-cyan border border-cyan/40 shrink-0">
							{isInterStage ? (
								<Layers className="w-5 h-5 sm:w-6 sm:h-6 text-cyan" />
							) : (
								<Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
							)}
						</div>
						<div>
							<span className="font-mono text-[10px] text-cyan uppercase tracking-widest block">
								{isInterStage ? `Stage ${stage} / ${maxStages} Debriefing` : "Educational Debriefing"}
							</span>
							<h2 className="font-pixel text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
								{isInterStage ? `Stage ${stage} Cleared!` : `${domain?.name || "Domain"} Cleared!`}
							</h2>
						</div>
					</div>

					<div className="flex items-center gap-3 font-mono text-xs text-right">
						<div>
							<span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
							<span className="font-bold text-emerald-400">{accuracy}%</span>
						</div>
						<div className="h-6 w-px bg-slate-800" />
						<div>
							<span className="text-[10px] text-slate-400 block uppercase">Time</span>
							<span className="font-bold text-cyan">{timeTaken}</span>
						</div>
						{onReturnHome && (
							<button
								type="button"
								onClick={onReturnHome}
								className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition ml-2 cursor-pointer"
								title="Close"
							>
								<X className="w-5 h-5" />
							</button>
						)}
					</div>
				</div>

				{/* 2-Page Navigation Tab Bar */}
				<div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
					<div className="flex items-center gap-1 sm:gap-2 flex-1">
						<button
							type="button"
							onClick={() => setActivePage(0)}
							className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
								activePage === 0
									? "bg-cyan-500/20 text-cyan border border-cyan/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
									: "text-slate-400 hover:text-white hover:bg-slate-800/60"
							}`}
						>
							<Layers className="w-3.5 h-3.5" />
							<span>1. Progress &amp; Blueprint</span>
						</button>

						<button
							type="button"
							onClick={() => setActivePage(1)}
							className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
								activePage === 1
									? "bg-cyan-500/20 text-cyan border border-cyan/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
									: "text-slate-400 hover:text-white hover:bg-slate-800/60"
							}`}
						>
							<Film className="w-3.5 h-3.5" />
							<span>2. Reaction &amp; Bonding Theory</span>
						</button>
					</div>

					{/* Chevrons to slide between pages */}
					<div className="flex items-center gap-1 pl-2 border-l border-slate-800">
						<button
							type="button"
							onClick={() => setActivePage(prev => (prev === 0 ? 1 : 0))}
							className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
							title={activePage === 0 ? "Next: Bonding Theory" : "Previous: Stage Progress"}
						>
							{activePage === 0 ? <ChevronRight className="w-4 h-4 text-cyan" /> : <ChevronLeft className="w-4 h-4 text-cyan" />}
						</button>
					</div>
				</div>

				{/* PAGE 1: Stage Progress, Next Focus & Completed Objectives */}
				{activePage === 0 && (
					<div className="space-y-4 mb-4 animate-fade-in">
						{/* Doctor Atom Debrief Speech */}
						<DoctorAtomAssistant
							title={`Doctor Atom · ${isInterStage ? `Stage ${stage} Debrief` : "Domain Completed"}`}
							message={
								isInterStage
									? `Outstanding reasoning! You have successfully completed Stage ${stage} of ${domain?.name || "the cavern"}. Review your next mission briefing below:`
									: `Terrific synthesis! You formed all ${compoundCount} target compounds and unlocked complete domain resonance for ${domain?.name}.`
							}
							isTalking={false}
						/>

						{/* Split Row: Next Focus + Blueprint Discovered (Swapped above completed objectives) */}
						<div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
							{nextStageData ? (
								<div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 md:col-span-7 flex flex-col justify-between shadow-[0_0_15px_rgba(217,70,239,0.08)]">
									<div>
										<div className="flex items-center gap-1.5 text-xs font-mono font-bold text-magenta uppercase mb-1.5">
											<Sparkles className="w-3.5 h-3.5 text-magenta" /> Next Focus: Stage {stage + 1}
										</div>
										<div className="text-sm sm:text-base font-bold text-white mb-2 leading-tight font-pixel">
											{nextStageData.title}
										</div>
										<div className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
											{nextStageData.story}
										</div>

										{/* Informational Breakdown */}
										{nextStageMeta && (
											<div className="space-y-2.5 pt-2.5 border-t border-slate-800/80">
												<div>
													<span className="text-[10px] font-mono uppercase tracking-wider text-cyan block mb-0.5 font-bold">
														Key Chemical Mechanism:
													</span>
													<p className="text-[11px] sm:text-xs text-slate-200 font-sans leading-relaxed">
														{nextStageMeta.mechanism}
													</p>
												</div>

												{nextStageMeta.valenceGuide && nextStageMeta.valenceGuide.length > 0 && (
													<div>
														<span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
															Valence Strategy Guide:
														</span>
														<div className="grid grid-cols-2 gap-1.5">
															{nextStageMeta.valenceGuide.map((g, idx) => (
																<div key={idx} className="bg-slate-950/70 border border-slate-800 px-2 py-1 rounded-lg text-[10px] font-mono text-slate-300 flex items-center justify-between">
																	<span className="font-bold text-cyan">{g.elem}</span>
																	<span className="text-slate-400 text-[9px] truncate ml-1">{g.tip}</span>
																</div>
															))}
														</div>
													</div>
												)}

												{nextStageMeta.tacticalTip && (
													<div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-2.5 flex items-start gap-2">
														<span className="text-xs mt-0.5">💡</span>
														<div className="text-[11px] text-cyan-200 font-sans leading-snug">
															<span className="text-cyan font-mono uppercase tracking-wider text-[10px] font-bold block mb-0.5">Doctor Atom Tactical Tip:</span>
															{nextStageMeta.tacticalTip}
														</div>
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 md:col-span-7 flex flex-col justify-between">
									<div className="text-xs font-mono text-cyan uppercase mb-1">Domain Status</div>
									<div className="text-sm font-bold text-white font-pixel">All Domain Stages Complete!</div>
									<div className="text-xs text-slate-300 font-sans mt-1">You have completed all core chemical competencies in this cavern.</div>
								</div>
							)}

							{rewardHint && (
								<div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/5 border border-amber-500/40 relative overflow-hidden group md:col-span-5 flex flex-col justify-between">
									<div>
										<div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase mb-2 relative z-10">
											<Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Blueprint Discovered
										</div>
										<div className="bg-slate-950/70 p-3.5 rounded-xl border border-amber-500/30 relative z-10 backdrop-blur-sm">
											<div className="flex items-center justify-between gap-1 text-[10px] text-amber-400/80 font-mono uppercase tracking-widest mb-1">
												<span>Upcoming Target</span>
												{rewardHint.missionRole && (
													<span className="text-amber-300/70 font-sans normal-case text-[10px] truncate">
														{rewardHint.missionRole}
													</span>
												)}
											</div>
											<div className="flex items-baseline gap-2 flex-wrap">
												<div className="text-base sm:text-lg font-bold text-amber-300 font-pixel tracking-wide">{rewardHint.name}</div>
												{rewardHint.formula && (
													<span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
														{rewardHint.formula}
													</span>
												)}
											</div>
											{rewardHint.clue && (
												<p className="text-[11px] text-amber-200/80 font-sans italic mt-2 leading-relaxed">
													"{rewardHint.clue}"
												</p>
											)}
											<div className="text-xs text-amber-100/80 font-mono mt-2.5 pt-2 border-t border-amber-500/20 flex items-center gap-1.5 flex-wrap">
												<span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
													{rewardHint.recipe ? Object.keys(rewardHint.recipe).join(', ') : ''}
												</span>
												<span>Required elements</span>
											</div>
										</div>
									</div>

									<div className="mt-3 pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-400/70 flex items-center gap-1">
										<span>Ready for synthesis upon descent</span>
									</div>
								</div>
							)}
						</div>

						{/* Stage Objectives Completed Card (Swapped below Next Stage Focus) */}
						<div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
							<div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan uppercase mb-2">
								<CheckCircle2 className="w-4 h-4 text-cyan" /> Stage {stage || 1} Objectives Completed
							</div>
							<ul className="text-xs sm:text-sm text-slate-200 space-y-1.5 font-mono list-disc list-inside">
								{stage === 1 && (
									<>
										<li>Completed 2-element binary electron sharing &amp; octet balance</li>
										<li>Deducted valence electron ratios for neutral molecules</li>
									</>
								)}
								{stage === 2 && (
									<>
										<li>Completed 3-element ternary bonding &amp; multiple shared electron pairs</li>
										<li>Deducted valence octet stability rules across polyatomic centers</li>
									</>
								)}
								{(stage === 3 || !stage) && (
									<>
										<li>Completed complex multi-element polyatomic macromolecular backbones</li>
										<li>Achieved complete domain resonance across all synthesized targets</li>
									</>
								)}
							</ul>
						</div>
					</div>
				)}

				{/* PAGE 2: Live Reaction Synthesis Video & Lewis Bonding Theory Card */}
				{activePage === 1 && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 animate-fade-in">
						{/* Left Column: Reaction Video Clip + Compound Switcher */}
						<div className="flex flex-col gap-3">
							<div className="rounded-2xl border border-slate-800 bg-black overflow-hidden relative aspect-video flex items-center justify-center shadow-inner">
								{theoryInfo.video ? (
									<video
										key={theoryInfo.video}
										src={theoryInfo.video}
										autoPlay
										loop
										muted
										playsInline
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="text-center p-6 text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-2 h-full bg-gradient-to-br from-slate-950 via-slate-900 to-black">
										<Atom className="w-8 h-8 text-cyan/70 animate-pulse" />
										<span className="font-bold text-white text-sm tracking-wider font-pixel">{activeFormula} Synthesized</span>
										<span className="text-[10px] text-cyan/80 bg-cyan/10 px-2.5 py-0.5 rounded-full border border-cyan/30">Valence Octet Resonated · See Theory Card</span>
									</div>
								)}
								<div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 border border-white/10 font-mono text-[9px] text-cyan flex items-center gap-1">
									<Film className="w-3 h-3" /> Live Synthesis Clip
								</div>
							</div>

							<div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
								<span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-bold">
									Synthesized Compounds (Tap to Inspect):
								</span>
								<div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
									{compoundsCreated.map((c, i) => {
										const formula = typeof c === 'string' ? c : c.formula;
										const name = typeof c === 'string' ? '' : c.name;
										const isSelected = i === selectedIdx;
										return (
											<button
												key={i}
												type="button"
												onClick={() => setSelectedIdx(i)}
												className={`min-h-[36px] sm:min-h-[38px] px-3 py-1.5 rounded-xl border font-mono text-xs transition cursor-pointer flex items-center gap-1.5 ${
													isSelected
														? "bg-cyan-500/25 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]"
														: "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
												}`}
											>
												<span className="font-bold text-cyan">{formula}</span>
												{name && <span className="text-[10px] text-slate-400">({name})</span>}
											</button>
										);
									})}
								</div>
							</div>
						</div>

						{/* Right Column: Chemical Bonding Theory & Multi-Box Informational Card */}
						<div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan/30 flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)]">
							<div>
								{/* Title & Classification Bar */}
								<div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800 mb-3">
									<div className="flex items-center gap-2">
										<Atom className="w-4 h-4 text-cyan shrink-0 animate-pulse" />
										<span className="font-mono font-bold text-white text-sm sm:text-base">
											{activeFormula} {activeName && `— ${activeName}`}
										</span>
									</div>
									<div className="flex items-center gap-1.5 flex-wrap justify-end">
										<span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theoryInfo.typeColor}`}>
											{theoryInfo.bondType}
										</span>
										{theoryInfo.stateOfMatter && (
											<span className="hidden sm:inline font-mono text-[9px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
												{theoryInfo.stateOfMatter.split('·')[0].trim()}
											</span>
										)}
									</div>
								</div>

								{/* Multi-Box Informational Chemistry Panels */}
								<div className="space-y-2.5 text-xs font-mono">
									{/* Box 1: Lewis Dot Structure & Valence Electron Budget */}
									<div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/90 text-left">
										<div className="flex items-center justify-between text-[10px] text-cyan font-bold uppercase tracking-wider mb-1">
											<span>Lewis Dot Structure:</span>
											{theoryInfo.valenceBudget && (
												<span className="text-[9px] text-emerald-400 font-mono font-normal">
													{theoryInfo.valenceBudget.split('·')[0].trim()}
												</span>
											)}
										</div>
										<p className="text-slate-200 text-[11px] leading-relaxed font-mono">
											{theoryInfo.lewis}
										</p>
										{theoryInfo.valenceBudget && (
											<div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center gap-1.5">
												<span className="text-cyan font-bold">⚡ Budget:</span>
												<span>{theoryInfo.valenceBudget}</span>
											</div>
										)}
									</div>

									{/* Box 2: 2-Column Mini-Grid (Geometry & Polarity) */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
										<div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
											<span className="text-slate-400 block text-[9.5px] uppercase tracking-wider mb-0.5">
												Molecular Geometry:
											</span>
											<span className="font-bold text-cyan text-[11px] block">
												{theoryInfo.geometry || "Stable Geometry"}
											</span>
										</div>
										<div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80">
											<span className="text-slate-400 block text-[9.5px] uppercase tracking-wider mb-0.5">
												Bond Polarity &amp; ΔEN:
											</span>
											<span className="font-bold text-amber-300 text-[11px] block">
												{theoryInfo.polarity || "Balanced Electronegativity"}
											</span>
										</div>
									</div>

									{/* Box 3: Chemical Bonding Mechanism & Octet Stability */}
									<div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/90 text-left">
										<span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1 font-bold">
											Bonding Mechanism &amp; Octet Fulfillment:
										</span>
										<p className="text-slate-300 font-sans text-[11px] leading-relaxed">
											{theoryInfo.theory}
										</p>
									</div>

									{/* Box 4: Real-World Utility & Formation Reaction */}
									<div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/90 text-left">
										<div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">
											<span>Real-World Utility:</span>
											{theoryInfo.reactionEq && (
												<span className="text-[9px] font-mono text-cyan bg-cyan/10 px-1.5 py-0.2 rounded border border-cyan/20">
													{theoryInfo.reactionEq}
												</span>
											)}
										</div>
										<p className="text-emerald-300 font-sans text-[11px] leading-relaxed">
											{theoryInfo.utility}
										</p>
									</div>
								</div>
							</div>

							<div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px] text-cyan">
								<div className="flex items-center gap-1.5">
									<CheckCircle className="w-3.5 h-3.5 text-cyan" />
									<span>DepEd Grade 9 Competency: Octet Rule Satisfied</span>
								</div>
								{theoryInfo.stateOfMatter && (
									<span className="text-slate-400 text-[9px] hidden sm:inline">
										{theoryInfo.stateOfMatter}
									</span>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Footer Controls */}
				<div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
					{isInterStage ? (
						<>
							<button
								type="button"
								onClick={onReturnHome || onContinue}
								className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-slate-700/80 text-slate-300 font-mono text-xs hover:bg-slate-800 hover:text-white transition cursor-pointer"
							>
								<LayoutDashboard className="w-4 h-4 text-slate-400" />
								<span>Dashboard</span>
							</button>

							<button
								type="button"
								onClick={onAdvanceStage || onContinue}
								className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-blue-600 px-8 py-3 font-mono font-bold text-xs text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider cursor-pointer"
							>
								<span>Dive Deeper to Stage {stage + 1}</span>
								<ArrowRight className="w-4 h-4" />
							</button>
						</>
					) : (
						<>
							<button
								type="button"
								onClick={onRetry}
								className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700/80 text-slate-300 font-mono text-xs hover:bg-slate-800 hover:text-white transition cursor-pointer"
							>
								<RotateCcw className="w-4 h-4 text-slate-400" />
								<span>Replay Domain</span>
							</button>

							<button
								type="button"
								onClick={onContinue}
								className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-blue-600 px-8 py-3 font-mono font-bold text-xs text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider cursor-pointer"
							>
								<LayoutDashboard className="w-4 h-4" />
								<span>Return to Dashboard</span>
								<ArrowRight className="w-4 h-4" />
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
