import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { SiteHeader } from '@/components/common/SiteHeader';
import DiscoveryService from '@/services/DiscoveryService';
import UserService from '@/services/UserService';
import ScienceIcon from "@mui/icons-material/Science";

const StudentDiscoveryPage = () => {
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <div
                key={index}
                className="rounded-2xl border border-border/40 bg-card p-6 hover:-translate-y-1 transition shadow-[0_0_15px_rgba(34,211,238,0.05)] hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
              >
                <div className="h-1.5 w-12 rounded-full bg-gradient-cyan mb-4" />
                <h3 className="font-display text-2xl font-bold mb-2 text-white">
                  {disc.name || "Unknown Compound"}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Discovered on: {disc.dateDiscovered || new Date().toISOString().split('T')[0]}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDiscoveryPage;
