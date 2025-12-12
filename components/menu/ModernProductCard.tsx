'use client'

import { useState } from 'react'
import { Star, Heart } from 'lucide-react'
import { Product } from '@/types'

interface ModernProductCardProps {
  product: Product
  onFavoriteChange?: (isFavorite: boolean) => void
}

export function ModernProductCard({ product, onFavoriteChange }: ModernProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddClick = () => {
    setIsAdded(!isAdded)
  }

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    onFavoriteChange?.(newFavoriteState)
  }

  return (
    <>
      <style>{`
        .modern-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(45, 36, 24, 0.06),
                      0 1px 2px rgba(45, 36, 24, 0.04);
          transition: all 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(45, 36, 24, 0.12),
                      0 4px 8px rgba(45, 36, 24, 0.08);
        }

        .modern-image-container {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #E8DCC4;
        }

        .modern-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 400ms ease;
        }

        .modern-card:hover .modern-image-container img {
          transform: scale(1.05);
        }

        .skeleton-loader {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #E8DCC4 0%,
            #F5EFE6 50%,
            #E8DCC4 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .modern-overlays {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .modern-badge-popular {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(193, 120, 83, 0.95);
          color: white;
          backdrop-filter: blur(8px);
        }

        .modern-btn-favorite {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          color: #8B7355;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 200ms ease;
          -webkit-tap-highlight-color: transparent;
        }

        .modern-btn-favorite:hover {
          transform: scale(1.1);
        }

        .modern-btn-favorite:active {
          transform: scale(0.95);
        }

        .modern-btn-favorite.active {
          color: #C17853;
        }

        @media (max-width: 768px) {
          .modern-btn-favorite {
            width: 44px;
            height: 44px;
          }
        }

        .modern-category-pill {
          position: absolute;
          bottom: 12px;
          left: 12px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #8B7355;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .modern-content {
          padding: 20px;
        }

        .modern-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .modern-title {
          font-size: 20px;
          font-weight: 700;
          color: #2D2418;
          letter-spacing: -0.01em;
          line-height: 1.3;
          flex: 1;
        }

        .modern-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #C17853;
          flex-shrink: 0;
        }

        .modern-description {
          font-size: 14px;
          color: #7A6A56;
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .modern-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .modern-price-container {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .modern-price {
          font-size: 28px;
          font-weight: 700;
          color: #2D2418;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }

        .modern-currency {
          font-size: 14px;
          font-weight: 500;
          color: #7A6A56;
        }

        .modern-btn-add {
          padding: 14px 28px;
          background: #8B7355;
          color: white;
          border: none;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 300ms ease;
          white-space: nowrap;
          position: relative;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }

        .modern-btn-add:hover:not(.added) {
          background: #7A6347;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
        }

        .modern-btn-add:active:not(.added) {
          transform: scale(0.98);
        }

        .modern-btn-add.added {
          background: #4CAF50;
          animation: successPulse 300ms ease;
        }

        .modern-btn-add.added:hover {
          background: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .modern-btn-add.added:active {
          transform: scale(0.98);
        }

        @keyframes successPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .modern-btn-add {
            padding: 12px 24px;
            font-size: 15px;
          }
        }
      `}</style>

      <article className="modern-card">
        <div className="modern-image-container">
          {!imageLoaded && <div className="skeleton-loader" />}
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          
          <div className="modern-overlays">
            {product.is_popular && (
              <span className="modern-badge-popular">
                <Star size={12} fill="currentColor" />
                Popular
              </span>
            )}
            <button
              className={`modern-btn-favorite ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="modern-category-pill">{product.category}</div>
        </div>

        <div className="modern-content">
          <div className="modern-header">
            <h3 className="modern-title">{product.name}</h3>
            {product.rating > 0 && (
              <div className="modern-rating">
                <Star size={14} fill="currentColor" stroke="none" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <p className="modern-description">{product.description || 'Sin descripción'}</p>

          <div className="modern-footer">
            <div className="modern-price-container">
              <span className="modern-price">${product.price}</span>
              <span className="modern-currency">MXN</span>
            </div>
            <button 
              className={`modern-btn-add ${isAdded ? 'added' : ''}`}
              onClick={handleAddClick}
            >
              {isAdded ? '✓ Guardado' : 'Agregar'}
            </button>
          </div>
        </div>
      </article>
    </>
  )
}
