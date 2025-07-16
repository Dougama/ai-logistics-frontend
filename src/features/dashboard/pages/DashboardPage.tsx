import React from "react";
import { useAuth } from "../../../shared/services/auth";

// Import dashboard component styles
import "../../../styles/components/dashboard.css";

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  const stats = [
    { number: "142", label: "Entregas Hoy" },
    { number: "98%", label: "Eficiencia" },
    { number: "23", label: "Rutas Activas" },
    { number: "5.2h", label: "Tiempo Promedio" },
  ];

  const quickActions = [
    { title: "Optimizar Rutas", description: "Calcular rutas más eficientes" },
    { title: "Ver Inventario", description: "Consultar stock disponible" },
    { title: "Generar Reporte", description: "Crear reporte de rendimiento" },
    { title: "Seguir Envíos", description: "Rastrear paquetes en tránsito" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Bienvenido, {currentUser?.email?.split('@')[0] || 'Usuario'}
          </p>
        </div>

        <div className="dashboard-grid">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-card stats-card">
              <div className="stats-number">{stat.number}</div>
              <div className="stats-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <div className="quick-actions-header">
            <h2 className="quick-actions-title">Acciones Rápidas</h2>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button key={index} className="quick-action-button">
                <div className="quick-action-icon">⚡</div>
                <div>
                  <div className="quick-action-text">{action.title}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
