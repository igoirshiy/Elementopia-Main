import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/features/auth-user/lib/session";
import {
  bumpErrors,
  returnToLobby,
  startMatch,
  submitSolved,
  switchTeam,
} from "@/features/multiplayer-challenge/lib/room";
import { elementInfo } from "@/features/resonance-puzzle/lib/puzzles";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft, Copy, Trophy, Frown, Minus, Zap, X, Check, ArrowLeftRight } from "lucide-react";

export default function ChallengeMatch() {
  const { code } = useParams();
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load + subscribe
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: r } = await supabase.from("rooms").select("*").eq("code", code).maybeSingle();
      if (!active) return;
      setRoom(r);
      if (r) {
        const { data: ps } = await supabase.from("room_players").select("*").eq("room_id", r.id).order("joined_at");
        if (active) setPlayers(ps ?? []);
      }
      setLoading(false);
    })();
    const channel = supabase
      .channel(`room:${code}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `code=eq.${code}` },
        (payload) => {
          const next = (payload.new ?? null);
          if (next) setRoom(next);
        })
      .on("postgres_changes", { event: "*", schema: "public", table: "room_players" },
        async () => {
          const { data: r } = await supabase.from("rooms").select("id").eq("code", code).maybeSingle();
          if (!r) return;
          const { data: ps } = await supabase.from("room_players").select("*").eq("room_id", r.id).order("joined_at");
          setPlayers(ps ?? []);
        })
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, [code]);

  const me = useMemo(() => players.find((p) => p.session_id === sessionId) ?? null, [players, sessionId]);
  const isHost = !!me?.is_host;

  if (loading) {
    return <FullCenter><p className="text-white/50">Connecting to room…</p></FullCenter>;
  }
  if (!room) {
    return (
      <FullCenter>
        <p className="mb-4 text-white/50">Room <span className="font-mono text-white">{code}</span> not found.</p>
        <Button onClick={() => navigate("/")}><ArrowLeft className="mr-2 h-4 w-4" />Go home</Button>
      </FullCenter>
    );
  }

  return (
    <div className="elementopia-scope min-h-screen bg-gradient-hero text-foreground">
      <Toaster theme="dark" position="top-center" />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <button onClick={() => navigate("/challenge")} className="mb-6 flex items-center gap-2 text-xs text-white/50 hover:text-white transition">
          <ArrowLeft className="h-3 w-3" /> EXIT
        </button>

        {room.status === "lobby" && <Lobby room={room} players={players} me={me} isHost={isHost} />}
        {(room.status === "countdown" || room.status === "active") && <Match room={room} players={players} me={me} />}
        {room.status === "finished" && <Result room={room} players={players} me={me} isHost={isHost} />}
      </div>
    </div>
  );
}

function FullCenter({ children }) {
  return <div className="elementopia-scope grid min-h-screen place-items-center bg-gradient-hero px-6 text-center">{children}</div>;
}

/* ----------------------- LOBBY ----------------------- */
function Lobby({ room, players, me, isHost }) {
  const teamA = players.filter((p) => p.team === "A");
  const teamB = players.filter((p) => p.team === "B");
  const aFull = teamA.length === room.team_size;
  const bFull = teamB.length === room.team_size;
  const ready = aFull && bFull;

  const copy = async () => {
    await navigator.clipboard.writeText(room.code);
    toast.success("Code copied");
  };

  const swap = async (team) => {
    if (!me) return;
    const target = team === "A" ? teamA : teamB;
    if (team === me.team) return;
    if (target.length >= room.team_size) {
      toast.error("Team is full");
      return;
    }
    await switchTeam(room.id, me.session_id, team);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur md:p-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">Pre-match lobby</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl text-white">{room.team_size}v{room.team_size} duel</h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
          <p className="text-[10px] uppercase tracking-widest text-white/50">Share code</p>
          <div className="mt-1 flex items-center gap-3">
            <div className="font-mono text-2xl tracking-[0.4em] text-white">{room.code}</div>
            <Button variant="outline" size="sm" onClick={copy} className="border-white/20 bg-transparent text-white hover:bg-white/10"><Copy className="h-3 w-3" /></Button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <TeamColumn label="Team A" team="A" players={teamA} size={room.team_size} me={me} onSwitch={() => swap("A")} accent="primary" />
        <TeamColumn label="Team B" team="B" players={teamB} size={room.team_size} me={me} onSwitch={() => swap("B")} accent="defeat" />
      </div>

      {isHost ? (
        <Button
          onClick={() => startMatch(room.code).catch((e) => toast.error(e.message))}
          disabled={!ready}
          className="mt-8 h-14 w-full bg-gradient-primary text-white shadow-glow disabled:opacity-50 md:w-auto md:px-12 font-bold"
        >
          {ready ? "Start Match" : `Waiting (${teamA.length + teamB.length}/${room.team_size * 2})…`}
        </Button>
      ) : (
        <p className="mt-8 text-sm text-white/50">Waiting for host to start the match…</p>
      )}
    </section>
  );
}

function TeamColumn({ label, team, players, size, me, onSwitch, accent }) {
  const empties = Math.max(0, size - players.length);
  const borderClass = accent === "primary" ? "border-primary/40" : "border-defeat/40";
  const dotClass = accent === "primary" ? "bg-primary" : "bg-defeat";
  return (
    <div className={`rounded-2xl border ${borderClass} bg-white/5 p-5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
        </div>
        <span className="font-mono text-xs text-white/50">{players.length}/{size}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {players.map((p) => (
          <li key={p.id} className={`flex items-center justify-between rounded-xl border px-3 py-2 ${p.session_id === me?.session_id ? "border-magenta bg-magenta/20" : "border-white/10 bg-black/40"}`}>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white">{p.nickname.slice(0, 2).toUpperCase()}</span>
              <span className="text-sm text-white">{p.nickname}{p.is_host ? " · host" : ""}{p.session_id === me?.session_id ? " · you" : ""}</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-victory animate-pulse-glow" />
          </li>
        ))}
        {Array.from({ length: empties }).map((_, i) => (
          <li key={`empty-${i}`} className="rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-2 text-sm text-white/30">
            Awaiting player…
          </li>
        ))}
      </ul>
      {me && me.team !== team && empties > 0 && (
        <Button variant="outline" size="sm" className="mt-4 w-full border-white/20 bg-transparent text-white hover:bg-white/10" onClick={onSwitch}>
          <ArrowLeftRight className="mr-2 h-3 w-3" /> Switch to {label}
        </Button>
      )}
    </div>
  );
}

