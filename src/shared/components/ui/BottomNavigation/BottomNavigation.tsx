import React, { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconMessageCircle, IconLayoutDashboard } from "@tabler/icons-react";

// Import bottom navigation styles
import "../../../../styles/components/bottom-navigation.css";

interface BottomNavigationProps {
  className?: string;
}

const navigationItems = [
  {
    path: "/chat",
    icon: IconMessageCircle,
    label: "Chat",
  },
  {
    path: "/dashboard",
    icon: IconLayoutDashboard,
    label: "Dashboard",
  },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = memo(
  ({ className = "" }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
      navigate(path);
    };

    return (
      <div className={`bottom-navigation ${className}`}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`bottom-navigation__item ${
                isActive ? "bottom-navigation__item--active" : ""
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon 
                size={24} 
                className="bottom-navigation__icon" 
              />
              <span className="bottom-navigation__label">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);