import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const img = product.images?.[0] || 'https://placehold.co/400x300?text=No+Image';

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-card-img">
        <img src={img} alt={product.title} loading="lazy" />
        <span className="badge badge-primary product-category">{product.category}</span>
      </div>
      <div className="product-card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${Number(product.price).toLocaleString()}</p>
        {product.location && (
          <p className="product-location"><FiMapPin size={13} /> {product.location}</p>
        )}
      </div>
    </Link>
  );
}
