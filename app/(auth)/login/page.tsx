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
        setError("El correo o la contraseña son incorrectos.");
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Algo salió mal. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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
          background: linear-gradient(180deg, #FAF8F5 0%, #F0EBE3 100%);
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -20%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle at center, rgba(139, 115, 85, 0.06) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
          animation: float 20s ease-in-out infinite;
        }

        .login-container::after {
          content: '';
          position: absolute;
          bottom: -30%;
          right: -15%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle at center, rgba(232, 220, 196, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: float 25s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border-radius: 20px;
          box-shadow:
            0 0 0 0.5px rgba(139, 115, 85, 0.1),
            0 20px 60px rgba(45, 36, 24, 0.12),
            0 8px 24px rgba(45, 36, 24, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .login-header {
          padding: 48px 36px 36px;
          text-align: center;
          background: transparent;
        }

        .login-title {
          font-size: 32px;
          font-weight: 600;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
          color: #1D1D1F;
          line-height: 1.15;
        }

        .login-subtitle {
          font-size: 17px;
          font-weight: 400;
          color: #86868B;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

        .login-form {
          padding: 0 36px 36px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #1D1D1F;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          font-size: 17px;
          border: 0.5px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          background: rgba(255, 255, 255, 0.8);
          color: #1D1D1F;
          -webkit-appearance: none;
          appearance: none;
        }

        .form-input::placeholder {
          color: #86868B;
          font-weight: 400;
        }

        .form-input:focus {
          outline: none;
          border-color: #8B7355;
          background: rgba(255, 255, 255, 0.95);
          box-shadow:
            0 0 0 4px rgba(139, 115, 85, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .form-input:disabled {
          background: rgba(0, 0, 0, 0.03);
          cursor: not-allowed;
          opacity: 0.5;
        }

        .error-message {
          background: rgba(255, 59, 48, 0.08);
          border: 0.5px solid rgba(255, 59, 48, 0.2);
          color: #D32F2F;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 400;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .error-icon {
          flex-shrink: 0;
          font-size: 17px;
          margin-top: 1px;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          margin-top: 8px;
          font-size: 17px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: white;
          background: #8B7355;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
          position: relative;
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .submit-button:hover:not(:disabled) {
          background: #7A6347;
          box-shadow:
            0 2px 8px rgba(139, 115, 85, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .submit-button:active:not(:disabled) {
          transform: scale(0.98);
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .submit-button:disabled {
          background: rgba(139, 115, 85, 0.5);
          cursor: not-allowed;
          opacity: 0.6;
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
          padding: 24px 36px 32px;
          text-align: center;
          font-size: 13px;
          color: #86868B;
          line-height: 1.5;
          letter-spacing: -0.01em;
          background: transparent;
        }

        .footer-text {
          margin-bottom: 6px;
          font-weight: 400;
        }

        .footer-link {
          color: #8B7355;
          text-decoration: none;
          font-weight: 500;
          letter-spacing: -0.01em;
          transition: opacity 0.2s ease;
        }

        .footer-link:hover {
          opacity: 0.7;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .login-container {
            padding: 20px;
          }

          .login-card {
            max-width: 100%;
          }

          .login-header {
            padding: 40px 28px 28px;
          }

          .login-form {
            padding: 0 28px 28px;
          }

          .login-footer {
            padding: 20px 28px 28px;
          }

          .login-title {
            font-size: 28px;
          }

          .login-subtitle {
            font-size: 15px;
          }

          .form-input {
            font-size: 16px;
          }

          .submit-button {
            font-size: 16px;
          }
        }

        /* Accessibility: Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .login-container::before,
          .login-container::after {
            animation: none;
          }

          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Iniciar sesión</h1>
            <p className="login-subtitle">Accede a tu panel de administración</p>
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
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="nombre@ejemplo.com"
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
                placeholder="Ingresa tu contraseña"
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
            <a href="/menu" className="footer-link">
              Ver menú →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
