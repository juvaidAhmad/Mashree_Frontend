import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './AdminTable.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get('/products', { params: { limit: 100 } })
      .then((res) => setProducts(res.data.data?.products ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      {loading ? <Spinner /> : products.length === 0 ? (
        <div className="empty-state">
          <FiPlus size={40} />
          <h3>No products yet</h3>
          <Link to="/admin/products/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Add First Product
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.images?.[0] || 'https://placehold.co/60x45?text=N/A'}
                      alt={p.title} className="table-img" />
                  </td>
                  <td className="table-title">{p.title}</td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                  <td>${Number(p.price).toLocaleString()}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/products/edit/${p._id}`} className="btn btn-outline btn-sm">
                        <FiEdit2 size={14} />
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
