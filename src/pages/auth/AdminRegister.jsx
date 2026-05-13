import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';
import './AdminAuth.css';

export default function AdminRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', inviteCode: '' });
  const [avatar, setAvatar] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      const { data } = await api.post('/auth/register-admin', fd);
      const { user, token } = data.data;
      login({ ...user, token });
      toast.success('Admin account created');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="admin-auth-icon">
            <FiShield size={28} />
          </div>
          <h1>Admin Registration</h1>
          <p>You need a valid invite code to register as admin</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Admin name" required value={form.name} onChange={set('name')} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="admin@example.com" required value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" required minLength={6} value={form.password} onChange={set('password')} />
          </div>
          <div className="form-group">
            <label>Admin Invite Code</label>
            <div className="input-with-icon">
              <input
                type={showCode ? 'text' : 'password'}
                placeholder="Enter invite code"
                required
                value={form.inviteCode}
                onChange={set('inviteCode')}
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowCode((v) => !v)}>
                {showCode ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Profile Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
          </div>
          <button type="submit" className="btn btn-admin" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating admin account...' : 'Create Admin Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/admin/login">Admin Login</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: '.25rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
