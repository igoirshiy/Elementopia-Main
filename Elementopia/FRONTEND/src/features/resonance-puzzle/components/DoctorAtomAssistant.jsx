import React from 'react';

export function DoctorAtomAssistant({
    message,
    title = "Doctor Atom (Guide)",
    isTalking = true,
    variant = "dialogue",
    className = ""
}) {
    const avatarSrc = isTalking ? "/doctor_atom_talking.gif" : "/doctor_atom_idle.png";

    return (
        <div className={`flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-slate-900/80 border border-cyan/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] h-full ${className}`}>

            <div className="relative shrink-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-slate-950 flex items-center justify-center">
                    <img
                        src={avatarSrc}
                        alt="Doctor Atom"
                        className="w-full h-full object-cover object-[center_12%] scale-125"
                        onError={(e) => { e.target.src = "/doctor_atom.png"; }}
                    />
                </div>
            </div>
            <div className="flex-1 flex flex-col h-full w-full">
                <div className="flex items-center gap-2 mb-2.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-cyan uppercase tracking-wider">
                        {title}
                    </span>
                    <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded bg-cyan/20 text-cyan border border-cyan/40 font-mono font-bold">
                        GUIDE ACTIVE
                    </span>
                </div>
                <div className="flex-1 text-sm sm:text-base text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-4 sm:p-5 rounded-xl border border-slate-800 flex items-center">
                    {typeof message === 'string' ? (
                        <div className="space-y-3 leading-relaxed w-full">
                            {message.split('\n\n').map((paragraph, idx) => {
                                const isTip = paragraph.trim().startsWith('💡') || paragraph.trim().startsWith('⚡') || paragraph.trim().startsWith('Tip:');
                                return (
                                    <p
                                        key={idx}
                                        className={isTip ? "pt-2.5 mt-2.5 border-t border-cyan/20 text-cyan-300/95 font-medium text-xs sm:text-sm leading-relaxed" : "leading-relaxed"}
                                    >
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </div>
                    ) : (
                        message
                    )}
                </div>
            </div>
        </div>
    );
}
