"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);

      // Show prompt after 30 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '90px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        maxWidth: '90%',
        width: '360px',
        animation: 'slideUp 300ms ease-out',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .install-prompt {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border: 2px solid #8B7355;
        }

        .install-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .install-title {
          font-size: 16px;
          font-weight: 700;
          color: #2D2418;
          margin-bottom: 4px;
        }

        .install-description {
          font-size: 14px;
          color: #7A6A56;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .install-actions {
          display: flex;
          gap: 8px;
        }

        .install-btn {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 200ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .install-btn-primary {
          background: #8B7355;
          color: white;
        }

        .install-btn-primary:hover {
          background: #7A6347;
        }

        .install-btn-secondary {
          background: transparent;
          color: #7A6A56;
          border: 2px solid #E8DCC4;
        }

        .install-btn-secondary:hover {
          background: #F5F5F5;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #7A6A56;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 150ms ease;
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <div className="install-prompt">
        <div className="install-header">
          <div>
            <div className="install-title">Instalar Menú Digital</div>
          </div>
          <button className="close-btn" onClick={handleDismiss}>
            <X size={20} />
          </button>
        </div>

        <p className="install-description">
          Instala la app para acceder rápidamente al menú, incluso sin conexión.
        </p>

        <div className="install-actions">
          <button className="install-btn install-btn-secondary" onClick={handleDismiss}>
            Ahora no
          </button>
          <button className="install-btn install-btn-primary" onClick={handleInstallClick}>
            <Download size={16} />
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
