import React from "react";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "../shared/services/auth/AuthContext";

// Import new design system
import "../styles/design-system/index.css";
import "@mantine/core/styles.css";

// Simple theme that uses our design system colors
const minimalTheme = {
  primaryColor: 'blue',
  colors: {
    blue: ['#F2F2F3', '#C1A774', '#B4895B', '#464E59', '#091626', '#091626', '#091626', '#091626', '#091626', '#091626'],
  },
  defaultRadius: 'md',
  fontFamily: 'Inter, sans-serif',
};

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <MantineProvider theme={minimalTheme} defaultColorScheme="light">
      <AuthProvider>{children}</AuthProvider>
    </MantineProvider>
  );
};
