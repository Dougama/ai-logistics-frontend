import React from "react";
import { useLocation } from "react-router-dom";
import { BottomNavigation } from "../../shared/components/ui";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Solo mostrar nav bar en documentación
  const showBottomNav = location.pathname === "/documentation";
  
  return (
    <div className="app-container">
      <main className={showBottomNav ? "page-with-bottom-nav" : "page-without-bottom-nav"}>
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};