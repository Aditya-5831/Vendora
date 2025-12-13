import Navbar from "@/src/components/Navbar";
import Sidebar from "@/src/components/Sidebar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className="flex items-center gap-20">
        <Sidebar />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
