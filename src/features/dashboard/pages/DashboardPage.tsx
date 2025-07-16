import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IconMessageCircle,
  IconFileText,
  IconFlag,
  IconSearch,
} from "@tabler/icons-react";

// Import dashboard component styles
import "../../../styles/components/dashboard.css";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-clean">
      <div className="dashboard-header">
        <h1 className="dashboard-main-title">Centro de distribución</h1>
        <p className="dashboard-subtitle">Sistema de gestión inteligente</p>
        <p className="dashboard-location">Cúcuta</p>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-nav-buttons">
          <button
            className="dashboard-nav-button dashboard-nav-button--files"
            onClick={() => navigate("/documentation")}
          >
            <IconFileText size={24} />
            Archivos
          </button>
          <button
            className="dashboard-nav-button dashboard-nav-button--report"
            onClick={() => console.log("Reportar")}
          >
            <IconFlag size={24} />
            Reportar
          </button>
          <button
            className="dashboard-nav-button dashboard-nav-button--search"
            onClick={() => console.log("Consultar")}
          >
            <IconSearch size={24} />
            Consultar
          </button>
        </div>

        <button
          className="dashboard-chat-button"
          onClick={() => navigate("/chat")}
        >
          <IconMessageCircle size={24} />
          Iniciar Chat con Tracko
        </button>
      </div>
    </div>
  );
};
