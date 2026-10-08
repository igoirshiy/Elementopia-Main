import React, { useState } from 'react';
import { FlaskConical, CheckCircle2, Sparkles, ArrowRight, Award, HelpCircle, X } from 'lucide-react';

export const PRETEST_QUESTIONS = [
  {
    id: 'q1',
    question: 'Which of the following compounds is formed through a Covalent Bond (sharing electrons)?',
    options: [
      { id: 'a', text: 'NaCl (Sodium Chloride / Salt)' },
      { id: 'b', text: 'H₂O (Water)', isCorrect: true },
      { id: 'c', text: 'MgO (Magnesium Oxide)' },
      { id: 'd', text: 'LiF (Lithium Fluoride)' },
    ],
    hint: 'Covalent bonds occur between non-metal atoms sharing valence electron pairs.'
  },
  {
    id: 'q2',
    question: 'Carbon C has 4 valence electrons. How many Hydrogen H atoms did you need to combine with one Carbon atom to form a stable Methane (CH₄) compound?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3' },
      { id: 'c', text: '4', isCorrect: true },
      { id: 'd', text: '6' },
    ],
    hint: 'Carbon needs 4 more electrons to satisfy the stable octet of 8 electrons.'
  },
  {
    id: 'q3',
    question: 'When an invalid reaction occurred, what did the "Meaningful Byproduct" alert help you realize?',
    options: [
      { id: 'a', text: 'That the elements chosen did not satisfy the octet rule or had the wrong stoichiometric ratio.', isCorrect: true },
      { id: 'b', text: 'It only told me the attempt failed without explaining why.' },
      { id: 'c', text: 'It gave me the direct answer immediately.' },
    ],
    hint: 'Meaningful Byproducts provide educational feedback on valence ratios and octet stability.'
  }
];

export function PreTestModal({ nickname, onComplete, onCancel }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelect = (questionId, optionId) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const allAnswered = PRETEST_QUESTIONS.every(q => answers[q.id]);

  const handleSubmit = () => {
    let score = 0;
    PRETEST_QUESTIONS.forEach(q => {
      const selected = q.options.find(opt => opt.id === answers[q.id]);
      if (selected?.isCorrect) score += 1;
    });

    const payload = {
      nickname: nickname || 'Alchemist',
      score,
      total: PRETEST_QUESTIONS.length,
      percentage: Math.round((score / PRETEST_QUESTIONS.length) * 100),
      answers,
      timestamp: new Date().toISOString()
    };

    // Save to local storage for persistent linkage with post-test
    try {
      localStorage.setItem(`elementopia_pretest_${nickname || 'guest'}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save pretest locally:', e);
    }

    setResult(payload);
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (onComplete) onComplete(result);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-cyan/50 bg-slate-900/95 p-5 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-left my-8">
        {/* Glow Header Accent */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan via-magenta to-indigo-500 rounded-t-2xl" />

        {!submitted ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan/15 border border-cyan/40 text-cyan font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  <FlaskConical className="size-3 animate-pulse" /> Diagnostic Baseline
                </div>
                <h2 className="font-pixel text-xl sm:text-2xl text-white font-bold text-glow-cyan">
                  Dr. Atom · Pre-Game Knowledge Check
                </h2>
                <p className="font-mono text-xs text-slate-400 mt-1">
                  Answer these 3 quick chemistry questions to establish your baseline before entering the caverns!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs text-cyan font-bold">
                  {Object.keys(answers).length} / {PRETEST_QUESTIONS.length}
                </span>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title="Close"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4 mb-6 max-h-[55vh] overflow-y-auto pr-1">
              {PRETEST_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition">
                  <div className="flex items-start gap-2.5 mb-3">
                    <span className="size-6 rounded-full bg-cyan/20 border border-cyan/40 text-cyan font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-sans text-sm font-semibold text-slate-200 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="space-y-2 pl-8">
                    {q.options.map(opt => {
                      const isSelected = answers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelect(q.id, opt.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg border font-mono text-xs transition-all flex items-center gap-2.5 cursor-pointer ${isSelected
                              ? 'border-cyan bg-cyan/15 text-cyan-200 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                              : 'border-slate-800/80 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                            }`}
                        >
                          <span className={`size-4 rounded-full border flex items-center justify-center text-[9px] shrink-0 ${isSelected ? 'border-cyan bg-cyan text-slate-950 font-bold' : 'border-slate-600'
                            }`}>
                            {opt.id.toUpperCase()}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-3">
              <span className="font-mono text-[11px] text-slate-500 italic">
                * Matches your post-game mastery survey
              </span>
              <button
                type="button"
                disabled={!allAnswered}
                onClick={handleSubmit}
                className={`px-5 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 ${allAnswered
                    ? 'bg-gradient-to-r from-cyan to-indigo-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                  }`}
              >
                <span>Submit Baseline Diagnostic</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </>
        ) : (
          /* Submission Confirmation & Score Display */
          <div className="py-6 px-2 text-center animate-fade-in space-y-4">
            <div className="size-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <Award className="size-8 animate-bounce" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold mb-2">
                <CheckCircle2 className="size-3.5" /> Pre-Test Recorded
              </div>
              <h2 className="font-pixel text-2xl text-white font-bold">
                Baseline Established!
              </h2>
              <p className="font-mono text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Doctor Atom recorded your starting baseline score of:
              </p>
            </div>

            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-950 border border-cyan/40 shadow-inner">
              <div className="text-left font-mono">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Score</div>
                <div className="text-2xl font-bold text-cyan font-pixel">{result?.score} / {result?.total}</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-left font-mono">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Baseline</div>
                <div className="text-2xl font-bold text-emerald-400 font-pixel">{result?.percentage}%</div>
              </div>
            </div>

            <p className="font-mono text-xs text-slate-400 max-w-lg mx-auto">
              Now enter the Elemental Caverns and master the bonds. At the end of testing, take the post-test to evaluate your learning gain!
            </p>

            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan text-slate-950 font-mono text-xs font-bold hover:brightness-110 shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer inline-flex items-center gap-2 mt-2"
            >
              <span>Enter Elemental Caverns</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
