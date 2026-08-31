import React from 'react';

export function DoctorAtomAssistant({
    message,
    title = "Doctor Atom (Guide)",
    isTalking = true,
    variant = "dialogue"
}) {
    const avatarSrc = isTalking ? "/doctor_atom_talking.gif" : "/doctor_atom_idle.png";

    return (
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-cyan/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">

            <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-slate-950 flex items-center justify-center">
                    <img
                        src={avatarSrc}
                        alt="Doctor Atom"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/doctor_atom.png"; }}
                    />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan border-2 border-slate-950"></span>
                </span>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
                        {title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan/20 text-cyan border border-cyan/40 font-mono font-bold">
                        GUIDE ACTIVE
                    </span>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {message}
                </div>
            </div>
        </div>
    );
}
