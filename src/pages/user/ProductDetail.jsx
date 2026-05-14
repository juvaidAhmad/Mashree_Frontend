import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { SkeletonProductDetail } from '../../components/SkeletonCard';
import { FiMapPin, FiUser, FiArrowLeft, FiTag, FiShoppingCart, FiX } from 'react-icons/fi';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [showMaintenance, setShowMaintenance] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.data?.product))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page">
      <div className="container">
        <SkeletonProductDetail />
      </div>
    </div>
  );
  if (error) return (
    <div className="page container">
      <div className="empty-state">
        <h3>{error}</h3>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );

  const images = product.images?.length ? product.images : ['https://placehold.co/600x400?text=No+Image'];

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="product-detail card">
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={images[activeImg]} alt={product.title} />
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <button key={i} className={`thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="product-info">
            <span className="badge badge-primary"><FiTag size={12} /> {product.category}</span>
            <h1 className="product-detail-title">{product.title}</h1>
            <p className="product-detail-price">${Number(product.price).toLocaleString()}</p>
            {product.location && (
              <p className="product-detail-meta"><FiMapPin size={14} /> {product.location}</p>
            )}
            {product.createdBy && (
              <p className="product-detail-meta"><FiUser size={14} /> {product.createdBy.name}</p>
            )}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            <button className="btn btn-primary btn-buy" onClick={() => setShowMaintenance(true)}>
              <FiShoppingCart size={17} /> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ── Maintenance modal ── */}
      {showMaintenance && (
        <div className="maintenance-overlay" onClick={() => setShowMaintenance(false)}>
          <div className="maintenance-modal card" onClick={(e) => e.stopPropagation()}>
            <button className="maintenance-close" onClick={() => setShowMaintenance(false)}>
              <FiX size={18} />
            </button>
            <div className="maintenance-icon">🚧</div>
            <h2 className="maintenance-title">Under Maintenance</h2>
            <p className="maintenance-msg">
              Our checkout system is currently being upgraded. Check back soon!
            </p>
            <button className="btn btn-outline" onClick={() => setShowMaintenance(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
