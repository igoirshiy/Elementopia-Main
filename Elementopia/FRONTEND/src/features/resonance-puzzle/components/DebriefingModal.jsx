import React, { useState } from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Trophy, CheckCircle, ArrowRight, RotateCcw, Sparkles, Film, Atom, Layers, LayoutDashboard } from 'lucide-react';

const BOND_THEORY_METADATA = {
	"H₂O": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "2 single shared O-H pairs, 2 lone pairs on Oxygen",
		theory: "Oxygen strongly attracts shared electrons, creating positive/negative poles (dipole moment).",
		utility: "Universal cooling solvent, biological cellular buffer.",
		video: "/videos/water.mp4"
	},
	"H₂O₂": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "O-O single bond bridge with 2 O-H single bonds",
		theory: "Unstable peroxide bridge ready to oxidize microbial walls upon contact.",
		utility: "Topical antiseptic disinfectant and industrial bleaching agent.",
		video: "/videos/water.mp4"
	},
	"NH₃": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "3 single N-H shared pairs, 1 lone pair on Nitrogen",
		theory: "Trigonal pyramidal geometry with a lone pair that readily accepts protons.",
		utility: "Agricultural fertilizer synthesis and industrial alkaline glass cleaner.",
		video: "/videos/ammonia.mp4"
	},
	"HCl": {
		bondType: "Polar Covalent",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "1 shared H-Cl electron pair, 3 lone pairs on Chlorine",
		theory: "Strongly electronegative chlorine pulls electron density, ionizing rapidly in aqueous solutions.",
		utility: "Gastric digestive acid and industrial masonry scale remover.",
		video: "/videos/hydrogen_chloride.mp4"
	},
	"CH₄": {
		bondType: "Nonpolar Covalent",
		typeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		lewis: "4 single C-H covalent bonds completing Carbon's octet",
		theory: "Symmetric tetrahedral geometry cancels all dipoles, forming a stable nonpolar gas.",
		utility: "Clean-burning primary component of natural gas fuel.",
		video: "/videos/methane.mp4"
	},
	"CO₂": {
		bondType: "Nonpolar Covalent",
		typeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		lewis: "2 double bonds (O=C=O), 4 shared electron pairs total",
		theory: "Linear molecular shape where opposing dipoles neutralize each other.",
		utility: "Plant photosynthesis reactant and cryogenic dry ice refrigerant.",
		video: "/videos/carbon_dioxide.mp4"
	},
	"NaCl": {
		bondType: "Ionic Bond",
		typeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		lewis: "Na⁺ [2,8] cation and Cl⁻ [2,8,8] anion crystal lattice",
		theory: "Sodium surrenders its valence electron completely to Chlorine; electrostatic charge binds the lattice.",
		utility: "Human nervous electrolyte conduction and food preservation.",
		video: "/videos/sodium chloride.mp4"
	},
	"NaOH": {
		bondType: "Ionic + Covalent",
		typeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		lewis: "Na⁺ ion electrostatically bound to polyatomic [O-H]⁻ anion",
		theory: "Dual bonding: metal-to-polyatomic ionic attraction combined with internal covalent sharing.",
		utility: "Industrial drain opener and soap saponification base.",
		video: "/videos/sodium_hydroxide.mp4"
	}
};

