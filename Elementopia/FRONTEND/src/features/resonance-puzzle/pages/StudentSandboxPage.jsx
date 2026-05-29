import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SiteHeader } from '@/components/common/SiteHeader';
import ChemSim from '../components/ChemSim';

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StudentSandboxPage = () => {
  return (
    <div className="elementopia-scope h-screen grid-bg text-foreground flex flex-col overflow-hidden">
      <SiteHeader />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 py-12">
          <ChemSim />
        </div>
      </main>
    </div>
  );
};

export default StudentSandboxPage;
