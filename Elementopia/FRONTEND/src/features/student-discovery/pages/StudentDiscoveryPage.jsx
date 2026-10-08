import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "@mui/material";
import { SiteHeader } from '@/components/common/SiteHeader';
import DiscoveryService, { normalizeDiscovery } from '@/features/student-discovery/services/DiscoveryService';
import UserService from '@/features/auth-user';
import ScienceIcon from "@mui/icons-material/Science";
import { Sparkles, Lock, Filter, CheckCircle2, Leaf, FlaskConical, Zap, Globe2, Beaker, Compass, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MASTER_DISCOVERIES } from "../data/discovery-data";
import { MolecularBallAndStickVisualizer } from "../components/MolecularBallAndStickVisualizer";
import { SynthesisFeedbackModal } from "@/components/SynthesisFeedbackModal";
import compoundElements from "@/features/resonance-puzzle/data/compound-elements.json";

export function StudentDiscoveryPage() {
  const [userDiscoveries, setUserDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscovery, setSelectedDiscovery] = useState(null);
  const [selectedSandboxCompound, setSelectedSandboxCompound] = useState(null);
  const [activeTab, setActiveTab] = useState("domain"); // "domain" or "sandbox"
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, Natural, Synthetic
  const [sandboxSearch, setSandboxSearch] = useState("");

  const fetchDiscoveries = async () => {
    try {
      const user = await UserService.getCurrentUser();
      const userId = user?.userId || "guest_id";
      const response = await DiscoveryService.getCurrentUserDiscoveries(userId);
      const data = response?.data || response || [];
      const normalized = Array.isArray(data) ? data.map(normalizeDiscovery) : [];
      setUserDiscoveries(normalized);
    } catch (error) {
      console.error("Failed to fetch discoveries:", error);
      const local = DiscoveryService.getLocalDiscoveries();
      setUserDiscoveries(Array.isArray(local) ? local.map(normalizeDiscovery) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoveries();

    // Listen for live discoveries saved from sandbox or game modes
    const handleDiscoveryAdded = () => {
      fetchDiscoveries();
    };

    window.addEventListener("elementopia_discovery_added", handleDiscoveryAdded);
    window.addEventListener("storage", handleDiscoveryAdded);

    return () => {
      window.removeEventListener("elementopia_discovery_added", handleDiscoveryAdded);
      window.removeEventListener("storage", handleDiscoveryAdded);
    };
  }, []);

  // Normalizes chemical formulas by converting Unicode subscripts (e.g. H₂O -> H2O)
  const normalizeFormula = (str = "") => {
    const subscripts = { '₀':'0', '₁':'1', '₂':'2', '₃':'3', '₄':'4', '₅':'5', '₆':'6', '₇':'7', '₈':'8', '₉':'9' };
    return str
      .split('')
      .map(c => subscripts[c] || c)
      .join('')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase();
  };

  const isUnlocked = (item) => {
    const normItemSym = normalizeFormula(item.symbol || "");
    const normItemName = (item.name || "").toLowerCase().replace(/[^a-z0-9]/g, '');

    // STRICT DOMAIN ISOLATION: Only unlocks if discovered through a story domain (source === "domain")
    const domainDiscoveries = userDiscoveries.filter((d) => (d.source || "domain") === "domain");

    return domainDiscoveries.some((d) => {
      const dName = (d.name || "").toLowerCase().replace(/[^a-z0-9]/g, '');
      const dSym = normalizeFormula(d.symbol || d.submissionString || "");

      // 1. Direct formula match (e.g., H2O === H2O, NACL === NACL)
      if (dSym && normItemSym && dSym === normItemSym) return true;

      // 2. Direct name substring / exact match (e.g. "Water", "Methane", "Ammonia")
      if (dName && normItemName && (dName === normItemName || normItemName.includes(dName) || dName.includes(normItemName))) return true;

      // 3. Known chemistry synonyms / aliases
      if (normItemName.includes("salt") && dName.includes("sodiumchloride")) return true;
      if (normItemName.includes("lye") && dName.includes("sodiumhydroxide")) return true;
      if (normItemName.includes("magnesia") && dName.includes("magnesiumhydroxide")) return true;
      if (normItemName.includes("vinegar") && (dName.includes("aceticacid") || dSym.includes("C2H4O2") || dSym.includes("CH3COOH"))) return true;
      if (normItemName.includes("bakingsoda") && dName.includes("sodiumbicarbonate")) return true;
      if (normItemName.includes("rust") && dName.includes("iron")) return true;

      return false;
    });
  };

  const unlockedCount = MASTER_DISCOVERIES.filter(item => isUnlocked(item)).length;
  const totalDomainCount = MASTER_DISCOVERIES.length;
  const progressPercent = Math.round((unlockedCount / totalDomainCount) * 100);

  const filteredDomainDiscoveries = MASTER_DISCOVERIES.filter(item => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "Natural") return item.origin === "Natural";
    if (activeFilter === "Synthetic") return item.origin === "Synthetic";
    return true;
  });

  // Enriched Sandbox Discoveries list: ONLY compounds synthesized in the sandbox laboratory (source === "sandbox")
  const sandboxList = useMemo(() => {
    const sandboxOnly = userDiscoveries.filter((d) => d.source === "sandbox");
    return sandboxOnly.map((disc) => {
      const matchInElements = compoundElements.find(
        (c) =>
          c.NAME.toLowerCase() === (disc.name || "").toLowerCase() ||
          normalizeFormula(c.Symbol) === normalizeFormula(disc.symbol || disc.submissionString || "")
      );

      return {
        ...disc,
        NAME: disc.name || matchInElements?.NAME || "Unknown Compound",
        Symbol: disc.symbol || matchInElements?.Symbol || disc.submissionString || "N/A",
        BondType: disc.bondType || matchInElements?.BondType || "Covalent",
        Description: disc.description || matchInElements?.Description || "Synthesized compound from sandbox laboratory.",
        RealWorldApplication: disc.realWorldApplication || matchInElements?.RealWorldApplication || "",
        Elements: matchInElements?.Elements || [],
        Uses: matchInElements?.Uses || ["Laboratory Experimentation"]
      };
    });
  }, [userDiscoveries]);

  const filteredSandboxList = useMemo(() => {
    if (!sandboxSearch.trim()) return sandboxList;
    const q = sandboxSearch.toLowerCase().trim();
    return sandboxList.filter(
      (item) =>
        item.NAME.toLowerCase().includes(q) ||
        item.Symbol.toLowerCase().includes(q) ||
        (item.BondType && item.BondType.toLowerCase().includes(q))
    );
  }, [sandboxList, sandboxSearch]);

  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-16 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="font-mono text-xs text-cyan tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
              <Sparkles className="size-3.5 text-cyan" /> LABORATORY CODEX & ARCHIVES
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white flex items-center gap-3" style={{ textShadow: '0 0 25px rgba(6,182,212,0.4)' }}>
              <ScienceIcon fontSize="large" sx={{ color: '#22d3ee' }} /> Alchemical Codex
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed font-sans">
              Review your chemical knowledge. Explore solutions unlocked through story domains or inspect compounds synthesized in the sandbox laboratory.
            </p>
          </div>

          {/* Progress / Stat Summary Box */}
          <div className="flex flex-col gap-2 rounded-2xl border border-cyan/40 bg-slate-950/90 p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">
                {activeTab === "domain" ? "Domain Codex Progress" : "Sandbox Syntheses"}
              </span>
              <span className="font-bold text-cyan">
                {activeTab === "domain"
                  ? `${unlockedCount} / ${totalDomainCount} (${progressPercent}%)`
                  : `${sandboxList.length} Syntheses Recorded`}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan via-indigo-500 to-magenta transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ width: `${activeTab === "domain" ? progressPercent : Math.min(100, (sandboxList.length / 20) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Primary Mode Tabs: Domain Storyline vs Sandbox Lab */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("domain")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === "domain"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan border border-cyan/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="size-4 text-cyan" />
              <span>Domain Storyline Codex ({totalDomainCount})</span>
            </button>
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === "sandbox"
                  ? "bg-gradient-to-r from-magenta/20 to-purple-500/20 text-magenta border border-magenta/40 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Beaker className="size-4 text-magenta" />
              <span>Sandbox Workbench Lab ({sandboxList.length})</span>
            </button>
          </div>

          {activeTab === "sandbox" && (
            <Link
              to="/student/sandbox"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 text-cyan font-mono text-xs font-bold uppercase tracking-wider transition"
            >
              <span>Launch Sandbox Lab</span>
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>

        {/* Tab 1: Domain Storyline View */}
        {activeTab === "domain" && (
          <>
            {/* Filter Controls for Domain */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mr-2 uppercase tracking-wider">
                <Filter className="size-3.5 text-cyan" /> Origin Filter:
              </div>
              <button
                onClick={() => setActiveFilter("ALL")}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${activeFilter === "ALL"
                  ? "bg-cyan text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
              >
                ALL ({totalDomainCount})
              </button>
              <button
                onClick={() => setActiveFilter("Natural")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${activeFilter === "Natural"
                  ? "bg-cyan text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
              >
                <Leaf className="size-3.5" /> NATURALLY OCCURRING
              </button>
              <button
                onClick={() => setActiveFilter("Synthetic")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${activeFilter === "Synthetic"
                  ? "bg-magenta text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
              >
                <FlaskConical className="size-3.5" /> HUMAN-MADE / SYNTHETIC
              </button>
            </div>

            {/* Domain Card Grid */}
            {loading ? (
              <div className="py-20 text-center font-mono text-sm text-cyan animate-pulse">
                ⚡ Loading Alchemical Codex archives...
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredDomainDiscoveries.map((item, index) => {
                  const unlocked = isUnlocked(item);

                  if (!unlocked) {
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 opacity-60 transition-all hover:opacity-80"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                              <Lock className="size-3 text-slate-500" /> Locked Entry
                            </span>
                            <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                              {item.domainId.toUpperCase()}
                            </span>
                          </div>
                          <div className="font-pixel text-lg font-bold text-slate-500 mb-1">
                            ??? Undiscovered
                          </div>
                          <p className="font-mono text-xs text-slate-600 mb-3">
                            Formula: Hidden
                          </p>
                          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 font-mono text-[11px] text-slate-500 leading-relaxed">
                            Solve challenge levels in the {item.domainId} domain to discover this entry.
                          </div>
                        </div>
                        <span className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          🔒 Synthesize to unlock codex data
                        </span>
                      </div>
                    );
                  }

                  const isNatural = item.origin === "Natural";

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDiscovery(item)}
                      className="text-left flex flex-col justify-between rounded-2xl border border-cyan/30 bg-slate-950/90 p-5 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:-translate-y-1 hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-40 transition">
                        <Sparkles className="w-12 h-12 text-cyan" />
                      </div>

                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${isNatural
                            ? "bg-cyan/10 text-cyan border-cyan/30"
                            : "bg-magenta/10 text-magenta border-magenta/30"
                            }`}>
                            {isNatural ? <Leaf className="size-3" /> : <FlaskConical className="size-3" />}
                            {item.origin}
                          </span>
                          <span className="font-mono text-[10px] text-cyan font-bold">
                            {item.abundance}
                          </span>
                        </div>

                        <h3 className="font-pixel text-base font-bold text-white group-hover:text-glow-white transition mb-1">
                          {item.name}
                        </h3>
                        <p className="font-mono text-xs font-bold text-cyan mb-3">
                          Formula: {item.symbol}
                        </p>

                        <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mb-4">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan group-hover:translate-x-1 transition">
                        <span>Inspect Molecular Data</span>
                        <span>→</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Sandbox Workbench Log View */}
        {activeTab === "sandbox" && (
          <div className="space-y-6">
            {/* Search & Counter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search sandbox discoveries (e.g. H2O, Salt, Ionic)..."
                  value={sandboxSearch}
                  onChange={(e) => setSandboxSearch(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 pl-10 text-xs font-mono text-white placeholder:text-slate-500 focus:border-magenta focus:outline-none"
                />
                <Beaker className="size-4 text-magenta absolute left-3.5 top-3" />
              </div>
              <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="size-4 text-magenta" />
                <span>Showing {filteredSandboxList.length} of {sandboxList.length} workbench discoveries</span>
              </div>
            </div>

            {/* Sandbox Cards Grid */}
            {filteredSandboxList.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8">
                <Beaker className="size-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-pixel text-lg text-white font-bold mb-1">No Sandbox Creations Yet</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto mb-5">
                  Combine elements on the freeform Chemistry Sandbox workbench to create new molecules and log them in your personal notebook!
                </p>
                <Link
                  to="/student/sandbox"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-magenta to-indigo-600 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-magenta/30 transition"
                >
                  Go to Sandbox Lab →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredSandboxList.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-magenta/30 bg-slate-950/90 p-5 shadow-[0_0_20px_rgba(236,72,153,0.1)] hover:-translate-y-1 hover:border-magenta/60 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)] transition group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-magenta/10 text-magenta border border-magenta/30 uppercase tracking-wider">
                          <Zap className="size-3" /> {item.BondType || "Covalent"}
                        </span>
                        {item.dateDiscovered && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500">
                            <Calendar className="size-3" /> {item.dateDiscovered}
                          </span>
                        )}
                      </div>

                      <h3 className="font-pixel text-base font-bold text-white group-hover:text-glow-magenta transition mb-1">
                        {item.NAME}
                      </h3>
                      <p className="font-mono text-xs font-bold text-magenta mb-3">
                        Formula: {item.Symbol}
                      </p>

                      <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2 mb-3">
                        {item.Description}
                      </p>

                      {item.RealWorldApplication && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed font-sans mb-3 line-clamp-2">
                          💡 {item.RealWorldApplication}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedSandboxCompound(item)}
                      className="mt-3 pt-3 border-t border-slate-800 w-full flex items-center justify-between text-xs font-mono font-bold text-magenta hover:text-white transition"
                    >
                      <span>Inspect Science Record</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sandbox Compound Synthesis Modal */}
        <SynthesisFeedbackModal
          open={!!selectedSandboxCompound}
          onClose={() => setSelectedSandboxCompound(null)}
          compound={selectedSandboxCompound}
        />

        {/* Compound Detail Modal */}
        <Modal
          open={!!selectedDiscovery}
          onClose={() => setSelectedDiscovery(null)}
        >
          <div className="elementopia-scope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] max-h-[90vh] outline-none border-none flex flex-col text-foreground">
            {selectedDiscovery && (
              <div className="relative bg-slate-950 border border-cyan/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col max-h-full overflow-y-auto custom-scrollbar">

                {/* Modal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-cyan/10 border border-cyan/40 px-3 py-1 text-xs font-mono font-bold text-cyan uppercase tracking-wider mb-2">
                      <CheckCircle2 className="size-3.5" /> Codex Master Entry
                    </span>
                    <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-white">
                      {selectedDiscovery.name}
                    </h2>
                    <p className="font-mono text-sm font-bold text-cyan mt-0.5">
                      Chemical Formula: {selectedDiscovery.symbol}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDiscovery(null)}
                    className="rounded-full bg-slate-900 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* 2D/3D Ball and Stick Molecular Visualizer */}
                <div className="my-3">
                  <MolecularBallAndStickVisualizer symbol={selectedDiscovery.symbol} />
                </div>

                {/* Real-World Specimen Photo */}
                {selectedDiscovery.image && (
                  <div className="my-4 rounded-2xl border border-cyan/30 bg-slate-900/80 p-4 shadow-lg">
                    <div className="font-mono text-[10px] text-cyan uppercase tracking-wider mb-3 font-bold flex items-center gap-1.5">
                      <span>📸</span> Real-World Specimen Photo
                    </div>
                    <div style={{ minHeight: '280px', height: '280px' }} className="w-full rounded-xl border border-slate-800 bg-slate-950">
                      <img
                        src={selectedDiscovery.image}
                        alt={`${selectedDiscovery.name} real world photo`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '0.75rem', display: 'block' }}
                      />
                    </div>
                  </div>
                )}

                {/* Compound Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Natural vs Synthetic Origin
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold ${selectedDiscovery.origin === "Natural" ? "text-cyan" : "text-magenta"
                      }`}>
                      {selectedDiscovery.origin === "Natural" ? <Leaf className="size-3.5" /> : <FlaskConical className="size-3.5" />}
                      {selectedDiscovery.origin === "Natural" ? "Naturally Occurring" : "Human-Made / Synthetic"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Natural Abundance
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan">
                      <Globe2 className="size-3.5" /> {selectedDiscovery.abundance} in Nature
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Chemical Profile & Octet Bonding
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                      {selectedDiscovery.description}
                    </p>
                  </div>

                  {/* Primary Applications */}
                  <div>
                    <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                      Primary Real-World Applications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDiscovery.uses?.map((use, idx) => (
                        <span key={idx} className="rounded-lg bg-cyan/10 border border-cyan/30 px-3 py-1 font-mono text-xs text-cyan font-bold">
                          ✓ {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedDiscovery(null)}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan via-indigo-500 to-magenta py-2.5 font-mono text-xs font-bold text-white shadow-md transition hover:scale-[1.01] uppercase tracking-wider"
                >
                  Close Codex Entry
                </button>

              </div>
            )}
          </div>
        </Modal>

      </main>
    </div>
  );
}

export default StudentDiscoveryPage;
