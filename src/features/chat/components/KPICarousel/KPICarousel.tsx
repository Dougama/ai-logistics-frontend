import React from 'react';
import { IconTrendingUp, IconTarget, IconX } from '@tabler/icons-react';

interface KPIData {
  id: string;
  kpi_entrega_en_rango: number;
  kpi_recargues: number;
  kpi_refusal: number;
  nombre: string;
  fecha: string;
  cedula: string;
  variable: number;
  variableMes: number;
}

interface KPIParameters {
  kpi_entrega_en_rango_goal: number;
  kpi_recargues_goal: number;
  kpi_refusal_goal: number;
  entrega_en_rango_w: number;
  recargues_w: number;
  refusal_w: number;
}

interface CompensationData {
  compensationList: KPIData[];
  parameters: KPIParameters;
  total_registros: number;
}

interface KPICarouselProps {
  data: CompensationData;
}

interface CircularGaugeProps {
  value: number;
  goal: number;
  isInverse?: boolean; // Para KPI refusal que es mejor cuando es menor
  label: string;
  weight: number;
  size?: number;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({ 
  value, 
  goal, 
  isInverse = false, 
  label, 
  weight, 
  size = 80 
}) => {
  // Determinar si cumple la meta
  const meetGoal = isInverse ? value <= goal : value >= goal;
  const color = meetGoal ? '#4CAF50' : '#F44336';
  
  // Calcular porcentaje para el arco (0-100%)
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="kpi-gauge">
      <div className="kpi-gauge__circle" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="kpi-gauge__svg">
          {/* Círculo de fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="6"
          />
          {/* Círculo de progreso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="kpi-gauge__progress"
          />
        </svg>
        
        {/* Valor central */}
        <div className="kpi-gauge__value">
          <span className="kpi-gauge__percentage" style={{ color }}>
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Información debajo */}
      <div className="kpi-gauge__info">
        <div className="kpi-gauge__goal">
          Meta {isInverse ? '≤' : '≥'} {goal}%
        </div>
        <div className="kpi-gauge__label">{label}</div>
        <div className="kpi-gauge__weight">Aporta {(weight * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
};

export const KPICarousel: React.FC<KPICarouselProps> = ({ data }) => {
  const { compensationList, parameters } = data;
  
  if (!compensationList || compensationList.length === 0) {
    return null;
  }

  const firstRecord = compensationList[0];
  
  // Configuración de KPIs
  const kpiConfigs = [
    {
      key: 'kpi_entrega_en_rango',
      label: 'Entrega en Rango',
      goal: parameters.kpi_entrega_en_rango_goal,
      weight: parameters.entrega_en_rango_w,
      isInverse: false,
      icon: <IconTarget size={16} />
    },
    {
      key: 'kpi_recargues',
      label: 'Adherencia KM',
      goal: parameters.kpi_recargues_goal,
      weight: parameters.recargues_w,
      isInverse: false,
      icon: <IconTrendingUp size={16} />
    },
    {
      key: 'kpi_refusal',
      label: 'Rechazos',
      goal: parameters.kpi_refusal_goal,
      weight: parameters.refusal_w,
      isInverse: true,
      icon: <IconX size={16} />
    }
  ];

  return (
    <div className="kpi-carousel">
      {/* Header una sola vez */}
      <div className="kpi-carousel__header">
        <div className="kpi-carousel__employee">
          <h3 className="kpi-carousel__name">{firstRecord.nombre}</h3>
          <div className="kpi-carousel__details">
            <span className="kpi-carousel__cedula">CC: {firstRecord.cedula}</span>
            <span className="kpi-carousel__separator">•</span>
            <span className="kpi-carousel__date">
              {new Date(firstRecord.fecha).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
        </div>
        <div className="kpi-carousel__summary">
          <div className="kpi-carousel__variable">
            Variable: ${firstRecord.variableMes?.toLocaleString('es-CO')} COP
          </div>
        </div>
      </div>

      {/* Carrusel de KPIs por fecha */}
      <div className="kpi-carousel__content">
        {compensationList.map((record) => (
          <div key={record.id} className="kpi-carousel__date-section">
            <div className="kpi-carousel__date-header">
              <span className="kpi-carousel__date-label">
                {new Date(record.fecha).toLocaleDateString('es-CO', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short'
                })}
              </span>
              <span className="kpi-carousel__variable-daily">
                ${record.variable?.toFixed(0)}
              </span>
            </div>
            
            <div className="kpi-carousel__kpis">
              {kpiConfigs.map((config) => (
                <CircularGauge
                  key={config.key}
                  value={record[config.key as keyof KPIData] as number}
                  goal={config.goal}
                  isInverse={config.isInverse}
                  label={config.label}
                  weight={config.weight}
                  size={100}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};