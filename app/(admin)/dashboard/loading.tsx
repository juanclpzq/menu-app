export default function DashboardLoading() {
  return (
    <>
      <style>{`
        @keyframes dashboardPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .dashboard-loading-skeleton {
          animation: dashboardPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div style={{
        padding: "40px 20px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}>
        <div style={{
          marginBottom: "32px",
        }}>
          <div className="dashboard-loading-skeleton" style={{
            height: "32px",
            width: "200px",
            background: "#E8DCC4",
            borderRadius: "4px",
            marginBottom: "8px",
          }}></div>
          <div className="dashboard-loading-skeleton" style={{
            height: "20px",
            width: "300px",
            background: "#F5F0E8",
            borderRadius: "4px",
          }}></div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}>
              <div className="dashboard-loading-skeleton" style={{
                height: "20px",
                width: "60%",
                background: "#E8DCC4",
                borderRadius: "4px",
                marginBottom: "16px",
              }}></div>
              <div className="dashboard-loading-skeleton" style={{
                height: "32px",
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
