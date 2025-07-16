import React, { memo } from "react";

export const AppHeader: React.FC = memo(() => {
  return (
    <div className="app-header">
      <h1 className="app-header__title">Agente IA Reparto</h1>
    </div>
  );
});