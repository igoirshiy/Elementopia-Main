import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SiteHeader } from '@/components/common/SiteHeader';
import { ChemSim } from '@/features/resonance-puzzle';

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StudentSandboxPage = () => {
  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4">
        <ChemSim />
      </main>
    </div>
  );
};

export default StudentSandboxPage;
