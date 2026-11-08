import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { API_BASE_URL } from "@/config/apiConfig";
const KEY = "elementopia.progress.v1";
const BASE_URL = `${API_BASE_URL}/api/progress`;

const DEFAULT = {
  nickname: "", sessions: [], clearedDomains: [], wins: 0, losses: 0,
  matches: [], rating: 1200
};

let memoryCache = null;

export function loadProgress() {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    memoryCache = parsed;
    return parsed;
  } catch { return DEFAULT; }
}

export async function resetProgress(nickname) {
  const fresh = {
    ...DEFAULT,
    nickname: nickname || "",
    sessions: [],
    clearedDomains: [],
    wins: 0,
    losses: 0,
    rating: 1200
  };

  if (nickname && nickname !== "Guest Alchemist") {
    try {
      await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fresh)
      });

      await fetch(`${API_BASE_URL}/api/features/progression/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionNickname: nickname })
      });
    } catch (e) {
      console.warn("Backend reset sync failed:", e.message);
    }
  }

  memoryCache = fresh;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(fresh));
    window.dispatchEvent(new Event("elementopia:progress"));
  }

  return fresh;
}


export function saveProgress(p) {
  memoryCache = p;
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("elementopia:progress"));
  syncProgressToCloud(p);
}

export async function syncProgressToCloud(p) {
  if (!p.nickname || p.nickname === "Guest Alchemist") return;
  try {
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    });
  } catch (e) {
    console.warn("Backend down. Saved locally, cloud sync deferred:", e.message);
  }
}

export function recordMatch(opponent, result, ms, fails) {
  const p = loadProgress();
  if (!p.matches) p.matches = [];
  if (!p.rating) p.rating = 1200;

  p.matches.unshift({ at: Date.now(), opponent, result, ms, fails });
  p.matches = p.matches.slice(0, 20);
  p.rating += result === "win" ? 25 : result === "loss" ? -15 : 0;
  p.wins += result === "win" ? 1 : 0;
  p.losses += result === "loss" ? 1 : 0;
  saveProgress(p);
}

export function generateNickname() {
  const CHEM_ADJ = ["Volatile", "Noble", "Reactive", "Inert", "Catalytic", "Crystalline", "Ionic", "Covalent"];
  const CHEM_NOUN = ["Argon", "Helix", "Quark", "Isotope", "Photon", "Ester", "Anion", "Cation"];
  const a = CHEM_ADJ[Math.floor(Math.random() * CHEM_ADJ.length)];
  const n = CHEM_NOUN[Math.floor(Math.random() * CHEM_NOUN.length)];
  return `${a}${n}${Math.floor(Math.random() * 90 + 10)}`;
}

export function generateAccessCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function fetchProgress(nickname) {
  let p = loadProgress();

  if (nickname && nickname !== "Guest Alchemist") {
    try {
      const response = await fetch(`${BASE_URL}/${nickname}`);
      if (response.ok) {
        const cloudData = await response.json();

        // Merge cleared domains
        const cloudCleared = cloudData.clearedDomains || [];
        const mergedCleared = Array.from(new Set([...(p.clearedDomains || []), ...cloudCleared]));

        // Merge sessions so cloud doesn't wipe local sessions
        const localSessions = p.sessions || [];
        const cloudSessions = cloudData.sessions || [];
        const sessionMap = new Map();
        localSessions.forEach(s => sessionMap.set(s.domainId, s));
        cloudSessions.forEach(cs => {
          const existing = sessionMap.get(cs.domainId);
          if (!existing) {
            sessionMap.set(cs.domainId, cs);
          } else {
            sessionMap.set(cs.domainId, {
              ...cs,
              ...existing,
              stage: Math.max(existing.stage || 1, cs.stage || 1),
              cleared: existing.cleared || cs.cleared || false,
              attempts: Math.max(existing.attempts || 0, cs.attempts || 0),
              correct: Math.max(existing.correct || 0, cs.correct || 0),
              durationMs: (existing.durationMs && existing.durationMs > 0) ? existing.durationMs : (cs.durationMs || 0),
              hazmatCount: Math.max(existing.hazmatCount || 0, cs.hazmatCount || (cs.hazmat ? 1 : 0)),
              hazmat: existing.hazmat || cs.hazmat || false
            });
          }
        });

        p = {
          ...p,
          nickname: cloudData.nickname || nickname,
          rating: cloudData.rating !== undefined ? cloudData.rating : p.rating,
          wins: cloudData.wins !== undefined ? cloudData.wins : p.wins,
          losses: cloudData.losses !== undefined ? cloudData.losses : p.losses,
          clearedDomains: mergedCleared,
          sessions: Array.from(sessionMap.values())
        };

        memoryCache = p;
        localStorage.setItem(KEY, JSON.stringify(p));
      }
    } catch (e) {
      console.warn("Backend down. Operating purely with cached local progress:", e.message);
    }
  }

  if (p.nickname !== nickname) {
    p.nickname = nickname;
    saveProgress(p);
  }

  return (p.sessions || []).map(s => {
    const correct = s.correct || 0;
    const attempts = s.attempts !== undefined
      ? s.attempts
      : (s.incorrect !== undefined ? s.incorrect + correct : (s.cleared ? Math.max(1, correct) : correct));
    const hazmatActivations = s.hazmatCount !== undefined ? s.hazmatCount : (s.hazmat ? 1 : 0);
    return {
      domain: s.domainId,
      stage: s.stage || 1,
      attempts: attempts,
      correct: correct,
      completed: Boolean(s.cleared),
      time_seconds: Math.floor((s.durationMs || 0) / 1000),
      hazmat_activations: hazmatActivations,
    };
  });
}

export async function upsertProgress(row) {
  const p = loadProgress();
  p.nickname = row.nickname;

  if (!p.clearedDomains) p.clearedDomains = [];
  if (!p.sessions) p.sessions = [];

  if (row.completed && !p.clearedDomains.includes(row.domain)) {
    p.clearedDomains.push(row.domain);
  }

  const lastSessionIdx = p.sessions.findIndex(s => s.domainId === row.domain);
  const totalAttempts = row.attempts || 0;
  const correctCount = row.correct || 0;
  const incorrectCount = Math.max(0, totalAttempts - correctCount);
  const hazmatCount = row.hazmat_activations !== undefined ? row.hazmat_activations : (row.hazmat ? 1 : 0);
  const durationMs = (row.time_seconds || 0) * 1000;

  if (lastSessionIdx >= 0) {
    const s = p.sessions[lastSessionIdx];
    s.stage = row.stage || s.stage || 1;
    s.cleared = s.cleared || Boolean(row.completed);
    s.attempts = totalAttempts;
    s.correct = correctCount;
    s.incorrect = incorrectCount;
    if (durationMs > 0) s.durationMs = durationMs;
    s.hazmatCount = hazmatCount;
    s.hazmat = hazmatCount > 0;
  } else {
    p.sessions.push({
      domainId: row.domain,
      domainName: row.domain,
      stage: row.stage || 1,
      startedAt: Date.now(),
      durationMs: durationMs,
      attempts: totalAttempts,
      correct: correctCount,
      incorrect: incorrectCount,
      hazmatCount: hazmatCount,
      hazmat: hazmatCount > 0,
      cleared: Boolean(row.completed),
      mode: "puzzle",
    });
  }

  saveProgress(p);

  if (row.completed) {
    try {
      fetch(`${API_BASE_URL}/api/features/analytics/session/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionNickname: p.nickname,
          domainId: row.domain,
          completionSpeedSeconds: row.time_seconds || 0,
          compoundAccuracyPercentage: row.attempts ? (row.correct / row.attempts) * 100 : 0
        })
      }).catch(e => console.warn("Telemetry log failed:", e));

      const roomId = DOMAINS.findIndex(d => d.id === row.domain) + 1;
      fetch(`${API_BASE_URL}/api/features/progression/log-reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionNickname: p.nickname,
          roomId: roomId,
          correctReactionCount: row.correct || 3
        })
      }).catch(e => console.warn("Progression log failed:", e));

    } catch (e) {
      console.warn("Telemetry/Progression sync failed", e);
    }
  }
}
