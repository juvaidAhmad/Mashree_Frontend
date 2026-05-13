import { Link } from 'react-router-dom';
import {
  FiShoppingBag, FiGithub, FiTwitter, FiInstagram,
  FiMail, FiMapPin, FiPhone, FiArrowRight,
} from 'react-icons/fi';
import './Footer.css';

const CATEGORIES = [
  { label: 'Electronics', emoji: '💻' },
  { label: 'Clothing',    emoji: '👗' },
  { label: 'Furniture',   emoji: '🛋️' },
  { label: 'Vehicles',    emoji: '🚗' },
  { label: 'Books',       emoji: '📚' },
  { label: 'Sports',      emoji: '⚽' },
  { label: 'Other',       emoji: '📦' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />

      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <FiShoppingBag size={20} />
              <span>Marketplace</span>
            </Link>
            <p className="footer-tagline">
              The modern marketplace for buying and selling anything — fast, safe, and beautifully simple.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter" className="social-btn"><FiTwitter size={16} /></a>
              <a href="#" aria-label="Instagram" className="social-btn"><FiInstagram size={16} /></a>
              <a href="#" aria-label="GitHub" className="social-btn"><FiGithub size={16} /></a>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              {CATEGORIES.map(({ label, emoji }) => (
                <li key={label}>
                  <Link to={`/?category=${label}`} className="footer-link">
                    <span>{emoji}</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link"><FiArrowRight size={12} /> Browse All</Link></li>
              <li><Link to="/register" className="footer-link"><FiArrowRight size={12} /> Create Account</Link></li>
              <li><Link to="/login" className="footer-link"><FiArrowRight size={12} /> Sign In</Link></li>
              <li><Link to="/profile" className="footer-link"><FiArrowRight size={12} /> My Profile</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:support@marketplace.com" className="footer-link">
                  <FiMail size={13} /> support@marketplace.com
                </a>
              </li>
              <li>
                <span className="footer-link no-hover">
                  <FiPhone size={13} /> +1 (555) 000-0000
                </span>
              </li>
              <li>
                <span className="footer-link no-hover">
                  <FiMapPin size={13} /> San Francisco, CA
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Terms of Service</a>
            <a href="#" className="footer-bottom-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
