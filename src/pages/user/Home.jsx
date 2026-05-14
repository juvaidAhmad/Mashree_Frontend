import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import { SkeletonGrid } from '../../components/SkeletonCard';
import { FiSearch, FiX, FiShield, FiZap, FiStar } from 'react-icons/fi';
import './Home.css';

const CATEGORIES = [
  { label: 'Electronics', emoji: '💻', color: '#6366f1' },
  { label: 'Clothing',    emoji: '👗', color: '#ec4899' },
  { label: 'Furniture',   emoji: '🛋️', color: '#f59e0b' },
  { label: 'Vehicles',    emoji: '🚗', color: '#06b6d4' },
  { label: 'Books',       emoji: '📚', color: '#10b981' },
  { label: 'Sports',      emoji: '⚽', color: '#8b5cf6' },
  { label: 'Other',       emoji: '📦', color: '#64748b' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const priceTimer = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;
      const { data } = await api.get('/products', { params });
      setProducts(data.data?.products ?? []);
      setTotal(data.meta?.total ?? 0);
      setPages(data.meta?.pages ?? 1);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const clearSearch = () => { setSearchInput(''); setSearch(''); setPage(1); };

  const handlePriceChange = (type, value) => {
    if (type === 'min') setMinInput(value); else setMaxInput(value);
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      if (type === 'min') setMinPrice(value); else setMaxPrice(value);
      setPage(1);
    }, 600);
  };

  const handleCategory = (e) => { setCategory(e.target.value); setPage(1); };

  const handleCatCard = (label) => {
    setCategory((prev) => prev === label ? '' : label);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch(''); setSearchInput(''); setCategory('');
    setMinPrice(''); setMaxPrice(''); setMinInput(''); setMaxInput(''); setPage(1);
  };

  const hasFilters = search || category || minPrice || maxPrice;

  return (
    <div className="page">
      <div className="home-orbs">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>

      <div className="container">

        {/* ── Hero ── */}
        <div className="home-hero">
          <div className="hero-pill"><span className="hero-pill-dot" /> Live Marketplace</div>
          <h1>Discover & Buy<br /><span className="grad">Anything You Want</span></h1>
          <p>Search thousands of listings by name, location, or description</p>
          <div className="search-wrap">
            <form className="search-bar" onSubmit={handleSearch}>
              <FiSearch className="search-icon" size={18} />
              <input
                type="text" placeholder="Search products, locations..."
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button type="button" className="search-clear-btn" onClick={clearSearch}>
                  <FiX size={16} />
                </button>
              )}
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>

        {/* ── Shop by Category ── */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-sub">Browse listings by what you're looking for</p>
            </div>
            {category && (
              <button className="btn-clear" onClick={() => { setCategory(''); setPage(1); }}>
                <FiX size={13} /> Clear
              </button>
            )}
          </div>
          <div className="categories-grid stagger">
            {CATEGORIES.map(({ label, emoji, color }) => (
              <button
                key={label}
                className={`cat-card${category === label ? ' active' : ''}`}
                style={{ '--cat-color': color }}
                onClick={() => handleCatCard(label)}
              >
                <span className="cat-emoji">{emoji}</span>
                <span className="cat-label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Why us ── */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Why Choose Us</h2>
              <p className="section-sub">Simple, fast, and trusted by thousands</p>
            </div>
          </div>
          <div className="how-grid stagger">
            <div className="how-card">
              <div className="how-icon" style={{ background: 'rgba(99,102,241,.15)', color: '#a78bfa' }}>
                <FiSearch size={20} />
              </div>
              <h3>Browse & Discover</h3>
              <p>Search thousands of listings across every category with powerful filters.</p>
            </div>
            <div className="how-card">
              <div className="how-icon" style={{ background: 'rgba(6,182,212,.12)', color: '#67e8f9' }}>
                <FiZap size={20} />
              </div>
              <h3>Fast & Easy</h3>
              <p>Find what you need in seconds. No complicated steps, just results.</p>
            </div>
            <div className="how-card">
              <div className="how-icon" style={{ background: 'rgba(16,185,129,.12)', color: '#34d399' }}>
                <FiShield size={20} />
              </div>
              <h3>Safe & Secure</h3>
              <p>Every listing is reviewed. Shop with confidence on our trusted platform.</p>
            </div>
            <div className="how-card">
              <div className="how-icon" style={{ background: 'rgba(245,158,11,.12)', color: '#fbbf24' }}>
                <FiStar size={20} />
              </div>
              <h3>Quality Listings</h3>
              <p>Curated products from verified sellers with detailed descriptions.</p>
            </div>
          </div>
        </section>

        {/* ── Products carousel ── */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {category ? `${category} Listings` : 'Latest Listings'}
              </h2>
              {!loading && (
                <p className="section-sub">
                  {total} product{total !== 1 ? 's' : ''} found
                  {search && <> for "<strong style={{ color: 'var(--text)' }}>{search}</strong>"</>}
                </p>
              )}
            </div>
            <div className="section-header-right">
              {hasFilters && (
                <button className="btn-clear" onClick={clearFilters}>
                  <FiX size={13} /> Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Inline price filter */}
          <div className="price-bar">
            <span className="price-bar-label">Price range:</span>
            <div className="price-inputs">
              <input type="number" placeholder="Min $" value={minInput}
                onChange={(e) => handlePriceChange('min', e.target.value)} min="0" />
              <span>–</span>
              <input type="number" placeholder="Max $" value={maxInput}
                onChange={(e) => handlePriceChange('max', e.target.value)} min="0" />
            </div>
            {(minPrice || maxPrice) && (
              <button className="btn-clear" onClick={() => {
                setMinPrice(''); setMaxPrice(''); setMinInput(''); setMaxInput(''); setPage(1);
              }}>
                <FiX size={12} /> Clear
              </button>
            )}
          </div>

          {loading ? <SkeletonGrid count={12} /> : error ? (
            <div className="empty-state">
              <p style={{ color: 'var(--danger)' }}>{error}</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchProducts}>Retry</button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <FiSearch size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-3)' }} />
              <h3>No products found</h3>
              <p>Try a different search or adjust filters</p>
              {hasFilters && (
                <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="marquee-wrap">
              <div className="marquee-track">
                {/* duplicate for seamless loop */}
                {[...products, ...products].map((p, i) => (
                  <div key={`${p._id}-${i}`} className="marquee-card">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
