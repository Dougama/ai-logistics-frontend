import React, { useState } from "react";
import { getFirebaseAuth } from "../../../../shared/services/auth/firebase";

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = await getFirebaseAuth();
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label className="auth-label">Email</label>
        <input
          type="email"
          required
          className="auth-input"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label className="auth-label">Contraseña</label>
        <input
          type="password"
          required
          className="auth-input"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="auth-button"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="spinner" style={{ width: '16px', height: '16px' }} />
            Cargando...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
};
