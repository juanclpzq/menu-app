"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Product } from "@/types";

interface VintageProductCardProps {
  product: Product & { number: string };
}

export function VintageProductCard({ product }: VintageProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <>
      <style>{`
        .card-flip-container {
          perspective: 1000px;
          height: 420px;
          min-height: 420px;
        }

        .vintage-card-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .vintage-card-wrapper.flipped {
          transform: rotateY(180deg);
        }

        .vintage-card {
          backface-visibility: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
          background: #F5F5DC;
          padding: 28px 24px;
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.15),
            inset 0 0 0 1px rgba(0, 0, 0, 0.1);
          transition: box-shadow 300ms ease;
          border: 3px double rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .card-front {
          z-index: 2;
        }

        .vintage-card-wrapper.flipped .card-front {
          z-index: 1;
        }

        .card-back {
          transform: rotateY(180deg);
          z-index: 1;
        }

        .vintage-card-wrapper.flipped .card-back {
          z-index: 2;
        }

        .card-flip-container:hover .vintage-card {
          box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.25),
            inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        }

        .paper-texture {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.6;
        }

        .corner-ornament {
          position: absolute;
          width: 20px;
          height: 20px;
          border-style: solid;
          border-width: 0;
          border-color: #D84315;
        }

        .corner-ornament.top-left {
          top: 12px;
          left: 12px;
          border-top-width: 2px;
          border-left-width: 2px;
        }

        .corner-ornament.top-right {
          top: 12px;
          right: 12px;
          border-top-width: 2px;
          border-right-width: 2px;
        }

        .corner-ornament.bottom-left {
          bottom: 12px;
          left: 12px;
          border-bottom-width: 2px;
          border-left-width: 2px;
        }

        .corner-ornament.bottom-right {
          bottom: 12px;
          right: 12px;
          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        .corner-ornament-small {
          position: absolute;
          width: 12px;
          height: 12px;
          border-style: solid;
          border-width: 0;
          border-color: #D84315;
        }

        .corner-ornament-small.top-left {
          top: 8px;
          left: 8px;
          border-top-width: 2px;
          border-left-width: 2px;
        }

        .corner-ornament-small.top-right {
          top: 8px;
          right: 8px;
          border-top-width: 2px;
          border-right-width: 2px;
        }

        .corner-ornament-small.bottom-left {
          bottom: 8px;
          left: 8px;
          border-bottom-width: 2px;
          border-left-width: 2px;
        }

        .corner-ornament-small.bottom-right {
          bottom: 8px;
          right: 8px;
          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        .vintage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .number-badge {
          width: 48px;
          height: 48px;
          border: 3px solid #3E2723;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 24px;
          position: relative;
          background: #F5F5DC;
          color: #3E2723;
        }

        .number-badge::before,
        .number-badge::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background: currentColor;
        }

        .number-badge::before {
          top: -4px;
          left: -4px;
        }

        .number-badge::after {
          bottom: -4px;
          right: -4px;
        }

        .vintage-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: 2px solid #D84315;
          font-family: 'Special Elite', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #F5F5DC;
          color: #D84315;
        }

        .vintage-body {
          margin-bottom: 24px;
        }

        .title-section {
          margin-bottom: 12px;
        }

        .vintage-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: #3E2723;
        }

        .decorative-line {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin: 8px 0;
        }

        .line-dot {
          font-size: 20px;
          line-height: 1;
          color: #D84315;
        }

        .vintage-description {
          font-family: 'Courier Prime', monospace;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 16px;
          opacity: 0.85;
          color: #3E2723;
        }

        .category-tag {
          font-family: 'Special Elite', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: inline-block;
          color: #3E2723;
        }

        .tag-bracket {
          font-weight: bold;
          margin: 0 4px;
          color: #D84315;
        }

        .vintage-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 2px dashed rgba(0, 0, 0, 0.2);
          margin-top: auto;
        }

        .vintage-price-section {
          display: flex;
          align-items: baseline;
          gap: 4px;
          font-family: 'Playfair Display', serif;
          color: #3E2723;
        }

        .currency-symbol {
          font-size: 18px;
          font-weight: 700;
        }

        .price-amount {
          font-size: 36px;
          font-weight: 900;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .price-label {
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.7;
        }

        .vintage-btn {
          padding: 14px 28px;
          font-family: 'Special Elite', monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 3px solid #D84315;
          background: transparent;
          cursor: pointer;
          transition: all 200ms ease;
          color: #D84315;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }

        .vintage-btn:hover {
          background: #D84315;
          color: #F5F5DC;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .vintage-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .vintage-btn {
            padding: 12px 24px;
            font-size: 13px;
          }
        }

        .card-back-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 16px;
        }

        .polaroid-frame {
          background: white;
          padding: 12px;
          padding-bottom: 40px;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px rgba(0, 0, 0, 0.1);
          position: relative;
          transform: rotate(-1deg);
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .polaroid-image-container {
          position: relative;
          width: 100%;
          flex: 1;
          overflow: hidden;
          background: #E0E0E0;
          border: 2px solid rgba(0, 0, 0, 0.1);
          min-height: 0;
        }

        .polaroid-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .image-texture {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.3;
          mix-blend-mode: overlay;
        }

        .polaroid-caption {
          position: absolute;
          bottom: 4px;
          left: 12px;
          right: 12px;
          text-align: center;
          font-family: 'Special Elite', monospace;
        }

        .caption-number {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 2px;
          color: #D84315;
        }

        .caption-text {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
          color: #3E2723;
        }

        .caption-price {
          font-size: 10px;
          opacity: 0.7;
          color: #3E2723;
        }

        .back-btn {
          width: 100%;
          flex-shrink: 0;
        }
      `}</style>

      <div className="card-flip-container">
        <div className={`vintage-card-wrapper ${isFlipped ? "flipped" : ""}`}>
          {/* FRONT SIDE */}
          <article className="vintage-card card-front">
            <div className="corner-ornament top-left"></div>
            <div className="corner-ornament top-right"></div>
            <div className="corner-ornament bottom-left"></div>
            <div className="corner-ornament bottom-right"></div>

            <div className="vintage-header">
              <div className="number-badge">
                <span className="number-text">{product.number}</span>
              </div>

              {product.is_popular && (
                <div className="vintage-badge">
                  <Star size={14} strokeWidth={2} />
                  <span>Chef's Choice</span>
                </div>
              )}
            </div>

            <div className="vintage-body">
              <div className="title-section">
                <h3 className="vintage-title">{product.name}</h3>
                <div className="decorative-line">
                  <span className="line-dot">•</span>
                  <span className="line-dot">•</span>
                  <span className="line-dot">•</span>
                </div>
              </div>

              <p className="vintage-description">
                {product.description || "Sin descripción"}
              </p>

              <div className="category-tag">
                <span className="tag-bracket">[</span>
                {product.category}
                <span className="tag-bracket">]</span>
              </div>
            </div>

            <div className="vintage-footer">
              <div className="vintage-price-section">
                <span className="currency-symbol">$</span>
                <span className="price-amount">{product.price}</span>
                <span className="price-label">MXN</span>
              </div>

              <button
                className="vintage-btn"
                onClick={() => setIsFlipped(true)}
              >
                Ver Imagen
              </button>
            </div>

            <div className="paper-texture"></div>
          </article>

          {/* BACK SIDE */}
          <article className="vintage-card card-back">
            <div className="card-back-content">
              <div className="polaroid-frame">
                <div className="polaroid-image-container">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'}
                    alt={product.name}
                    className="polaroid-image"
                  />
                  <div className="image-texture"></div>
                </div>

                <div className="polaroid-caption">
                  <div className="caption-number">{product.number}</div>
                  <div className="caption-text">{product.name}</div>
                  <div className="caption-price">${product.price} MXN</div>
                </div>
              </div>

              <button
                className="vintage-btn back-btn"
                onClick={() => setIsFlipped(false)}
              >
                ← Regresar
              </button>
            </div>

            <div className="corner-ornament-small top-left"></div>
            <div className="corner-ornament-small top-right"></div>
            <div className="corner-ornament-small bottom-left"></div>
            <div className="corner-ornament-small bottom-right"></div>

            <div className="paper-texture"></div>
          </article>
        </div>
      </div>
    </>
  );
}
