import { NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { FiGrid, FiPackage, FiUsers, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar card">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}>
            <FiPackage /> Products
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}>
            <FiUsers /> Users
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-theme-btn" onClick={toggle} title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
