"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div style={{
      padding: "40px 20px",
      maxWidth: "600px",
      margin: "0 auto",
      textAlign: "center",
    }}>
      <h2 style={{
        fontSize: "24px",
        fontWeight: "700",
        color: "#2D2418",
        marginBottom: "16px",
      }}>
        Error en el Dashboard
      </h2>
      <p style={{
        fontSize: "16px",
        color: "#7A6A56",
        marginBottom: "24px",
        lineHeight: "1.5",
      }}>
        No se pudieron cargar los datos del dashboard. Por favor, intenta recargar la página.
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
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
