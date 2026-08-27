import { supabase } from "@/integrations/supabase/client";
import { autoNickname, getSessionId } from "@/features/auth-user/lib/session";
import { generatePuzzle } from "@/features/resonance-puzzle/lib/puzzles";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function genCode(len = 5) {
  let out = "";
  for (let i = 0; i < len; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return out;
}

export async function createRoom(nickname, teamSize, difficulty = "medium", maxQuestions = 3) {
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
        puzzle: {
          difficulty,
          maxQuestions,
          currentQuestionIndex: 0,
          questions: [],
          scores: { A: 0, B: 0 }
        }
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

export async function updateRoomSettings(roomId, difficulty, maxQuestions) {
  const { data: room } = await supabase
    .from("rooms")
    .select("puzzle")
    .eq("id", roomId)
    .maybeSingle();

  const nextPuzzle = {
    ...(room?.puzzle || {}),
    difficulty,
    maxQuestions
  };

  await supabase
    .from("rooms")
    .update({ puzzle: nextPuzzle })
    .eq("id", roomId);
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
  // Fetch current room to read difficulty and max questions
  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (!room) throw new Error("Room not found");

  const meta = room.puzzle || {};
  const difficulty = meta.difficulty || "medium";
  const maxQuestions = meta.maxQuestions || 3;

  // Generate distinct questions
  const questions = [];
  const seenIds = new Set();
  for (let i = 0; i < maxQuestions; i++) {
    let puzzle = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const qSeed = Math.floor(Math.random() * 1_000_000);
      puzzle = generatePuzzle(qSeed, difficulty);
      if (!seenIds.has(puzzle.id)) break;
    }
    seenIds.add(puzzle.id);
    questions.push(puzzle);
  }

  const startAt = new Date(Date.now() + 3500).toISOString();

  // Reset player progress
  await supabase
    .from("room_players")
    .update({ finished_at: null, steps: null, errors: 0 })
    .eq("room_id", room.id);

  const patch = {
    status: "countdown",
    puzzle: {
      difficulty,
      maxQuestions,
      currentQuestionIndex: 0,
      questions,
      scores: { A: 0, B: 0 }
    },
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
  if (!room || !room.puzzle) return;

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
    const puzzleMeta = { ...room.puzzle };
    if (!puzzleMeta.scores) puzzleMeta.scores = { A: 0, B: 0 };

    if (winning === "A") puzzleMeta.scores.A += 1;
    else if (winning === "B") puzzleMeta.scores.B += 1;
    else {
      puzzleMeta.scores.A += 1;
      puzzleMeta.scores.B += 1;
    }

    const nextIndex = puzzleMeta.currentQuestionIndex + 1;
    if (nextIndex < puzzleMeta.maxQuestions) {
      puzzleMeta.currentQuestionIndex = nextIndex;
      const startAt = new Date(Date.now() + 5000).toISOString();

      await supabase
        .from("room_players")
        .update({ finished_at: null, steps: null, errors: 0 })
        .eq("room_id", roomId);

      await supabase
        .from("rooms")
        .update({
          status: "countdown",
          puzzle: puzzleMeta,
          started_at: startAt
        })
        .eq("id", roomId);
    } else {
      let overallWinner = "draw";
      if (puzzleMeta.scores.A > puzzleMeta.scores.B) overallWinner = "A";
      else if (puzzleMeta.scores.B > puzzleMeta.scores.A) overallWinner = "B";

      await supabase
        .from("rooms")
        .update({
          winning_team: overallWinner,
          status: "finished",
          puzzle: puzzleMeta
        })
        .eq("id", roomId);
    }
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
  const { data: room } = await supabase.from("rooms").select("*").eq("code", code).maybeSingle();
  if (!room) return;

  const currentDifficulty = room.puzzle?.difficulty || "medium";
  const currentMaxQuestions = room.puzzle?.maxQuestions || 3;

  await supabase
    .from("room_players")
    .update({ finished_at: null, steps: null, errors: 0 })
    .eq("room_id", room.id);

  await supabase
    .from("rooms")
    .update({
      status: "lobby",
      puzzle: {
        difficulty: currentDifficulty,
        maxQuestions: currentMaxQuestions,
        currentQuestionIndex: 0,
        questions: [],
        scores: { A: 0, B: 0 }
      },
      started_at: null,
      winning_team: null,
      winner: null,
    })
    .eq("code", code);
}
