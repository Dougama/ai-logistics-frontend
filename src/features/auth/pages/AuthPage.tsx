import React, { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

// Import auth component styles
import "../../../styles/components/auth.css";

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLogin ? "Bienvenido a Tracko" : "Crear Cuenta"}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? "Inicia sesión para continuar"
              : "Rellena los campos para registrarte"}
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onToggleMode={toggleMode} />
        )}

        <div className="auth-footer">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button onClick={toggleMode} className="auth-link">
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};
