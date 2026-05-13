import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import {
  FiUsers, FiPackage, FiPlus, FiArrowRight,
  FiTrendingUp, FiEdit2, FiMapPin,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/products', { params: { limit: 6 } }),
    ]).then(([statsRes, productsRes]) => {
      setStats(statsRes.data.data?.stats);
      setRecentProducts(productsRes.data.data?.products ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">{greeting}, {user?.name} 👋</p>
          <h1 className="dash-title">Dashboard Overview</h1>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="stats-grid stagger">
        <div className="stat-card">
          <div className="stat-card-inner">
            <div className="stat-icon-wrap users">
              <FiUsers size={20} />
            </div>
            <div className="stat-body">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{stats?.totalUsers ?? 0}</p>
            </div>
          </div>
          <div className="stat-footer">
            <Link to="/admin/users" className="stat-footer-link">
              View all users <FiArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-inner">
            <div className="stat-icon-wrap products">
              <FiPackage size={20} />
            </div>
            <div className="stat-body">
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{stats?.totalProducts ?? 0}</p>
            </div>
          </div>
          <div className="stat-footer">
            <Link to="/admin/products" className="stat-footer-link">
              Manage products <FiArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="stat-card stat-card-cta">
          <div className="stat-card-inner">
            <div className="stat-icon-wrap add">
              <FiPlus size={20} />
            </div>
            <div className="stat-body">
              <p className="stat-label">Quick Action</p>
              <p className="stat-cta-text">Create a new listing</p>
            </div>
          </div>
          <div className="stat-footer">
            <Link to="/admin/products/new" className="stat-footer-link">
              Add product <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent listings ── */}
      {recentProducts.length > 0 && (
        <div className="recent-section">
          <div className="recent-header">
            <div className="recent-title">
              <FiTrendingUp size={17} />
              <h2>Recent Listings</h2>
            </div>
            <Link to="/admin/products" className="btn btn-outline btn-sm">View all</Link>
          </div>

          <div className="recent-grid">
            {recentProducts.map((p, i) => (
              <div key={p._id} className="recent-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="recent-card-img">
                  <img
                    src={p.images?.[0] || 'https://placehold.co/300x200/13131f/444?text=No+Image'}
                    alt={p.title}
                  />
                  <span className="badge badge-cyan recent-badge">{p.category}</span>
                </div>
                <div className="recent-card-body">
                  <p className="recent-card-title">{p.title}</p>
                  {p.location && (
                    <p className="recent-card-location">
                      <FiMapPin size={11} /> {p.location}
                    </p>
                  )}
                  <div className="recent-card-footer">
                    <span className="recent-card-price">${Number(p.price).toLocaleString()}</span>
                    <Link to={`/admin/products/edit/${p._id}`} className="btn btn-outline btn-sm recent-edit-btn">
                      <FiEdit2 size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
