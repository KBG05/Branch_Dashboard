
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-collapse on mobile
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={cn(
        "flex flex-col flex-1 overflow-hidden transition-all duration-300",
        collapsed ? "ml-20" : "ml-64"
      )}>
        <Header />
        <div className="flex-1 overflow-auto p-6 bg-muted/20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
