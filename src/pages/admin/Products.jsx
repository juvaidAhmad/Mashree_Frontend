import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiPackage } from 'react-icons/fi';
import { BtnSpinner } from '../../components/Spinner';
import './AdminTable.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products', { params: { limit: 100 } })
      .then((res) => setProducts(res.data.data?.products ?? []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <div className="header-actions">
          <div className="table-search">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="table-search-input"
            />
          </div>
          <Link to="/admin/products/new" className="btn btn-primary">
            <FiPlus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-3)' }} />
          <h3>{search ? 'No products match your search' : 'No products yet'}</h3>
          <p>Add your first product to get started</p>
          {!search && (
            <Link to="/admin/products/new" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              <FiPlus size={15} /> Add First Product
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="table-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-info-cell">
                        <img
                          src={p.images?.[0] || 'https://placehold.co/64x48/1a1a2e/666?text=N/A'}
                          alt={p.title}
                          className="table-img"
                        />
                        <span className="table-title">{p.title}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-cyan">{p.category}</span></td>
                    <td className="td-price">${Number(p.price).toLocaleString()}</td>
                    <td className="td-location">{p.location || <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/products/${p._id}`} target="_blank" className="btn btn-outline btn-sm" title="View listing">
                          <FiEye size={14} />
                        </Link>
                        <Link to={`/admin/products/edit/${p._id}`} className="btn btn-outline btn-sm" title="Edit product">
                          <FiEdit2 size={14} />
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p._id)}
                          disabled={deletingId === p._id}
                          title="Delete product"
                        >
                          {deletingId === p._id ? <BtnSpinner /> : <FiTrash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
