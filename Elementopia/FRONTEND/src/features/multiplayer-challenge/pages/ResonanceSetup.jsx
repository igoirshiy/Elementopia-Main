import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Atom, Plus, Zap, Timer, Trophy, KeyRound, Share2, FlaskConical, Medal } from "lucide-react";
import { SiteHeader } from "@/components/common/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { createRoom } from "@/features/multiplayer-challenge/lib/room";
import { getStoredNickname, setStoredNickname } from "@/features/auth-user/lib/session";

export default function ResonanceSetup() {
  const navigate = useNavigate();
  const [mode] = useState("create");
  const [nickname, setNickname] = useState(getStoredNickname());
  const [teamSize, setTeamSize] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      setStoredNickname(nickname);
      const room = await createRoom(nickname, teamSize);
      navigate(`/challenge/${room.code}`);
    } catch (e) {
      toast.error(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="elementopia-scope min-h-screen flex flex-col bg-gradient-hero text-foreground">
      <SiteHeader />
      <main className="flex-1 w-full">
        <Toaster theme="dark" position="top-center" />
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
          <header className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Atom className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm tracking-widest text-muted-foreground">RESONANCE / MOD-3</span>
          </header>

          <section className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl text-white">
                Race to <span className="text-magenta text-glow-magenta font-pixel text-4xl leading-tight block mt-2">compound</span> first.
              </h1>
              <p className="mt-6 max-w-md text-lg text-white/70">
                No accounts. No friction. Spin up a duel, share a 5-digit code, and out-think your opponent in synchronized real-time chemistry combat.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/60">
                <Feature icon={<Zap className="h-4 w-4" />} label="≤5s matchmaking" />
                <Feature icon={<Timer className="h-4 w-4" />} label="Synchronized puzzles" />
                <Feature icon={<Trophy className="h-4 w-4" />} label="Speed × efficiency" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-black/50 p-8 backdrop-blur">


                {mode !== "idle" && (
                  <div className="space-y-4">
                    <button onClick={() => navigate("/challenge")} className="text-xs text-white/50 hover:text-white transition">← Back to Lobby</button>
                    <h2 className="text-lg font-semibold text-white">
                      Create a room
                    </h2>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-white/50">Nickname (optional)</label>
                      <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Neon_88" maxLength={20} className="h-12 text-white border-white/20 focus:border-magenta" />
                    </div>
                    {mode === "create" && (
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-white/50">Format</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setTeamSize(n)}
                              className={`rounded-xl border py-3 font-mono text-sm transition ${
                                teamSize === n
                                  ? "border-magenta bg-magenta/20 text-white shadow-glow"
                                  : "border-white/10 bg-white/5 text-white/50 hover:border-magenta/50"
                              }`}
                            >
                              {n}v{n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={handleCreate}
                      disabled={loading}
                      className="mt-2 h-14 w-full bg-gradient-primary text-white shadow-glow hover:opacity-90 font-bold"
                    >
                      {loading ? "Connecting…" : `Generate ${teamSize}v${teamSize} Code`}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mt-28">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-xs tracking-widest text-white/50">HOW IT WORKS</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl text-white">
                  From zero to <span className="text-magenta text-glow-magenta font-pixel text-xl leading-tight">duel</span> in seconds.
                </h2>
              </div>
              <span className="hidden font-mono text-xs text-white/30 md:block">04 STEPS</span>
            </div>

            <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Step
                n="01"
                icon={<KeyRound className="h-5 w-5" />}
                title="Create or Join"
                body="Spin up a room or punch in a 5-digit code. No accounts, no email, no friction."
                tag="UC-3.1"
              />
              <Step
                n="02"
                icon={<Share2 className="h-5 w-5" />}
                title="Share the Code"
                body="Send the 5-character code to your opponent. They land in your lobby instantly."
                tag="UC-3.1"
              />
              <Step
                n="03"
                icon={<FlaskConical className="h-5 w-5" />}
                title="Race to Compound"
                body="A 3-second countdown drops a synchronized puzzle. Same elements, same target — pure skill."
                tag="UC-3.2"
              />
              <Step
                n="04"
                icon={<Medal className="h-5 w-5" />}
                title="Instant Verdict"
                body="First to compound wins. Ties broken by fewer errors. Result locks both interfaces."
                tag="UC-3.3"
              />
            </ol>
          </section>

          <footer className="mt-24 border-t border-white/10 pt-6 text-center text-xs text-white/30">
            UC-3.1 · UC-3.2 · UC-3.3 — Opponent-Based Challenge Module
          </footer>

        </div>
      </main>
    </div>
  );
}

function Feature({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      {icon}<span>{label}</span>
    </div>
  );
}

function Step({ n, icon, title, body, tag }) {
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur transition hover:border-magenta/50 hover:bg-black/60">
      <div className="absolute -right-6 -top-6 font-mono text-7xl font-bold text-white/5 transition group-hover:text-magenta/20">
        {n}
      </div>
      <div className="relative flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
          {icon}
        </div>
        <span className="font-mono text-[10px] tracking-widest text-white/40">{tag}</span>
      </div>
      <h3 className="relative mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-white/60">{body}</p>
    </li>
  );
}
