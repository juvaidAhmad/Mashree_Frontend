import { NavLink } from 'react-router-dom';
import { FiGrid, FiPackage, FiUsers } from 'react-icons/fi';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
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
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
