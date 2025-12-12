export default function MenuLoading() {
  return (
    <>
      <style>{`
        @keyframes menuPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .menu-loading-skeleton {
          animation: menuPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        padding: "80px 20px 40px",
        background: "#FAF8F5",
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "48px",
        }}>
          <div className="menu-loading-skeleton" style={{
            height: "48px",
            width: "250px",
            background: "#E8DCC4",
            borderRadius: "8px",
            margin: "0 auto 8px",
          }}></div>
          <div className="menu-loading-skeleton" style={{
            height: "20px",
            width: "200px",
            background: "#F5F0E8",
            borderRadius: "4px",
            margin: "0 auto",
          }}></div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}>
              <div className="menu-loading-skeleton" style={{
                height: "200px",
                background: "#E8DCC4",
                borderRadius: "12px",
                marginBottom: "16px",
              }}></div>
              <div className="menu-loading-skeleton" style={{
                height: "24px",
                width: "70%",
                background: "#E8DCC4",
                borderRadius: "4px",
                marginBottom: "12px",
              }}></div>
              <div className="menu-loading-skeleton" style={{
                height: "20px",
                width: "40%",
                background: "#F5F0E8",
                borderRadius: "4px",
              }}></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
