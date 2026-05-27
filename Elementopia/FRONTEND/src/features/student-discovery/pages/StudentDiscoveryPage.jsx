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
      <main className="mx-auto max-w-[1600px] w-full px-6 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs text-muted-foreground tracking-[0.2em] uppercase">/ LABORATORY</p>
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[95vw] outline-none">
                {/* Glowing Backdrop Element */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-cyan/30 to-blue-500/30 rounded-[2.5rem] blur-2xl opacity-60 animate-pulse pointer-events-none" />
                
                {/* Main Glass Card */}
                <div className="relative bg-[#0d0f1a]/85 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 sm:p-10 text-center shadow-2xl overflow-hidden">
                    
                    {/* Decorative Top Highlight */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-magenta via-cyan to-magenta opacity-80" />

                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-cyan/10 border border-cyan/20 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                            <ScienceIcon sx={{ fontSize: 40, color: '#22d3ee' }} />
                        </div>
                    </div>
                    
                    {selectedDiscovery && (() => {
                        const dictEntry = compoundElements.find(c => c.NAME === selectedDiscovery.name) || {};
                        const symbol = selectedDiscovery.symbol || dictEntry.Symbol;
                        const description = selectedDiscovery.description || dictEntry.Description;
                        const uses = selectedDiscovery.uses || (dictEntry.Uses ? dictEntry.Uses.join(", ") : null);
                        const elements = selectedDiscovery.elements || (dictEntry.Elements ? dictEntry.Elements.join(", ") : null);
                        
                        return (
                            <div className="mt-4 mb-8 space-y-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-1 font-mono">
                                        Laboratory Record
                                    </p>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan to-blue-400 bg-clip-text text-transparent pb-1">
                                        {selectedDiscovery.name}
                                    </h3>
                                    {symbol && (
                                        <p className="font-mono text-lg font-bold text-magenta mt-1">{symbol}</p>
                                    )}
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left backdrop-blur-sm mt-4">
                                    <p className="text-[14px] text-white/90 leading-relaxed">
                                        {description || "No description available in the archives."}
                                    </p>
                                </div>

                                <div className="bg-magenta/5 border border-magenta/20 rounded-2xl p-5 text-left">
                                    <h4 className="text-[11px] font-mono text-magenta uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-magenta animate-pulse" />
                                        Primary Applications
                                    </h4>
                                    <p className="text-[13px] text-magenta/90 leading-relaxed font-medium">
                                        {uses || "None specified."}
                                    </p>
                                </div>
                                
                                {elements && (
                                    <div className="text-left mt-2">
                                        <p className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest mb-1">
                                            Elemental Composition
                                        </p>
                                        <p className="text-xs text-white/70 font-mono bg-black/40 rounded-lg p-2 border border-white/10">
                                            {elements}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    <div className="flex gap-4 justify-center mt-2">
                        <button
                            onClick={() => setSelectedDiscovery(null)}
                            className="w-full px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 text-white font-bold uppercase tracking-wider text-[11px] transition hover:bg-white/10"
                        >
                            Close Record
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
      </main>
    </div>
  );
};

export default StudentDiscoveryPage;
