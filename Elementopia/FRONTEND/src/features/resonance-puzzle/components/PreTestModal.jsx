import React, { useState } from 'react';
import { FlaskConical, CheckCircle2, Sparkles, ArrowRight, Award, HelpCircle, X } from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';
import { supabase } from '@/integrations/supabase/client';

export const PRETEST_QUESTIONS = [
  {
    id: 'q1',
    question: 'Which of the following compounds is formed through a Covalent Bond (sharing electrons between nonmetals)?',
    options: [
      { id: 'a', text: 'NaCl (Sodium Chloride / Table Salt)' },
      { id: 'b', text: 'H₂O (Water)', isCorrect: true },
      { id: 'c', text: 'MgO (Magnesium Oxide)' },
      { id: 'd', text: 'LiF (Lithium Fluoride)' },
    ],
    hint: 'Covalent bonds occur between non-metal atoms that share valence electron pairs.'
  },
  {
    id: 'q2',
    question: 'Carbon (C) has 4 valence electrons. How many Hydrogen (H) atoms are required to form a stable Methane (CH₄) molecule satisfying the octet rule?',
    options: [
      { id: 'a', text: '2 Hydrogen atoms' },
      { id: 'b', text: '3 Hydrogen atoms' },
      { id: 'c', text: '4 Hydrogen atoms', isCorrect: true },
      { id: 'd', text: '8 Hydrogen atoms' },
    ],
    hint: 'Carbon shares one electron with each of four Hydrogen atoms to complete its outer shell of 8.'
  },
  {
    id: 'q3',
    question: 'What occurs during the formation of an Ionic Bond between a metal and a nonmetal (such as Na and Cl)?',
    options: [
      { id: 'a', text: 'Valence electrons are completely transferred from metal to nonmetal, creating opposing ions.', isCorrect: true },
      { id: 'b', text: 'Electrons are equally shared between both atoms.' },
      { id: 'c', text: 'Protons leave the atomic nucleus to form a neutral lattice.' },
      { id: 'd', text: 'Atoms fuse together without exchanging any electrons.' },
    ],
    hint: 'Metals surrender electrons to become positive cations, while nonmetals gain electrons to become negative anions.'
  },
  {
    id: 'q4',
    question: 'According to the Octet Rule, main group chemical elements combine to achieve how many valence electrons in their outermost shell?',
    options: [
      { id: 'a', text: '2 electrons (except for noble gases)' },
      { id: 'b', text: '6 electrons' },
      { id: 'c', text: '8 electrons (stable noble gas configuration)', isCorrect: true },
      { id: 'd', text: '10 electrons' },
    ],
    hint: 'Atoms react to reach the stable configuration of noble gases, which is 8 outer electrons.'
  },
  {
    id: 'q5',
    question: 'When an invalid reaction combination occurs in synthesis, what does a "Meaningful Byproduct" indicate?',
    options: [
      { id: 'a', text: 'The elements chosen did not balance valence requirements or violated the stable octet ratio.', isCorrect: true },
      { id: 'b', text: 'The laboratory equipment suffered a random software glitch.' },
      { id: 'c', text: 'The reaction was completely correct, but the system ran out of time.' },
      { id: 'd', text: 'The atomic nuclei dissolved into pure energy.' },
    ],
    hint: 'Meaningful byproducts teach you about stoichiometric ratios and valence deficits instead of just giving a generic error.'
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

  const handleSubmit = async () => {
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

    try {
      localStorage.setItem(`elementopia_pretest_${nickname || 'guest'}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save pretest locally:', e);
    }

    try {
      fetch(`${API_BASE_URL}/api/telemetry/pretest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(err => {
        console.warn('Backend pretest telemetry sync failed, trying direct Supabase fallback:', err);
      });
    } catch (e) {
      console.warn('Error during pretest backend dispatch:', e);
    }

    try {
      if (supabase && typeof supabase.from === 'function') {
        supabase.from('pretest_diagnostic').insert([
          {
            session_nickname: payload.nickname,
            score: payload.score,
            total: payload.total,
            percentage: payload.percentage,
            answers_json: payload.answers,
            created_at: payload.timestamp
          }
        ]).then(({ error }) => {
          if (error) console.warn('Supabase direct pretest insert:', error.message);
        });
      }
    } catch (err) {
      // Ignored if table does not exist or user is offline
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
