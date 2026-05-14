import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { SkeletonDashboard } from '../../components/SkeletonCard';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  FiUsers, FiPackage, FiPlus, FiArrowRight,
  FiTrendingUp, FiEdit2, FiMapPin, FiPieChart, FiBarChart2,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const PIE_COLORS = ['#7c3aed', '#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#64748b'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{payload[0].name}</p>
      <p className="chart-tooltip-value">{payload[0].value}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/products', { params: { limit: 6 } }),
      api.get('/products', { params: { limit: 100 } }),
    ]).then(([statsRes, recentRes, allRes]) => {
      setStats(statsRes.data.data?.stats);
      setRecentProducts(recentRes.data.data?.products ?? []);
      setAllProducts(allRes.data.data?.products ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonDashboard />;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Build category breakdown for pie chart
  const categoryMap = {};
  allProducts.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Build price range breakdown for bar chart
  const priceRanges = [
    { label: '$0–50',    min: 0,    max: 50 },
    { label: '$51–200',  min: 51,   max: 200 },
    { label: '$201–500', min: 201,  max: 500 },
    { label: '$501–1k',  min: 501,  max: 1000 },
    { label: '$1k+',     min: 1001, max: Infinity },
  ];
  const priceData = priceRanges.map(({ label, min, max }) => ({
    label,
    count: allProducts.filter((p) => p.price >= min && p.price <= max).length,
  }));

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
            <div className="stat-icon-wrap users"><FiUsers size={20} /></div>
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
            <div className="stat-icon-wrap products"><FiPackage size={20} /></div>
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
            <div className="stat-icon-wrap add"><FiPlus size={20} /></div>
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

      {/* ── Charts ── */}
      {allProducts.length > 0 && (
        <div className="charts-grid">
          {/* Pie — category breakdown */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <FiPieChart size={16} />
              <h2>Products by Category</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(value) => <span style={{ color: 'var(--text-2)', fontSize: '.78rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar — price range distribution */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <FiBarChart2 size={16} />
              <h2>Price Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priceData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,.08)' }} />
                <Bar dataKey="count" name="Products" radius={[6, 6, 0, 0]}>
                  {priceData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? '#7c3aed' : '#06b6d4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
                    <p className="recent-card-location"><FiMapPin size={11} /> {p.location}</p>
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