/* ----------------------- MATCH ----------------------- */
function Match({ room, players, me }) {
  const puzzle = room.puzzle;
  const [countdownLeft, setCountdownLeft] = useState(3);
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState([]);
  const [errors, setErrors] = useState(0);
  const [solved, setSolved] = useState(false);
  const [flash, setFlash] = useState(null);
  const lastErrSync = useRef(0);

  useEffect(() => {
    if (!room.started_at) return;
    const targetMs = new Date(room.started_at).getTime();
    let raf = 0;
    const tick = () => {
      const remain = Math.max(0, targetMs - Date.now());
      const secs = Math.ceil(remain / 1000);
      setCountdownLeft(secs);
      if (remain <= 0) setUnlocked(true);
      else raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [room.started_at]);

  // Reset on new match
  useEffect(() => {
    setProgress([]);
    setErrors(0);
    setSolved(false);
  }, [room.started_at]);

  const teamA = players.filter((p) => p.team === "A");
  const teamB = players.filter((p) => p.team === "B");
  const myTeam = me?.team ?? null;
  const oppTeam = myTeam === "A" ? "B" : "A";
  const oppDoneCount = players.filter((p) => p.team === oppTeam && p.finished_at).length;
  const oppSize = room.team_size;
  const oppAllDone = oppDoneCount > 0 && oppDoneCount === oppSize;

  // Lock if opponent team finished first
  useEffect(() => {
    if (oppAllDone && !solved) setUnlocked(false);
  }, [oppAllDone, solved]);

  if (!puzzle) {
    return <section className="rounded-3xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur"><p className="text-white/50">Loading puzzle data…</p></section>;
  }

  const targetSeq = puzzle.sequence;
  const isSpectator = !me;

  const handleTile = (sym) => {
    if (!unlocked || solved || isSpectator || !me) return;
    const nextIndex = progress.length;
    if (sym === targetSeq[nextIndex]) {
      const np = [...progress, sym];
      setProgress(np);
      setFlash("ok");
      setTimeout(() => setFlash(null), 200);
      if (np.length === targetSeq.length) {
        setSolved(true);
        setUnlocked(false);
        submitSolved(room.id, me.session_id, np.length, errors).catch(console.error);
      }
    } else {
      const ne = errors + 1;
      setErrors(ne);
      setFlash("err");
      setTimeout(() => setFlash(null), 250);
      const now = Date.now();
      if (now - lastErrSync.current > 300) {
        lastErrSync.current = now;
        bumpErrors(room.id, me.session_id, ne).catch(() => {});
      }
    }
  };

  return (
    <section className="space-y-6">
      {/* HUD: team rosters */}
      <div className="grid gap-3 md:grid-cols-2">
        <TeamHUD label="Team A" players={teamA} size={room.team_size} mySession={me?.session_id ?? null} accent="primary" />
        <TeamHUD label="Team B" players={teamB} size={room.team_size} mySession={me?.session_id ?? null} accent="defeat" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-widest text-white/50">Synthesize</p>
        <h2 className="mt-1 text-4xl font-bold text-white">{puzzle.target}</h2>
        <p className="text-sm text-white/50">{puzzle.targetName} · {puzzle.optimalSteps} optimal steps · team race</p>
      </div>

      {!unlocked && !solved && !oppAllDone && (
        <div className="rounded-3xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-white/50">Synchronizing…</p>
          <div key={countdownLeft} className="mt-4 animate-countdown bg-gradient-primary bg-clip-text text-8xl font-bold text-transparent font-pixel">
            {countdownLeft > 0 ? countdownLeft : "GO!"}
          </div>
        </div>
      )}

      {(unlocked || solved || oppAllDone) && (
        <div className={`relative rounded-3xl border bg-black/40 p-6 backdrop-blur transition ${
          flash === "ok" ? "border-magenta shadow-glow" : flash === "err" ? "border-defeat" : "border-white/10"
        }`}>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {targetSeq.map((sym, i) => {
              const filled = i < progress.length;
              const info = elementInfo(sym);
              return (
                <div key={i} className={`grid h-12 w-12 place-items-center rounded-xl border-2 font-mono font-bold transition ${
                  filled ? "border-magenta bg-magenta/20 text-white" : "border-dashed border-white/20 text-white/30"
                }`}>
                  {filled ? info.symbol : "?"}
                </div>
              );
            })}
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-defeat"><X className="h-4 w-4" />{errors}</span>
              <span className="flex items-center gap-1 text-victory"><Check className="h-4 w-4" />{progress.length}/{targetSeq.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {puzzle.inventory.map((sym, i) => {
              const info = elementInfo(sym);
              const disabled = !unlocked || solved || isSpectator;
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => handleTile(sym)}
                  className="group relative aspect-square rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:-translate-y-1 hover:border-magenta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <span className="block font-mono text-xs text-white/40">#{i + 1}</span>
                  <span className="absolute inset-0 grid place-items-center font-display text-3xl font-bold" style={{ color: info.color }}>
                    {info.symbol}
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wider text-white/40">{info.name}</span>
                </button>
              );
            })}
          </div>

          {solved && !oppAllDone && (
            <div className="mt-6 rounded-2xl bg-victory/15 border border-victory/30 p-4 text-center text-sm text-victory">
              <Zap className="mr-2 inline h-4 w-4" />
              You finished — waiting for teammates…
            </div>
          )}
          {oppAllDone && !solved && (
            <div className="mt-6 rounded-2xl bg-defeat/15 border border-defeat/30 p-4 text-center text-sm text-defeat">
              Opponent team finished first. Interface locked.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function TeamHUD({ label, players, size, mySession, accent }) {
  const done = players.filter((p) => p.finished_at).length;
  const dotClass = accent === "primary" ? "bg-magenta" : "bg-defeat";
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
        </div>
        <span className="font-mono text-xs text-white/80">{done}/{size} solved</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {players.map((p) => (
          <span
            key={p.id}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
              p.finished_at ? "border-victory/50 bg-victory/10 text-victory" : "border-white/20 bg-white/5 text-white/70"
            } ${p.session_id === mySession ? "ring-1 ring-magenta" : ""}`}
          >
            <span className="font-semibold">{p.nickname}</span>
            <span className="text-[10px] opacity-70">{p.finished_at ? "✓" : "…"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------- RESULT ----------------------- */
function Result({ room, players, me, isHost }) {
  const winning = room.winning_team;
  const youWon = !!me && winning === me.team;
  const draw = winning === "draw";

  const teamA = players.filter((p) => p.team === "A");
  const teamB = players.filter((p) => p.team === "B");

  useEffect(() => {
    if (!me || !winning) return;
    const matchResult = draw ? "DRAW" : youWon ? "WIN" : "LOSS";
    const efficiency = Math.max(0, 100 - (me.errors || 0) * 5);
    
    fetch("http://localhost:8080/api/features/match-consolidation/record-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionNickname: me.nickname,
        matchResult,
        reactionPathEfficiency: efficiency
      })
    }).catch(console.error);
  }, [me, winning, draw, youWon]);

  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-10 text-center backdrop-blur md:p-14">
      {draw ? (
        <>
          <Minus className="mx-auto h-12 w-12 text-white/50" />
          <h1 className="mt-4 text-4xl font-bold text-white">Draw</h1>
          <p className="mt-2 text-white/50">Both teams finished. Equal total errors.</p>
        </>
      ) : youWon ? (
        <>
          <Trophy className="mx-auto h-12 w-12 text-victory" />
          <h1 className="mt-4 bg-gradient-primary bg-clip-text text-5xl font-bold text-transparent font-pixel tracking-widest text-glow-pink">VICTORY</h1>
          <p className="mt-2 text-white/50">Team {winning} stabilized the compound first.</p>
        </>
      ) : winning ? (
        <>
          <Frown className="mx-auto h-12 w-12 text-defeat" />
          <h1 className="mt-4 text-5xl font-bold text-defeat font-pixel tracking-widest text-glow-yellow">DEFEAT</h1>
          <p className="mt-2 text-white/50">Team {winning} reached resonance faster.</p>
        </>
      ) : (
        <h1 className="text-2xl text-white">Match ended.</h1>
      )}

      <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:grid-cols-2">
        <TeamStats label="Team A" players={teamA} startedAt={room.started_at} winner={winning === "A"} />
        <TeamStats label="Team B" players={teamB} startedAt={room.started_at} winner={winning === "B"} />
      </div>

      {isHost && (
        <Button onClick={() => returnToLobby(room.code)} className="mt-10 h-12 bg-gradient-primary px-10 text-white shadow-glow font-bold">
          Back to lobby
        </Button>
      )}
    </section>
  );
}

function TeamStats({ label, players, startedAt, winner }) {
  const totalErr = players.reduce((s, p) => s + (p.errors ?? 0), 0);
  return (
    <div className={`rounded-2xl border p-5 text-left ${winner ? "border-magenta bg-magenta/10 shadow-glow" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
        <span className="text-xs text-white/50">{totalErr} total errors</span>
      </div>
      <ul className="mt-3 space-y-2">
        {players.map((p) => {
          const ms = p.finished_at && startedAt ? Math.max(0, new Date(p.finished_at).getTime() - new Date(startedAt).getTime()) : null;
          return (
            <li key={p.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              <span>{p.nickname}</span>
              <span className="font-mono text-xs text-white/60">
                {ms != null ? `${(ms / 1000).toFixed(2)}s` : "—"} · {p.errors ?? 0} err
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
