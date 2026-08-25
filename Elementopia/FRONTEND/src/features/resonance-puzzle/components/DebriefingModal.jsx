// src/features/resonance-puzzle/components/DebriefingModal.jsx
import React from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Trophy, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';

export function DebriefingModal({ domain, stats = {}, onContinue, onRetry }) {
    const compoundsCreated = stats.compounds || ["H2O", "NaCl", "CO2"];
    const accuracy = stats.accuracy || 95;
    const timeTaken = stats.time || "01:45";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-md grid-bg" />

            <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/40 bg-slate-950/95 p-8 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-fade-up">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest">
                            Mission Debriefing Complete
                        </div>
                        <h2 className="font-pixel text-2xl font-bold text-white">
                            {domain?.name || "Domain"} Cleared!
                        </h2>
                    </div>
                </div>

                {/* Doctor Atom Evaluation */}
                <div className="mb-6">
                    <DoctorAtomAssistant
                        title="Doctor Atom Debriefing"
                        message={`Outstanding work, researcher! You successfully cleared the domain. Your synthesis accuracy reached ${accuracy}%. Here is a breakdown of what you accomplished.`}
                        isTalking={false}
                    />
                </div>

                {/* Performance Metrics & Scientific Recap */}
                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="font-mono text-[10px] text-slate-400 uppercase">Accuracy</div>
                        <div className="font-mono text-lg font-bold text-emerald-400">{accuracy}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="font-mono text-[10px] text-slate-400 uppercase">Time Elapsed</div>
                        <div className="font-mono text-lg font-bold text-cyan">{timeTaken}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <div className="font-mono text-[10px] text-slate-400 uppercase">Compounds</div>
                        <div className="font-mono text-lg font-bold text-magenta">{compoundsCreated.length}</div>
                    </div>
                </div>

                {/* Key Educational Takeaways */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6">
                    <div className="font-mono text-xs uppercase text-slate-300 font-bold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" /> Key Concepts Mastered
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        By completing this domain, you confirmed how specific elements form stable octets through electron sharing, neutralizing chemical barriers.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-6">
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 transition"
                    >
                        <RotateCcw className="w-4 h-4" /> Replay Domain
                    </button>
                    <button
                        onClick={onContinue}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 font-mono font-bold text-xs text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] uppercase tracking-wider"
                    >
                        Continue to Hub <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
