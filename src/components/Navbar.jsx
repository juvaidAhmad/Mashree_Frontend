import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <FiShoppingBag />
          <span>Marketplace</span>
        </Link>
        <div className="navbar-actions">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline btn-sm">
                  <FiSettings size={15} /> Admin
                </Link>
              )}
              <div className="navbar-user">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="avatar-sm" />
                  : <div className="avatar-placeholder"><FiUser /></div>
                }
                <span className="navbar-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <FiLogOut size={15} /> Logout
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
