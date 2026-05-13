import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiPackage, FiUsers, FiLogOut,
  FiShoppingBag, FiUser, FiExternalLink,
} from 'react-icons/fi';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  ];

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <FiShoppingBag size={22} />
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-nav-link"
          >
            <FiExternalLink />
            <span>View Store</span>
          </a>
          <button className="admin-nav-link logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="admin-body">
        {/* Top bar */}
        <header className="admin-topbar">
          <p className="admin-topbar-title">Welcome back, {user?.name}</p>
          <div className="admin-topbar-user">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="topbar-avatar" />
              : <div className="topbar-avatar-placeholder"><FiUser size={14} /></div>
            }
            <span>{user?.email}</span>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
