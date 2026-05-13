import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { FiUsers, FiPackage } from 'react-icons/fi';
import './Dashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data.data?.stats))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>
      {loading ? <Spinner /> : (
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon users"><FiUsers size={24} /></div>
            <div>
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{stats?.totalUsers ?? 0}</p>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon products"><FiPackage size={24} /></div>
            <div>
              <p className="stat-label">Total Products</p>
              <p className="stat-value">{stats?.totalProducts ?? 0}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
