import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import './UserNavbar.css';

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="user-navbar">
      <div className="container user-navbar-inner">
        <Link to="/" className="user-navbar-brand">
          <FiShoppingBag />
          <span>Marketplace</span>
        </Link>

        <div className="user-navbar-links">
          <Link to="/" className="nav-link">
            <FiHome size={15} /> Browse
          </Link>
        </div>

        <div className="user-navbar-actions">
          {user ? (
            <>
              <Link to="/profile" className="user-chip">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="user-chip-avatar" />
                  : <div className="user-chip-placeholder"><FiUser size={13} /></div>
                }
                <span className="user-chip-name">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <FiLogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
