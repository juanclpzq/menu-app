"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{
        maxWidth: "500px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#2D2418",
          marginBottom: "16px",
        }}>
          Algo salió mal
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#7A6A56",
          marginBottom: "24px",
        }}>
          Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            color: "white",
            background: "#8B7355",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 200ms ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#7A6347")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#8B7355")}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
