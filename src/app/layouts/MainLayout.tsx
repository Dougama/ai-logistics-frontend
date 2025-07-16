import React from "react";
import { BottomNavigation } from "../../shared/components/ui";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <main className="page-with-bottom-nav">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};