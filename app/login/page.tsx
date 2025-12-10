// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #FAF8F5 0%, #E8DCC4 100%);
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(45, 36, 24, 0.12);
          overflow: hidden;
        }

        .login-header {
          background: linear-gradient(135deg, #8B7355 0%, #7A6347 100%);
          padding: 40px 32px;
          text-align: center;
          color: white;
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }

        .login-form {
          padding: 32px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2D2418;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 2px solid #E8DCC4;
          border-radius: 8px;
          transition: all 200ms ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #8B7355;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        }

        .form-input:disabled {
          background: #F5F5F5;
          cursor: not-allowed;
        }

        .error-message {
          background: #FFF3F3;
          border: 1px solid #FFCCCC;
          color: #D32F2F;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-icon {
          flex-shrink: 0;
        }

        .submit-button {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          background: #8B7355;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 200ms ease;
          position: relative;
        }

        .submit-button:hover:not(:disabled) {
          background: #7A6347;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          background: #B8A89A;
          cursor: not-allowed;
          transform: none;
        }

        .button-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          padding: 24px 32px;
          background: #FAF8F5;
          text-align: center;
          font-size: 13px;
          color: #7A6A56;
          border-top: 1px solid #E8DCC4;
        }

        .footer-link {
          color: #8B7355;
          text-decoration: none;
          font-weight: 600;
        }

        .footer-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-header {
            padding: 32px 24px;
          }

          .login-form {
            padding: 24px;
          }

          .login-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Dashboard Admin</h1>
            <p className="login-subtitle">Gestor de Menú Digital</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  <span style={{ marginLeft: "8px" }}>Iniciando sesión...</span>
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Sistema de gestión de menú digital
              <br />
              <a href="/menu" className="footer-link">
                Ver menú público →
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
