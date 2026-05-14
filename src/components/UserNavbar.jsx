import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingBag, FiUser, FiLogOut, FiHome, FiSun, FiMoon } from 'react-icons/fi';
import './UserNavbar.css';

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`user-navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container user-navbar-inner">
        <Link to="/" className="user-navbar-brand">
          <FiShoppingBag />
          <span>Marketplace</span>
        </Link>

        <div className="user-navbar-links">
          <Link to="/" className="nav-link">
            <FiHome size={15} /> Home
          </Link>
        </div>

        <div className="user-navbar-actions">
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
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
