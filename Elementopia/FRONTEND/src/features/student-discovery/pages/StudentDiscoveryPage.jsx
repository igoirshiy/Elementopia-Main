import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Modal } from "@mui/material";
import { SiteHeader } from '@/components/common/SiteHeader';
import DiscoveryService from '@/features/student-discovery/services/DiscoveryService';
import UserService from '@/features/auth-user';
import ScienceIcon from "@mui/icons-material/Science";
import { Sparkles } from "lucide-react";
import compoundElements from "@/features/resonance-puzzle/data/compound-elements.json";

const StudentDiscoveryPage = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscovery, setSelectedDiscovery] = useState(null);

  useEffect(() => {
    const fetchDiscoveries = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (user && user.userId) {
          const response = await DiscoveryService.getCurrentUserDiscoveries(user.userId);
          const data = response.data || response;
          setDiscoveries(data);
        }
      } catch (error) {
        console.error("Failed to fetch discoveries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscoveries();
  }, []);

  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs text-muted-foreground tracking-[0.3em] uppercase">LABORATORY</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 text-white flex items-center gap-4" style={{ textShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
            <ScienceIcon fontSize="large" sx={{ color: '#ec4899' }} /> Your Discoveries
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-[15px]">
            Review all the unique molecular compounds you have synthesized in the Chemistry Sandbox.
          </p>
        </div>

        {loading ? (
          <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading your lab notes...</p>
        ) : discoveries.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="font-display text-2xl font-bold text-muted-foreground mb-2">
              You haven't discovered any compounds yet!
            </h2>
            <p className="text-muted-foreground">
              Head over to the Chemistry Simulation to start combining elements.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoveries.map((disc, index) => (
              <button
                key={index}
                onClick={() => setSelectedDiscovery(disc)}
                className="text-left rounded-2xl border border-border/40 bg-card p-6 hover:-translate-y-1 transition shadow-[0_0_15px_rgba(34,211,238,0.05)] hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition">
                   <Sparkles className="w-16 h-16 text-cyan" />
                </div>
                <div className="h-1.5 w-12 rounded-full bg-gradient-cyan mb-4" />
                <h3 className="font-display text-2xl font-bold mb-2 text-white group-hover:text-cyan transition">
                  {disc.name || "Unknown Compound"}
                </h3>
                {disc.symbol && (
                  <p className="font-mono text-xs font-bold text-magenta mb-4">{disc.symbol}</p>
                )}
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Discovered on: {disc.dateDiscovered || new Date().toISOString().split('T')[0]}
                </p>
                <p className="mt-4 text-xs font-semibold text-cyan opacity-0 group-hover:opacity-100 transition">
                  View Data →
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Premium Discovery Modal (Mirrors ChemSim) */}
        <Modal
            open={!!selectedDiscovery}
            onClose={() => setSelectedDiscovery(null)}
        >
            <div 
                className="elementopia-scope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] max-h-[90vh] outline-none focus:outline-none focus-visible:outline-none border-none ring-0 flex flex-col text-foreground"
                style={{ minHeight: 'auto', background: 'transparent' }}
            >
                {selectedDiscovery && (() => {
                    const dictEntry = compoundElements.find(c => c.NAME === selectedDiscovery.name) || {};
                    const symbol = selectedDiscovery.symbol || dictEntry.Symbol;
                    const description = selectedDiscovery.description || dictEntry.Description;
                    const uses = selectedDiscovery.uses || (dictEntry.Uses ? dictEntry.Uses.join(", ") : null);
                    const elements = selectedDiscovery.elements || (dictEntry.Elements ? dictEntry.Elements.join(", ") : null);
                    
                    return (
                        <div className="relative bg-[#0a0c14] border border-border rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col max-h-full">

                            <div className="flex-1 pr-2 text-left">
                                <div className="mb-6 inline-flex rounded-xl bg-gradient-cyan glow-cyan px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-primary-foreground">
                                    Laboratory Record
                                </div>

                                <h2 className="font-pixel text-2xl font-bold sm:text-4xl text-glow-magenta mb-2">
                                    {selectedDiscovery.name}
                                </h2>
                                
                                <p className="mt-2 font-mono text-sm text-cyan mb-8">
                                    Formula: {symbol}
                                </p>

                                <div className="space-y-6">
                                    <div className="text-sm text-muted-foreground/80 leading-relaxed overflow-y-auto max-h-[160px] custom-scrollbar">
                                        {description || "No description available in the archives."}
                                    </div>

                                    <div className="border-t border-border pt-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                                                    Primary Applications
                                                </h4>
                                                <p className="text-sm font-bold text-white/90">
                                                    {uses || "None specified."}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                                                    Elemental Composition
                                                </h4>
                                                <p className="text-sm font-bold text-cyan">
                                                    {elements || "Unknown."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6 shrink-0">
                                <div className="font-mono text-xs text-muted-foreground">
                                    Synthesized successfully.
                                </div>
                                <button
                                    onClick={() => setSelectedDiscovery(null)}
                                    className="rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-6 py-2.5 font-['Montserrat',sans-serif] font-[800] text-[0.85rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider whitespace-nowrap"
                                >
                                    Close Record
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </Modal>
      </main>
    </div>
  );
};

export default StudentDiscoveryPage;
