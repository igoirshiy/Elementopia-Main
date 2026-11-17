import React, { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/common/SiteHeader";
import { CompoundCard } from "../components/CompoundCard";
import { COMPOUND_GALLERY_DATA } from "../data/compound-gallery-data";
import { FlaskConical, Search, Sparkles, Filter, Layers } from "lucide-react";

// Chemical formula & scientific synonym dictionary for exact compound lookup
const COMPOUND_SYNONYMS = {
  stomach_acid: ["hcl", "hydrochloric acid", "hydrogen chloride"],
  laughing_gas: ["n2o", "nitrous oxide", "dinitrogen monoxide"],
  fools_gold: ["fes2", "pyrite", "iron pyrite", "iron sulfide"],
  gunpowder: ["kno3", "black powder", "potassium nitrate"],
  rotten_egg_gas: ["h2s", "hydrogen sulfide", "sulfide"],
  water: ["h2o", "dihydrogen monoxide", "liquid water"],
  table_salt: ["nacl", "sodium chloride", "halite", "saline"],
  glass_and_sand: ["sio2", "silica", "silicon dioxide", "quartz"],
  rust: ["fe2o3", "iron oxide", "ferric oxide"],
  diamond_and_pencil_lead: ["c", "graphite", "carbon", "allotrope"],
  baking_soda: ["nahco3", "sodium bicarbonate", "sodium hydrogen carbonate"],
  bleach: ["naocl", "naclo", "sodium hypochlorite"],
  vinegar: ["ch3cooh", "acetic acid", "ethanoic acid"],
  sugar: ["c6h12o6", "c12h22o11", "glucose", "sucrose"],
  dry_ice: ["co2", "carbon dioxide", "frozen carbon dioxide"],
  chalk_and_marble: ["caco3", "calcium carbonate", "limestone", "calcite"],
  bone_and_teeth: ["ca3(po4)2", "calcium phosphate", "hydroxyapatite", "apatite"],
  rubies_and_sapphires: ["al2o3", "aluminum oxide", "alumina", "corundum"],
  emeralds: ["beryl", "beryllium aluminum cyclosilicate"],
  ammonia: ["nh3", "azane"],
  hydrogen_peroxide: ["h2o2"],
  battery_acid: ["h2so4", "sulfuric acid"],
  ozone: ["o3", "trioxygen"],
  carbon_monoxide: ["co"],
  methane: ["ch4", "natural gas"],
  cyanide: ["hcn", "kcn", "nacn", "cyanide ion"],
  aspirin: ["c9h8o4", "acetylsalicylic acid", "asa"],
  vitamin_c: ["c6h8o6", "ascorbic acid"],
  caffeine: ["c8h10n4o2"],
  tnt: ["c7h5n3o6", "trinitrotoluene"],
  nitroglycerin: ["c3h5n3o9", "glyceryl trinitrate"],
  soap: ["sodium stearate", "fatty acid salt"],
  teflon: ["ptfe", "polytetrafluoroethylene"],
  pvc_plastic: ["pvc", "polyvinyl chloride"],
  kevlar: ["poly-paraphenylene terephthalamide", "aramid"],
  tums_antacid: ["caco3", "calcium carbonate antacid"],
  epsom_salt: ["mgso4", "magnesium sulfate"],
  fluoride: ["naf", "sodium fluoride", "tin fluoride"],
  bronze: ["cu + sn", "copper tin"],
  brass: ["cu + zn", "copper zinc"],
  steel: ["fe + c", "carbon steel"],
  magnetite: ["fe3o4", "iron oxide lodestone"],
  tear_gas: ["cs gas", "2-chlorobenzalmalononitrile"],
  putrescine: ["c4h12n2", "tetramethylenediamine"],
  skatole: ["c9h9n", "3-methylindole"],
  capsaicin: ["c18h27no3", "chili heat"],
  menthol: ["c10h20o", "mint"],
  melatonin: ["c13h16n2o2", "sleep hormone"],
  adrenaline: ["c9h13no3", "epinephrine"],
  heme_blood_red: ["c34h32fen4o4", "hemoglobin", "heme b"]
};

export function CompoundGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCols(2);
      else if (window.innerWidth < 1024) setCols(3);
      else if (window.innerWidth < 1280) setCols(4);
      else setCols(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredCompounds = useMemo(() => {
    if (!searchQuery.trim()) return COMPOUND_GALLERY_DATA;
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.replace(/[\s+]/g, ""); // e.g. "na+cl" -> "nacl"
    const isSingleChar = q.length === 1;

    return COMPOUND_GALLERY_DATA.filter((c) => {
      const name = c.name.toLowerCase();
      const mix = c.mix.toLowerCase();
      const elementsInRecipe = c.mix
        .split("+")
        .map((el) => el.trim().toLowerCase());
      const compactMix = c.mix.replace(/[\s+]/g, "").toLowerCase();

      // 1. Single-character search (e.g. 'c', 'o', 'h', 'n', 's')
      // Only match compounds containing that exact element in their recipe (e.g. C, O, H)
      // or names where a word begins with that letter (e.g. 'Ozone').
      // Prevents 1-letter searches from matching every unrelated word.
      if (isSingleChar) {
        const hasElement = elementsInRecipe.includes(q);
        const nameWordStarts = name
          .split(/[\s&()\-]+/)
          .some((w) => w.startsWith(q));
        return hasElement || nameWordStarts;
      }

      // 2. Compound Name match (e.g. "Water", "Table Salt", "Rust", "Stomach Acid")
      if (name.includes(q)) return true;

      // 3. Direct Recipe / Formula match
      // e.g. "H + Cl", or compressed "hcl", or element list
      if (mix.includes(q) || compactMix === cleanQ || compactMix.includes(cleanQ)) {
        return true;
      }

      // 4. Exact element search in the recipe (e.g. "Na", "Cl", "Fe", "Cu", "Sn", "Zn", "Ca", "Mg")
      if (elementsInRecipe.includes(q)) {
        return true;
      }

      // 5. Chemical formula notation with numbers stripped (e.g. "h2o" -> "ho")
      const formulaCharsOnly = cleanQ.replace(/\d+/g, "");
      if (formulaCharsOnly && formulaCharsOnly === compactMix) {
        return true;
      }

      // 6. Chemical formula & scientific synonym mapping (e.g. "NaCl", "H2O", "HCl", "CO2", "NaHCO3")
      const syns = COMPOUND_SYNONYMS[c.id];
      if (syns && syns.some((s) => s.includes(cleanQ) || s.includes(q))) {
        return true;
      }

      // 7. Scientific facts / Description match:
      // STRICT: Only match for queries with 3+ characters, and require whole-word or word-prefix matching.
      // Prevents 2-letter elements or common English syllables from matching unrelated descriptions.
      if (q.length >= 3) {
        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const wordRegex = new RegExp(`\\b${escaped}`, "i");
        if (wordRegex.test(c.desc)) {
          return true;
        }
      }

      return false;
    });
  }, [searchQuery]);

  const honeycombRows = useMemo(() => {
    const strips = [];
    let i = 0;
    while (i < filteredCompounds.length) {
      strips.push(filteredCompounds.slice(i, i + cols));
      i += cols;
    }
    return strips;
  }, [filteredCompounds, cols]);

  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col bg-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-16 py-10 flex-1 flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="font-mono text-xs text-cyan tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
              <Sparkles className="size-3.5 text-cyan" /> ELEMENTAL ENCYCLOPEDIA
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl font-bold text-white flex items-center gap-3"
              style={{ textShadow: "0 0 25px rgba(6,182,212,0.4)" }}
            >
              <FlaskConical className="size-10 text-cyan shrink-0" /> Compound Gallery
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed font-sans">
              Explore how fundamental elements combine to create real-world molecules, materials, and compounds. Click any card to reveal its synthesis recipe and scientific facts!
            </p>
          </div>

          {/* Stats Box */}
          <div className="flex flex-col gap-2 rounded-2xl border border-cyan/40 bg-slate-950/90 p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="size-3.5 text-cyan" /> Total Compounds
              </span>
              <span className="font-bold text-cyan text-sm">
                {filteredCompounds.length} / {COMPOUND_GALLERY_DATA.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan via-blue-500 to-magenta transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{
                  width: `${Math.round(
                    (filteredCompounds.length / COMPOUND_GALLERY_DATA.length) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Search / Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, recipe (e.g. H + Cl), or fact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2 self-start sm:self-auto">
            <Filter className="size-3.5 text-cyan" /> Showing {filteredCompounds.length} compound cards
          </div>
        </div>

        {/* Beehive Hexagon Grid */}
        {filteredCompounds.length > 0 ? (
          <div className="flex flex-col items-center pb-32">
            {honeycombRows.map((strip, sIdx) => (
              <div 
                key={sIdx} 
                className="flex justify-center" 
                style={{ 
                  marginTop: sIdx === 0 ? 0 : "-116px",
                  zIndex: 20 - sIdx // prevent z-fighting on overlaps
                }}
              >
                {strip.map((compound, cIdx) => (
                  <div 
                    key={compound.id}
                    className="relative"
                    style={{
                      marginLeft: cIdx === 0 ? 0 : "-60px",
                      marginTop: cIdx % 2 === 1 ? "128px" : "0px",
                      zIndex: 30 - cIdx // left-to-right stacking
                    }}
                  >
                    <CompoundCard compound={compound} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-slate-900 border border-slate-800 mb-4 text-slate-500">
              <FlaskConical className="size-12" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No compounds found</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              We couldn't find any compounds matching "{searchQuery}". Try searching for another name or chemical symbol.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 text-xs font-mono bg-cyan/20 border border-cyan/40 text-cyan rounded-lg hover:bg-cyan/30 transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-auto shrink-0 bg-slate-950">
        Elementopia · Compound Gallery · Molecular Codex
      </footer>
    </div>
  );
}
export default CompoundGalleryPage;
