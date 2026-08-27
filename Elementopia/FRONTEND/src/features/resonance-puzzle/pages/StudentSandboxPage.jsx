import React from "react";
import { SiteHeader } from '@/components/common/SiteHeader';
import ChemSim from '../components/ChemSim';

const StudentSandboxPage = () => {
  return (
    <div className="elementopia-scope min-h-screen lg:h-screen grid-bg text-foreground flex flex-col overflow-y-auto lg:overflow-hidden">
      <SiteHeader />
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-col overflow-y-auto lg:overflow-hidden">
        <ChemSim />
      </main>
    </div>
  );
};

export default StudentSandboxPage;
