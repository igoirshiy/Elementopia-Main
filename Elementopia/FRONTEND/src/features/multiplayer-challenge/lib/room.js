import { supabase } from "@/integrations/supabase/client";
import { autoNickname, getSessionId } from "@/features/auth-user/lib/session";
import { generatePuzzle } from "@/features/resonance-puzzle/lib/puzzles";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function genCode(len = 5) {
  let out = "";
  for (let i = 0; i < len; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return out;
}

export async function createRoom(nickname, teamSize) {
  const sessionId = getSessionId();
  const host = (nickname.trim() || autoNickname()).slice(0, 20);
  const size = Math.min(5, Math.max(1, Math.floor(teamSize)));

  for (let i = 0; i < 5; i++) {
    const code = genCode();
    const { data: room, error } = await supabase
      .from("rooms")
      .insert({
        code,
        host_session_id: sessionId,
        host_nickname: host,
        status: "lobby",
        team_size: size,
      })
      .select()
      .single();
    if (error) {
      if (error.message.toLowerCase().includes("duplicate")) continue;
      throw error;
    }
    // Seat host on team A.
    const { error: pErr } = await supabase.from("room_players").insert({
      room_id: room.id,
      session_id: sessionId,
      nickname: host,
      team: "A",
      is_host: true,
    });
    if (pErr) throw pErr;
    return room;
  }
  throw new Error("Could not generate a unique room code");
}

export async function joinRoom(code, nickname) {
  const sessionId = getSessionId();
  const nick = (nickname.trim() || autoNickname()).slice(0, 20);
  const normalized = code.toUpperCase().trim();

  const { data: room, error: fetchErr } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", normalized)
    .maybeSingle();
  if (fetchErr) throw fetchErr;
  if (!room) throw new Error("Room Not Found");

  // Already seated?
  const { data: existing } = await supabase
    .from("room_players")
    .select("*")
    .eq("room_id", room.id)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (existing) return room;

  if (room.status !== "lobby") throw new Error("Match already in progress");

  const { data: players } = await supabase
    .from("room_players")
    .select("team")
    .eq("room_id", room.id);
  const teamA = (players ?? []).filter((p) => p.team === "A").length;
  const teamB = (players ?? []).filter((p) => p.team === "B").length;
  if (teamA >= room.team_size && teamB >= room.team_size) {
    throw new Error("Room is full");
  }
  // Auto-balance: fill team B first until equal, then balance.
  const team = teamB < room.team_size && teamB <= teamA ? "B" : "A";

  const { error: insErr } = await supabase.from("room_players").insert({
    room_id: room.id,
    session_id: sessionId,
    nickname: nick,
    team,
    is_host: false,
  });
  if (insErr) throw insErr;
  return room;
}

export async function switchTeam(roomId, sessionId, team) {
  await supabase
    .from("room_players")
    .update({ team })
    .eq("room_id", roomId)
    .eq("session_id", sessionId);
}

export async function startMatch(code) {
  const puzzle = generatePuzzle();
  const startAt = new Date(Date.now() + 3500).toISOString();

  // Reset player progress
  const { data: room } = await supabase
    .from("rooms")
    .select("id")
    .eq("code", code)
    .maybeSingle();
  if (!room) throw new Error("Room not found");

  await supabase
    .from("room_players")
    .update({ finished_at: null, steps: null, errors: 0 })
    .eq("room_id", room.id);

  const patch = {
    status: "countdown",
    puzzle: puzzle,
    started_at: startAt,
    winning_team: null,
    winner: null,
  };
  const { error } = await supabase.from("rooms").update(patch).eq("code", code);
  if (error) throw error;
}

export async function submitSolved(roomId, sessionId, steps, errors) {
  const now = new Date().toISOString();
  await supabase
    .from("room_players")
    .update({ finished_at: now, steps, errors })
    .eq("room_id", roomId)
    .eq("session_id", sessionId);

  // Check if a team has completed.
  const { data: room } = await supabase.from("rooms").select("*").eq("id", roomId).maybeSingle();
  if (!room || room.winning_team) return;

  const { data: players } = await supabase
    .from("room_players")
    .select("team, finished_at, errors")
    .eq("room_id", roomId);
  if (!players) return;

  const teamA = players.filter((p) => p.team === "A");
  const teamB = players.filter((p) => p.team === "B");
  const aDone = teamA.length === room.team_size && teamA.every((p) => p.finished_at);
  const bDone = teamB.length === room.team_size && teamB.every((p) => p.finished_at);

  let winning = null;
  if (aDone && bDone) {
    const aErr = teamA.reduce((s, p) => s + (p.errors ?? 0), 0);
    const bErr = teamB.reduce((s, p) => s + (p.errors ?? 0), 0);
    winning = aErr < bErr ? "A" : bErr < aErr ? "B" : "draw";
  } else if (aDone) winning = "A";
  else if (bDone) winning = "B";

  if (winning) {
    await supabase
      .from("rooms")
      .update({ winning_team: winning, status: "finished" })
      .eq("id", roomId);
  }
}

export async function bumpErrors(roomId, sessionId, current) {
  await supabase
    .from("room_players")
    .update({ errors: current })
    .eq("room_id", roomId)
    .eq("session_id", sessionId);
}

export async function returnToLobby(code) {
  const { data: room } = await supabase.from("rooms").select("id").eq("code", code).maybeSingle();
  if (!room) return;
  await supabase
    .from("room_players")
    .update({ finished_at: null, steps: null, errors: 0 })
    .eq("room_id", room.id);
  await supabase
    .from("rooms")
    .update({
      status: "lobby",
      puzzle: null,
      started_at: null,
      winning_team: null,
      winner: null,
    })
    .eq("code", code);
}
