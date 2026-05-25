const KEY = "elementopia.progress.v1";

const DEFAULT = {
  nickname: "", sessions: [], clearedDomains: [], wins: 0, losses: 0,
  matches: [], rating: 1200
};

export function loadProgress() {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch { return DEFAULT; }
}

export function resetProgress(nickname) {
  saveProgress({ ...DEFAULT, nickname: nickname || "" });
}

export function saveProgress(p) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("elementopia:progress"));
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
  const CHEM_ADJ = ["Volatile","Noble","Reactive","Inert","Catalytic","Crystalline","Ionic","Covalent"];
  const CHEM_NOUN = ["Argon","Helix","Quark","Isotope","Photon","Ester","Anion","Cation"];
  const a = CHEM_ADJ[Math.floor(Math.random()*CHEM_ADJ.length)];
  const n = CHEM_NOUN[Math.floor(Math.random()*CHEM_NOUN.length)];
  return `${a}${n}${Math.floor(Math.random()*90+10)}`;
}

export function generateAccessCode() {
  return Math.floor(10000 + Math.random()*90000).toString();
}

// Keep the old API for compatibility with any un-migrated components (like GameBoard) for now,
// but map it to the new structure.
export async function fetchProgress(nickname) {
  const p = loadProgress();
  // Ensure the nickname matches if we want
  if (p.nickname !== nickname) {
    p.nickname = nickname;
    saveProgress(p);
  }
  return p.sessions.map(s => ({
    domain: s.domainId,
    attempts: s.incorrect + (s.cleared ? 1 : 0),
    correct: s.correct,
    completed: s.cleared,
    time_seconds: Math.floor(s.durationMs / 1000),
    hazmat_activations: s.hazmat ? 1 : 0,
  }));
}

export async function upsertProgress(row) {
  const p = loadProgress();
  p.nickname = row.nickname;
  
  if (!p.clearedDomains) p.clearedDomains = [];
  if (!p.sessions) p.sessions = [];
  
  if (row.completed && !p.clearedDomains.includes(row.domain)) {
    p.clearedDomains.push(row.domain);
  }
  
  // We'll just push a new session for every attempt/row update to simulate it,
  // or update the last one if it matches the domain.
  const lastSessionIdx = p.sessions.findIndex(s => s.domainId === row.domain);
  if (lastSessionIdx >= 0) {
    const s = p.sessions[lastSessionIdx];
    s.cleared = s.cleared || row.completed;
    s.correct = Math.max(s.correct || 0, row.correct || 0);
    s.incorrect = Math.max(s.incorrect || 0, (row.attempts || 0) - (row.completed ? 1 : 0));
    s.durationMs = Math.max(s.durationMs || 0, (row.time_seconds || 0) * 1000);
    if (row.hazmat_activations > 0) s.hazmat = true;
  } else {
    p.sessions.push({
      domainId: row.domain,
      domainName: row.domain,
      startedAt: Date.now(),
      durationMs: (row.time_seconds || 0) * 1000,
      correct: row.correct || 0,
      incorrect: (row.attempts || 0) - (row.completed ? 1 : 0),
      hazmat: row.hazmat_activations > 0,
      cleared: row.completed || false,
      mode: "puzzle",
    });
  }
  
  saveProgress(p);
}
