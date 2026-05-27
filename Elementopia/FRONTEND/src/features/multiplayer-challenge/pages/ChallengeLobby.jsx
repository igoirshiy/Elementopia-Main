import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/common/SiteHeader';
import { getStoredNickname, setStoredNickname } from '@/features/auth-user/lib/session';
import { joinRoom } from '@/features/multiplayer-challenge/lib/room';

export default function ChallengeLobby() {
  const navigate = useNavigate();
  const [nick, setNick] = useState(getStoredNickname());
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCreateRoom() {
    setStoredNickname(nick);
    navigate('/challenge/setup');
  }

  async function handleJoinRoom(e) {
    e.preventDefault();
    setError("");
    const code = joinCode.trim();
    if (code.length !== 5) {
      setError("Code must be 5 characters");
      return;
    }
    setLoading(true);
    try {
      setStoredNickname(nick);
      const room = await joinRoom(code, nick);
      navigate(`/challenge/${room.code}`);
    } catch (err) {
      setError(err.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="elementopia-scope min-h-screen bg-[#0f0f15] text-foreground flex flex-col">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="font-pixel text-glow-pink text-2xl uppercase">OPPONENT CHALLENGE</h1>
        <p className="mt-4 text-white/60 text-sm">Race a peer to synthesize the correct compound first. Speed-to-Compound wins.</p>

        <div className="card-glass rounded-xl p-5 mt-8 border border-magenta/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
          <label className="text-xs font-mono tracking-widest text-white/50 block mb-2">SESSION NICKNAME</label>
          <input
            value={nick}
            onChange={e => {
              const val = e.target.value.replace(/[^A-Za-z0-9_]/g, "").slice(0, 15);
              setNick(val);
              setStoredNickname(val);
            }}
            className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-white font-mono outline-none focus:border-magenta/50 transition-colors"
            placeholder="Enter session nickname..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="card-glass rounded-2xl p-8 border border-white/10 hover:border-magenta/30 transition-colors flex flex-col justify-between group">
            <div>
              <div className="font-pixel text-glow-yellow text-sm group-hover:text-yellow-300 transition-colors">CREATE ROOM</div>
              <p className="text-white/60 text-sm mt-4 leading-relaxed">Generate a 5-digit access code and configure your 1v1 up to 5v5 team duel.</p>
            </div>
            <button onClick={handleCreateRoom} className="btn-gradient mt-8 px-5 py-3.5 rounded-lg w-full font-bold shadow-[0_0_15px_rgba(236,72,153,0.3)]">Configure &amp; share code</button>
          </div>

          <form onSubmit={handleJoinRoom} className="card-glass rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors flex flex-col justify-between group">
            <div>
              <div className="font-pixel text-glow-pink text-sm group-hover:text-cyan-400 transition-colors">JOIN ROOM</div>
              <p className="text-white/60 text-sm mt-4 leading-relaxed">Enter the 5-digit access code from your host.</p>
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 5))}
                placeholder="00000"
                className="mt-6 w-full bg-black/60 border border-white/15 rounded-lg px-4 py-4 text-center font-mono text-glow-pink text-2xl tracking-[0.4em] outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all uppercase"
                disabled={loading}
              />
              {error && <div className="mt-3 text-xs text-pink-400 font-mono text-center">{error}</div>}
            </div>
            <button
              type="submit"
              disabled={loading || joinCode.length !== 5}
              className="mt-6 w-full px-5 py-3.5 rounded-lg border border-white/15 hover:bg-white/10 hover:border-cyan-500/50 text-white/90 transition-all font-bold disabled:opacity-50"
            >
              {loading ? "Joining..." : "Enter match"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
