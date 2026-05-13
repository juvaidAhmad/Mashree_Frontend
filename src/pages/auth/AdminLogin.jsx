import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiLogIn } from 'react-icons/fi';
import { BtnSpinner } from '../../components/Spinner';
import './Auth.css';
import './AdminAuth.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/admin-login', form);
      const { user, token } = data.data;
      login({ ...user, token });
      toast.success(`Welcome back, ${user.name}`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="admin-auth-icon"><FiShield size={28} /></div>
          <h1>Admin Login</h1>
          <p>Sign in to access the admin panel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="admin@example.com" required disabled={loading}
              value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required disabled={loading}
              value={form.password} onChange={set('password')} />
          </div>
          <button type="submit" className="btn btn-admin" disabled={loading}>
            {loading ? <><BtnSpinner /> Signing in...</> : <><FiLogIn size={15} /> Sign In as Admin</>}
          </button>
        </form>
        <p className="auth-footer">
          No admin account? <Link to="/admin/register">Register with invite code</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: '.25rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>← User login</Link>
        </p>
      </div>
    </div>
  );
}
