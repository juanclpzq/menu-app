// components/providers/ToastProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#2D2418",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #E8DCC4",
          boxShadow: "0 4px 12px rgba(45, 36, 24, 0.15)",
          fontSize: "14px",
          fontWeight: "500",
        },
        success: {
          iconTheme: {
            primary: "#4CAF50",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#D32F2F",
            secondary: "#fff",
          },
        },
        loading: {
          iconTheme: {
            primary: "#8B7355",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
