import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Modal } from "@mui/material";
import compoundElements from "@/features/resonance-puzzle/data/compound-elements.json";
import { getSessionId, getStoredNickname, setStoredNickname, autoNickname } from "@/features/auth-user/lib/session";
import {
  advanceToNextRound,
  bumpErrors,
  bumpSteps,
  returnToLobby,
  startMatch,
  submitSolved,
  switchTeam,
  updateRoomSettings,
  forfeitMatch,
  leaveRoom,
  joinRoom,
} from "@/features/multiplayer-challenge/lib/room";
import { elementInfo } from "@/features/resonance-puzzle/lib/puzzles";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ArrowLeft, Copy, Trophy, Frown, Minus, Zap, X, Check, ArrowLeftRight, Lock, LogIn, AlertTriangle, LogOut } from "lucide-react";
import Confetti from "react-confetti";
import { API_BASE_URL } from "@/config/apiConfig";
import { BohrAtomVisualizer } from "@/features/resonance-puzzle/components/BohrAtomVisualizer";
import { syncOrEnqueue } from "@/features/mastery-dashboard/lib/offlineSyncManager";

export default function ChallengeMatch() {
  const { code } = useParams();
  const navigate = useNavigate();
  const sessionId = getSessionId();
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const channelRef = useRef(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [disconnectCountdown, setDisconnectCountdown] = useState(15);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const lastOpponentPingRef = useRef({});
  const isChannelSubscribedRef = useRef(false);
  const playersRef = useRef(players);
  playersRef.current = players;
  const meRef = useRef(null);

  // Private Match Gate state for users navigating directly via link without having joined
  const [joinPromptCode, setJoinPromptCode] = useState("");
  const [joinPromptNick, setJoinPromptNick] = useState(() => getStoredNickname() || autoNickname());
  const [joinPromptError, setJoinPromptError] = useState("");
  const [joinPromptLoading, setJoinPromptLoading] = useState(false);

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
      .channel(`room:${code}`, {
        config: {
          broadcast: { ack: false, self: false },
          presence: { key: sessionId }
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `code=eq.${code}` },
        (payload) => {
          const next = (payload.new ?? null);
          if (next) {
            if (payload.commit_timestamp) {
              window.__serverTimeOffset = new Date(payload.commit_timestamp).getTime() - Date.now();
            }
            setRoom(next);
          }
        })
      .on("postgres_changes", { event: "*", schema: "public", table: "room_players" },
        (payload) => {
          const next = payload.new;
          if (next) {
            setPlayers(prev => {
              if (!prev.find(p => p.id === next.id)) return [...prev, next].sort((a, b) => new Date(a.joined_at) - new Date(b.joined_at));
              return prev.map(p => p.id === next.id ? next : p);
            });
          }
        })
      .on("broadcast", { event: "presence_heartbeat" }, ({ payload }) => {
        if (payload && payload.sessionId && payload.sessionId !== sessionId) {
          lastOpponentPingRef.current[payload.sessionId] = Date.now();
        }
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        if (leftPresences && leftPresences.some(p => p.key && p.key !== sessionId)) {
          console.log("[Presence] Remote opponent client disconnected.");
          leftPresences.forEach(lp => {
            if (lp.key && lp.key !== sessionId) {
              // Immediately flag silence so the reconnection modal pops up on the next 1s tick
              lastOpponentPingRef.current[lp.key] = Date.now() - 10000;
            }
          });
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          isChannelSubscribedRef.current = true;
          channel.track({ sessionId, joinedAt: Date.now() }).catch(() => { });
        } else {
          isChannelSubscribedRef.current = false;
        }
      });
    channelRef.current = channel;
    return () => {
      active = false;
      isChannelSubscribedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [code, sessionId]);

  const me = useMemo(() => players.find((p) => p.session_id === sessionId) ?? null, [players, sessionId]);
  meRef.current = me;
  const isHost = !!me?.is_host;

  // 2.5-Second Heartbeat Broadcast (Active Match)
  useEffect(() => {
    if (room?.status !== "active" || !channelRef.current || !me) return;

    const pingInterval = setInterval(() => {
      if (channelRef.current && isChannelSubscribedRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "presence_heartbeat",
          payload: { sessionId, team: me.team, timestamp: Date.now() }
        }).catch(() => { });
      }
    }, 2500);

    return () => clearInterval(pingInterval);
  }, [room?.status, me, sessionId]);

  // Decoupled 8-Second Silence Detector & 15-Second Forfeit Watchdog
  // Uses playersRef to prevent interval resets on board tile movements or step counters
  useEffect(() => {
    if (room?.status !== "active") {
      setOpponentDisconnected(false);
      setDisconnectCountdown(15);
      return;
    }

    const currentMe = meRef.current;
    if (!currentMe) return;

    // Seed active opponent timestamps at round start
    const initialOpponents = playersRef.current.filter((p) => p.team !== currentMe.team);
    initialOpponents.forEach((opp) => {
      if (!lastOpponentPingRef.current[opp.session_id]) {
        lastOpponentPingRef.current[opp.session_id] = Date.now();
      }
    });

    const watchdog = setInterval(() => {
      const activeMe = meRef.current;
      if (!activeMe) return;

      const currentOpponents = playersRef.current.filter((p) => p.team !== activeMe.team);
      if (currentOpponents.length === 0) return;

      const now = Date.now();
      const anyOpponentSilent = currentOpponents.some((opp) => {
        const lastPing = lastOpponentPingRef.current[opp.session_id] || now;
        return (now - lastPing) > 8000;
      });

      if (anyOpponentSilent) {
        setOpponentDisconnected(true);
        setDisconnectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(watchdog);
            forfeitMatch(room.id, activeMe.team, null, "Opponent lost network connection (heartbeat timeout).").catch(console.error);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setOpponentDisconnected(false);
        setDisconnectCountdown(15);
      }
    }, 1000);

    return () => clearInterval(watchdog);
  }, [room?.status, room?.id]);

  // Watchdog: If an active match is underway and all opponents on the other team have left/forfeited, grant immediate victory!
  useEffect(() => {
    if (!room || (room.status !== "active" && room.status !== "countdown")) return;
    if (!me) return;

    const opponentTeam = me.team === "A" ? "B" : "A";
    const opponents = players.filter((p) => p.team === opponentTeam);

    if (players.length > 0 && opponents.length === 0) {
      console.log("Opponent team has no remaining players. Awarding automatic victory to Team", me.team);
      toast.info("Opponent exited the match. Victory awarded to your team!");
      forfeitMatch(room.id, me.team, null, "All opponents exited the match.");
    }
  }, [room?.status, room?.id, players, me]);

  // Safe Exit / Forfeit Handler
  const handleExit = () => {
    if (room && me && (room.status === "active" || room.status === "countdown")) {
      setShowExitConfirmModal(true);
      return;
    }
    confirmExitAndForfeit();
  };

  const confirmExitAndForfeit = async () => {
    setShowExitConfirmModal(false);
    if (room && me) {
      try {
        await leaveRoom(room.id, me.session_id, room.status, me.team);
      } catch (err) {
        console.warn("Error leaving room:", err);
      }
    }
    navigate("/challenge");
  };

  // Window unload listener (e.g. closing tab or browser during match)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (room && (room.status === "active" || room.status === "countdown") && me) {
        leaveRoom(room.id, me.session_id, room.status, me.team);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [room?.id, room?.status, me?.session_id, me?.team]);

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

  // Gatekeeper: Prevent anyone from entering or spectating a room without inputting and verifying the 5-digit room code
  if (!me) {
    const isFull = players.length >= room.team_size * 2;
    const isMatchStarted = room.status !== "lobby";

    const handleJoinSubmit = async (e) => {
      e.preventDefault();
      setJoinPromptError("");
      const entered = joinPromptCode.trim().toUpperCase();
      if (entered !== code.toUpperCase()) {
        setJoinPromptError("Incorrect room code. Please enter the valid 5-character access code.");
        return;
      }
      if (isFull) {
        setJoinPromptError(`Room has reached maximum capacity (${players.length}/${room.team_size * 2} players).`);
        return;
      }
      if (isMatchStarted) {
        setJoinPromptError("This match is already in progress and cannot accept new players.");
        return;
      }
      setJoinPromptLoading(true);
      try {
        setStoredNickname(joinPromptNick);
        await joinRoom(entered, joinPromptNick);
        // Refresh players immediately
        const { data: ps } = await supabase.from("room_players").select("*").eq("room_id", room.id).order("joined_at");
        setPlayers(ps ?? []);
      } catch (err) {
        setJoinPromptError(err.message || "Failed to join room");
      } finally {
        setJoinPromptLoading(false);
      }
    };

    return (
      <div className="elementopia-scope min-h-screen bg-gradient-hero text-foreground flex items-center justify-center p-4">
        <Toaster theme="dark" position="top-center" />
        <div className="max-w-md w-full rounded-3xl border border-magenta/40 bg-slate-950/95 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(236,72,153,0.25)] animate-fade-in relative">
          <div className="w-16 h-16 rounded-full bg-magenta/20 border-2 border-magenta flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            <Lock className="w-8 h-8 text-magenta" />
          </div>

          <h2 className="font-pixel text-2xl text-white font-bold mb-1">
            Private Match Gate
          </h2>
          <p className="text-xs font-mono text-slate-400 mb-6">
            Enter the 5-digit room access code from your host to enter this {room.team_size}v{room.team_size} match.
          </p>

          {isMatchStarted ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs mb-6">
              ⚠️ This match is already in progress or has concluded and cannot accept new players.
            </div>
          ) : isFull ? (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive font-mono text-xs mb-6">
              ⚠️ This room has reached maximum capacity ({players.length}/{room.team_size * 2} players).
            </div>
          ) : (
            <form onSubmit={handleJoinSubmit} className="space-y-4 text-left mb-6">
              <div>
                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-1.5">
                  Your Nickname
                </label>
                <input
                  type="text"
                  value={joinPromptNick}
                  onChange={(e) => setJoinPromptNick(e.target.value.replace(/[^A-Za-z0-9_]/g, "").slice(0, 15))}
                  placeholder="Enter nickname..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-magenta transition"
                  disabled={joinPromptLoading}
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-1.5">
                  5-Digit Room Code
                </label>
                <input
                  type="text"
                  value={joinPromptCode}
                  onChange={(e) => setJoinPromptCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 5))}
                  placeholder="00000"
                  className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3 text-center font-mono text-magenta text-xl tracking-[0.3em] outline-none focus:border-magenta transition uppercase"
                  disabled={joinPromptLoading}
                  autoFocus
                />
              </div>

              {joinPromptError && (
                <div className="text-xs text-rose-400 font-mono text-center bg-rose-950/40 border border-rose-500/30 p-2 rounded-lg">
                  {joinPromptError}
                </div>
              )}

              <button
                type="submit"
                disabled={joinPromptLoading || joinPromptCode.length !== 5}
                className="w-full rounded-full bg-gradient-to-br from-indigo-500 to-magenta px-6 py-3 font-mono font-bold text-xs text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] transition hover:scale-105 uppercase tracking-wider disabled:opacity-50 disabled:scale-100 cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{joinPromptLoading ? "Verifying..." : "Verify Code & Join Match"}</span>
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate("/challenge")}
            className="w-full text-center text-xs font-mono text-slate-500 hover:text-white transition py-2 cursor-pointer"
          >
            ← Return to Challenge Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="elementopia-scope min-h-screen bg-gradient-hero text-foreground">
      <Toaster theme="dark" position="top-center" />
      <div className="mx-auto max-w-5xl px-6 pt-20 pb-10">
        <button onClick={handleExit} className="mb-6 inline-block rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-6 py-2 font-['Montserrat',sans-serif] font-[800] text-[0.9rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider cursor-pointer">
          Exit
        </button>

        {room.status === "lobby" && <Lobby room={room} players={players} me={me} isHost={isHost} />}
        {(room.status === "countdown" || room.status === "active" || (room.status === "finished" && showDiscoveryModal)) && <Match room={room} players={players} me={me} showDiscoveryModal={showDiscoveryModal} setShowDiscoveryModal={setShowDiscoveryModal} />}
        {room.status === "finished" && !showDiscoveryModal && <Result room={room} players={players} me={me} isHost={isHost} />}
      </div>

      {/* Disconnect Reconnection & Forfeit Modal Overlay (FR-3.4 / REQ-403) */}
      {opponentDisconnected && room.status === "active" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-md w-full rounded-3xl border border-destructive/50 bg-slate-950 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.25)]">
            <div className="w-16 h-16 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Zap className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-pixel text-xl sm:text-2xl text-destructive font-bold mb-2">
              Opponent Reconnecting
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6">
              Network silence detected from the opposing team. Match paused awaiting reconnection.
            </p>
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 mb-6 font-mono">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                Forfeit Victory In
              </div>
              <div className="text-4xl font-bold text-destructive">
                {disconnectCountdown}s
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              If the opponent fails to reconnect within the countdown, victory is automatically awarded to your team.
            </p>
          </div>
        </div>
      )}

      {/* In-Platform Exit & Forfeit Confirmation Modal */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-md w-full rounded-3xl border border-rose-500/50 bg-slate-950 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(244,63,94,0.3)] relative">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
            <h3 className="font-pixel text-xl sm:text-2xl text-rose-400 font-bold mb-2">
              Forfeit & Exit Match?
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6">
              You are currently in an active challenge. Leaving the match will forfeit the game and immediately award victory to the opposing team.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="rounded-full border border-slate-700 bg-slate-900/90 px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-300 hover:text-white hover:border-slate-500 transition cursor-pointer"
              >
                Cancel & Resume
              </button>
              <button
                type="button"
                onClick={confirmExitAndForfeit}
                className="rounded-full bg-gradient-to-r from-rose-600 to-red-500 px-6 py-2.5 font-mono font-bold text-xs uppercase tracking-wider text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Yes, Forfeit Match</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
    <section className="rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur md:p-12 shadow-[0_0_30px_rgba(236,72,153,0.25)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">Pre-match lobby</p>
          <h1 className="mt-2 text-3xl md:text-4xl text-white font-pixel uppercase text-glow-magenta">{room.team_size}v{room.team_size} duel</h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
          <p className="text-[10px] uppercase tracking-widest text-white/50">Share code</p>
          <div className="mt-1 flex items-center gap-3">
            <div className="font-mono text-2xl font-bold tracking-[0.4em] text-white text-glow-pink">{room.code}</div>
            <Button variant="outline" size="sm" onClick={copy} className="border-white/20 bg-transparent text-white hover:bg-white/10"><Copy className="h-3 w-3" /></Button>
          </div>
        </div>
      </div>

      {/* Lobby Settings summary badge */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-b border-white/10 py-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-white/50 uppercase tracking-wider">Match Config:</span>
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-bold text-white capitalize">
            {room.puzzle?.difficulty || "medium"} Difficulty
          </span>
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-bold text-cyan">
            {room.puzzle?.maxQuestions || 3} Questions
          </span>
        </div>
        <div className="text-white/40 text-[11px] font-mono">
          Synchronized Real-time Chemistry Duel
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <TeamColumn label="Team A" team="A" players={teamA} size={room.team_size} me={me} onSwitch={() => swap("A")} accent="primary" />
        <TeamColumn label="Team B" team="B" players={teamB} size={room.team_size} me={me} onSwitch={() => swap("B")} accent="defeat" />
      </div>

      {isHost ? (
        <button
          onClick={() => startMatch(room.code).catch((e) => toast.error(e.message))}
          disabled={!ready}
          className="mt-8 w-full rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-10 py-4 font-['Montserrat',sans-serif] font-[800] text-[0.9rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider whitespace-nowrap disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] md:w-auto"
        >
          {ready ? "Start Match" : `Waiting (${teamA.length + teamB.length}/${room.team_size * 2})…`}
        </button>
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
const THEME_COLORS = ["var(--cyan)", "var(--magenta)", "var(--violet)"];

function Match({ room, players, me, showDiscoveryModal, setShowDiscoveryModal }) {
  const puzzle = room.puzzle?.questions ? room.puzzle.questions[room.puzzle.currentQuestionIndex] : room.puzzle;
  const [countdownLeft, setCountdownLeft] = useState(3);
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState([]);
  const [errors, setErrors] = useState(0);

  useEffect(() => {
    if (me && progress.length === 0 && me.steps?.length > 0) {
      setProgress(me.steps);
    }
    if (me && errors === 0 && (me.errors || 0) > 0) {
      setErrors(me.errors);
    }
  }, [me]);
  const [solved, setSolved] = useState(false);
  const [flash, setFlash] = useState(null);
  const [solvedPuzzle, setSolvedPuzzle] = useState(null);
  const lastErrSync = useRef(0);
  const [usedIndices, setUsedIndices] = useState([]);
  const discoveredCompoundInfo = useMemo(() => {
    const targetPuzzle = solvedPuzzle || puzzle;
    if (!targetPuzzle) return null;

    const targetNameMap = {
      "Salt": "Sodium Chloride"
    };
    const lookupName = targetNameMap[targetPuzzle.targetName] || targetPuzzle.targetName;

    const elementsArray = Array.isArray(compoundElements) ? compoundElements : (compoundElements.default || []);
    const found = elementsArray.find(c => c.NAME?.toLowerCase() === lookupName.toLowerCase());

    if (!found) {
      return {
        name: targetPuzzle.targetName,
        symbol: targetPuzzle.target,
        description: "A specialized molecular compound synthesized in the Elementopia laboratories.",
        uses: "Various classified applications.",
        elements: targetPuzzle.sequence?.join(", ") || "Unknown"
      };
    }

    return {
      name: found.NAME,
      symbol: found.Symbol,
      description: found.Description,
      uses: Array.isArray(found.Uses) ? found.Uses.join(", ") : found.Uses,
      elements: Array.isArray(found.Elements) ? found.Elements.join(", ") : found.Elements
    };
  }, [solvedPuzzle, puzzle]);

  useEffect(() => {
    if (!room.started_at) return;
    const targetMs = new Date(room.started_at).getTime();
    let raf = 0;
    const tick = () => {
      const offset = window.__serverTimeOffset || 0;
      const currentMs = Date.now() + offset;
      const remain = Math.max(0, targetMs - currentMs);
      const secs = Math.ceil(remain / 1000);
      setCountdownLeft(secs);
      if (remain <= 0) setUnlocked(true);
      else raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [room.started_at]);

  // Reset on new match or next question
  useEffect(() => {
    setProgress([]);
    setErrors(0);
    setSolved(false);
    setUsedIndices([]);
    setShowDiscoveryModal(false);
    setSolvedPuzzle(null);
  }, [room.started_at, room.puzzle?.currentQuestionIndex]);


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

  const handleTile = (sym, cardIndex) => {
    if (!unlocked || solved || isSpectator || !me) return;
    if (usedIndices.includes(cardIndex)) return;
    const nextIndex = progress.length;
    if (sym === targetSeq[nextIndex]) {
      const np = [...progress, sym];
      setProgress(np);
      setUsedIndices((prev) => [...prev, cardIndex]);
      setFlash("ok");
      setTimeout(() => setFlash(null), 200);

      // Sync step progress live to other players
      bumpSteps(room.id, me.session_id, np.length).catch(() => { });

      if (np.length === targetSeq.length) {
        setSolved(true);
        setUnlocked(false);
        setSolvedPuzzle(puzzle);
        setShowDiscoveryModal(true);
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
        bumpErrors(room.id, me.session_id, ne).catch(() => { });
      }
    }
  };

  return (
    <section className="space-y-4">
      {/* Match HUD Scoreboard Header */}
      <div className="grid grid-cols-3 items-center rounded-3xl border border-white/10 bg-black/40 py-4 px-6 text-center backdrop-blur shadow-[0_0_30px_rgba(236,72,153,0.15)]">
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest text-white/50 font-mono">ROUND</p>
          <h3 className="text-lg font-bold text-white font-mono">
            {room.puzzle?.questions ? `${room.puzzle.currentQuestionIndex + 1} of ${room.puzzle.maxQuestions}` : "1 of 1"}
          </h3>
          <p className="text-[9px] text-white/40 font-mono capitalize">Difficulty: {room.puzzle?.difficulty || "medium"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/50 font-mono">TARGET COMPOUND</p>
          <h2 className="text-2xl font-bold text-white text-glow-magenta">{puzzle.target}</h2>
          <p className="text-[9px] text-white/40 font-mono">{puzzle.targetName} · {puzzle.optimalSteps} steps</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/50 font-mono">SCOREBOARD</p>
          <div className="flex justify-end items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-[#a855f7] glow-[#a855f7]" />
            <span className="text-base font-bold text-white font-mono">
              {room.puzzle?.scores ? `${room.puzzle.scores.A} - ${room.puzzle.scores.B}` : "0 - 0"}
            </span>
            <span className="h-2 w-2 rounded-full bg-[#ec4899] glow-[#ec4899]" />
          </div>
          <p className="text-[9px] text-white/40 font-mono">Team A vs Team B</p>
        </div>
      </div>

      {!unlocked && !solved && !oppAllDone && (
        <div className="rounded-3xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur flex flex-col justify-center items-center">
          <p className="text-xs uppercase tracking-widest text-white/50 font-mono tracking-[0.2em]">
            {room.puzzle?.questions ? `PREPARING ROUND ${room.puzzle.currentQuestionIndex + 1}...` : "SYNCHRONIZING..."}
          </p>
          <div key={countdownLeft} className="mt-4 animate-countdown bg-gradient-primary bg-clip-text text-8xl font-bold text-transparent font-pixel">
            {countdownLeft > 0 ? countdownLeft : "GO!"}
          </div>
          {room.puzzle?.currentQuestionIndex > 0 && (
            <p className="text-sm text-victory font-mono mt-4 animate-pulse">
              Current Standings: Team A ({room.puzzle.scores?.A}) - Team B ({room.puzzle.scores?.B})
            </p>
          )}
        </div>
      )}

      {(unlocked || solved || oppAllDone) && (
        <div className={`relative rounded-3xl border bg-black/40 p-4 backdrop-blur transition ${flash === "ok" ? "border-magenta shadow-glow" : flash === "err" ? "border-defeat" : "border-white/10"
          }`}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {targetSeq.map((sym, i) => {
              const filled = i < progress.length;
              const info = elementInfo(sym);
              return (
                <div key={i} className={`grid h-10 w-10 place-items-center rounded-xl border-2 font-mono font-bold transition ${filled ? "border-magenta bg-magenta/20 text-white" : "border-dashed border-white/20 text-white/30"
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
              const isUsed = usedIndices.includes(i);
              const disabled = !unlocked || solved || isSpectator || isUsed;
              const themeColor = THEME_COLORS[i % 3];
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => handleTile(sym, i)}
                  className={`group relative h-[100px] overflow-hidden rounded-2xl border p-2 text-left transition ${isUsed
                    ? "border-white/5 bg-white/[0.02] opacity-20 cursor-not-allowed"
                    : "border-white/10 bg-white/5 hover:-translate-y-1 hover:border-magenta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    }`}
                >
                  <span className="relative z-10 block font-mono text-[10px] text-white/40">#{i + 1}</span>

                  <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 grid place-items-center pointer-events-none transition-opacity ${isUsed ? "opacity-10" : "opacity-40 group-hover:opacity-100"}`}>
                    <div className="scale-[0.8] origin-center flex items-center justify-center">
                      <BohrAtomVisualizer symbol={sym} size="md" showNucleus={false} animated={!isUsed} themeColor={themeColor} />
                    </div>
                  </div>

                  <span
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-display text-2xl font-bold ${isUsed ? "line-through opacity-30" : ""}`}
                    style={{ color: isUsed ? "#64748b" : themeColor, textShadow: isUsed ? "none" : `0 0 10px ${themeColor}` }}
                  >
                    {info.symbol}
                  </span>
                  <span className="absolute bottom-2 right-2 z-10 text-[9px] uppercase tracking-wider text-white/40">{info.name}</span>
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

      <Modal
        open={showDiscoveryModal}
        onClose={() => {
          setShowDiscoveryModal(false);
          setSolvedPuzzle(null);
        }}
      >
        <div
          className="elementopia-scope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] max-h-[90vh] outline-none focus:outline-none focus-visible:outline-none border-none ring-0 flex flex-col text-foreground"
          style={{ minHeight: 'auto', background: 'transparent' }}
        >
          <div className="relative bg-[#0a0c14] border border-border rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col max-h-full">
            <div className="flex-1 pr-2 text-left">
              <div className="mb-6 inline-flex rounded-xl bg-gradient-cyan glow-cyan px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-primary-foreground">
                Laboratory Record
              </div>
              <h2 className="font-pixel text-2xl font-bold sm:text-4xl text-glow-magenta mb-2">
                {discoveredCompoundInfo?.name}
              </h2>
              <p className="mt-2 font-mono text-sm text-cyan mb-8">
                Formula: {discoveredCompoundInfo?.symbol}
              </p>
              {discoveredCompoundInfo && (
                <div className="space-y-6">
                  <div className="text-sm text-muted-foreground/80 leading-relaxed overflow-y-auto max-h-[160px] custom-scrollbar text-left">
                    {discoveredCompoundInfo.description}
                  </div>
                  <div className="border-t border-border pt-6 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                          Primary Applications
                        </h4>
                        <p className="text-sm font-bold text-white/90">
                          {discoveredCompoundInfo.uses}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                          Elemental Composition
                        </h4>
                        <p className="text-sm font-bold text-cyan">
                          {discoveredCompoundInfo.elements}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={async () => {
                setShowDiscoveryModal(false);
                setSolvedPuzzle(null);
                if (room.status === "active") {
                  await advanceToNextRound(room.id);
                }
              }}
              className="mt-8 w-full rounded-2xl bg-gradient-cyan px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-glow-cyan transition-all hover:scale-[1.02] hover:shadow-glow-cyan-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

function Result({ room, players, me, isHost }) {
  const winning = room.winning_team;
  const youWon = !!me && winning === me.team;
  const draw = winning === "draw";

  const teamA = players.filter((p) => p.team === "A");
  const teamB = players.filter((p) => p.team === "B");

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!me || !winning) return;
    const matchResult = draw ? "DRAW" : youWon ? "WIN" : "LOSS";
    const efficiency = Math.max(0, 100 - (me.errors || 0) * 5);

    syncOrEnqueue({
      type: "MATCH_RESULT",
      url: `${API_BASE_URL}/api/features/match-consolidation/record-result`,
      method: "POST",
      payload: {
        sessionNickname: me.nickname,
        matchResult,
        reactionPathEfficiency: efficiency
      }
    });
  }, [me, winning, draw, youWon]);

  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-10 text-center backdrop-blur md:p-14 shadow-[0_0_50px_rgba(236,72,153,0.15)] flex flex-col justify-center relative overflow-hidden">
      {room.puzzle?.forfeitReason && (
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 font-mono text-xs text-cyan">
          <Zap className="w-3.5 h-3.5 text-cyan animate-pulse" />
          <span>{room.puzzle.forfeitReason}</span>
        </div>
      )}
      {draw ? (
        <>
          <Minus className="mx-auto h-12 w-12 text-white/50" />
          <h1 className="mt-4 text-4xl font-bold text-white font-pixel">Draw</h1>
          <p className="mt-2 text-white/50">Equal points: {room.puzzle?.scores ? `${room.puzzle.scores.A} - ${room.puzzle.scores.B}` : "0 - 0"}</p>
        </>
      ) : youWon ? (
        <>
          {youWon && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}
          <Trophy className="mx-auto h-12 w-12 text-victory" />
          <h1 className="mt-4 text-5xl font-bold text-victory font-pixel tracking-widest text-glow-victory">VICTORY</h1>
          <p className="mt-2 text-white/50">Your team won the match {room.puzzle?.scores ? `(${room.puzzle.scores[me.team]} to ${room.puzzle.scores[me.team === "A" ? "B" : "A"]})` : ""}!</p>
        </>
      ) : winning ? (
        <>
          <Frown className="mx-auto h-12 w-12 text-defeat" />
          <h1 className="mt-4 text-5xl font-bold text-defeat font-pixel tracking-widest text-glow-yellow">DEFEAT</h1>
          <p className="mt-2 text-white/50">Team {winning} won the match {room.puzzle?.scores ? `(${room.puzzle.scores[winning]} to ${room.puzzle.scores[winning === "A" ? "B" : "A"]})` : ""}!</p>
        </>
      ) : (
        <h1 className="text-2xl text-white">Match ended.</h1>
      )}

      <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:grid-cols-2">
        <TeamStats label="Team A" players={teamA} startedAt={room.started_at} winner={winning === "A"} />
        <TeamStats label="Team B" players={teamB} startedAt={room.started_at} winner={winning === "B"} />
      </div>

      {isHost && (
        <button onClick={() => returnToLobby(room.code)} className="mt-10 inline-block rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-10 py-3 font-['Montserrat',sans-serif] font-[800] text-[0.9rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider">
          Back to lobby
        </button>
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