export function DebriefingModal({ domain, stats = {}, onContinue, onRetry }) {
	const allDomainCompounds = React.useMemo(() => {
		if (!domain) return [];
		if (domain.stages) {
			return Object.values(domain.stages).flatMap(stage => stage.required || []);
		}
		return domain.required || [];
	}, [domain]);

	const compoundsCreated = (stats?.compounds && stats.compounds.length > 0)
		? stats.compounds
		: allDomainCompounds.length > 0
			? allDomainCompounds
			: [{ name: "Water", formula: "H₂O" }, { name: "Ammonia", formula: "NH₃" }, { name: "Methane", formula: "CH₄" }];

	const compoundCount = stats?.compoundCount ?? compoundsCreated.length;
	const accuracy = stats?.accuracy ?? 95;
	const timeTaken = stats?.time ?? "01:45";
	const [selectedIdx, setSelectedIdx] = useState(0);
	const activeCompound = compoundsCreated[selectedIdx] || compoundsCreated[0];
	const activeFormula = typeof activeCompound === 'string' ? activeCompound : activeCompound.formula;
	const activeName = typeof activeCompound === 'string' ? '' : activeCompound.name;

	const theoryInfo = BOND_THEORY_METADATA[activeFormula] || {
		bondType: domain?.id === "covalent" ? "Covalent Bond" : "Ionic Bond",
		typeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
		lewis: "Valence electrons paired to satisfy the stable octet configuration.",
		theory: domain?.story || "Atoms bond to achieve outer shell stability.",
		utility: activeCompound?.missionRole || "Essential chemical compound.",
		video: activeCompound?.localVideo || "/videos/water.mp4"
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
			<div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md grid-bg" />
			<div className="relative w-full max-w-md md:max-w-4xl rounded-3xl border border-cyan/40 bg-slate-950/95 p-4 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up max-h-[90vh] overflow-y-auto text-left">

				<div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
					<div className="flex items-center gap-2.5">
						<div className="p-2 sm:p-2.5 rounded-xl bg-cyan/20 text-cyan border border-cyan/40 shrink-0">
							<Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
						</div>
						<div>
							<span className="font-mono text-[10px] text-cyan uppercase tracking-widest block">
								Educational Debriefing
							</span>
							<h2 className="font-pixel text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
								{domain?.name || "Domain"} Cleared!
							</h2>
						</div>
					</div>

					<div className="hidden sm:flex items-center gap-3 font-mono text-xs text-right">
						<div>
							<span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
							<span className="font-bold text-emerald-400">{accuracy}%</span>
						</div>
						<div className="h-6 w-px bg-slate-800" />
						<div>
							<span className="text-[10px] text-slate-400 block uppercase">Time</span>
							<span className="font-bold text-cyan">{timeTaken}</span>
						</div>
					</div>
				</div>

				<div className="mb-4">
					<DoctorAtomAssistant
						title="Doctor Atom · Lab Analysis"
						message={`Terrific synthesis! You formed all ${compoundCount} target compounds.\n\n💡 Examine the reaction playback and Lewis dot structure below before proceeding.`}
						isTalking={false}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
								<div className="text-center p-4 text-slate-500 font-mono text-xs flex flex-col items-center gap-1.5">
									<Film className="w-6 h-6 text-slate-600" />
									<span>Reaction Animation Completed</span>
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
											className={`min-h-[36px] sm:min-h-[38px] px-3 py-1.5 rounded-xl border font-mono text-xs transition cursor-pointer flex items-center gap-1.5 ${isSelected
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

					<div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan/30 flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800 mb-2.5">
								<div className="flex items-center gap-1.5">
									<Atom className="w-4 h-4 text-cyan shrink-0" />
									<span className="font-mono font-bold text-white text-sm">
										{activeFormula} {activeName && `— ${activeName}`}
									</span>
								</div>
								<span className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theoryInfo.typeColor}`}>
									{theoryInfo.bondType}
								</span>
							</div>

							<div className="space-y-2.5 text-xs font-mono">
								<div>
									<span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Lewis Dot Structure:</span>
									<div className="text-slate-200 bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-[11px]">
										{theoryInfo.lewis}
									</div>
								</div>
								<div>
									<span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Bonding Mechanism & Octet:</span>
									<p className="text-slate-300 font-sans text-[11px] leading-relaxed">
										{theoryInfo.theory}
									</p>
								</div>
								<div>
									<span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-0.5">Real-World Utility:</span>
									<p className="text-emerald-300 font-sans text-[11px] leading-relaxed">
										{theoryInfo.utility}
									</p>
								</div>
							</div>
						</div>

						<div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 font-mono text-[10px] text-cyan">
							<CheckCircle className="w-3.5 h-3.5 text-cyan" />
							<span>Octet Stability Verified for Grade 9 DepEd Competency</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
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
				</div>
			</div>
		</div>
	);
}