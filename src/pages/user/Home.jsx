import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';
import { FiSearch, FiX } from 'react-icons/fi';
import './Home.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Furniture', 'Vehicles', 'Books', 'Sports', 'Other'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // committed filter values (what actually gets sent to API)
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // local input values (what user is typing)
  const [searchInput, setSearchInput] = useState('');
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  // debounce timer ref for price inputs
  const priceTimer = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
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

  // ── Search submit ──────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  // ── Price — debounce 600ms so it waits until user stops typing ─────────────
  const handlePriceChange = (type, value) => {
    if (type === 'min') setMinInput(value);
    else setMaxInput(value);

    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      if (type === 'min') setMinPrice(value);
      else setMaxPrice(value);
      setPage(1);
    }, 600);
  };

  // ── Category — instant ─────────────────────────────────────────────────────
  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  // ── Clear all ──────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSearch(''); setSearchInput('');
    setCategory('');
    setMinPrice(''); setMaxPrice('');
    setMinInput(''); setMaxInput('');
    setPage(1);
  };

  const hasFilters = search || category || minPrice || maxPrice;

  return (
    <div className="page">
      <div className="container">
        <div className="home-hero">
          <h1>Find What You Need</h1>
          <p>Search by product name, location, or description</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button type="button" className="search-clear-btn" onClick={clearSearch}>
                <FiX size={16} />
              </button>
            )}
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="home-layout">
          <aside className="filters-panel card">
            <div className="filters-header">
              <h3>Filters</h3>
              {hasFilters && (
                <button className="btn-clear" onClick={clearFilters}>
                  <FiX size={14} /> Clear all
                </button>
              )}
            </div>

            <div className="filter-section">
              <label>Category</label>
              <select value={category} onChange={handleCategory}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-section">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min $"
                  value={minInput}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min="0"
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxInput}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min="0"
                />
              </div>
              {(minPrice || maxPrice) && (
                <button
                  className="btn-clear"
                  style={{ marginTop: '.5rem', fontSize: '.75rem' }}
                  onClick={() => {
                    setMinPrice(''); setMaxPrice('');
                    setMinInput(''); setMaxInput('');
                    setPage(1);
                  }}
                >
                  <FiX size={12} /> Clear price
                </button>
              )}
            </div>
          </aside>

          <main className="products-main">
            <div className="results-info">
              {!loading && (
                <span>
                  {total} product{total !== 1 ? 's' : ''} found
                  {search && <> for "<strong>{search}</strong>"</>}
                </span>
              )}
            </div>

            {loading ? (
              <Spinner />
            ) : error ? (
              <div className="empty-state">
                <p style={{ color: 'var(--danger)' }}>{error}</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchProducts}>
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <FiSearch size={48} />
                <h3>No products found</h3>
                <p>Try a different search term or adjust your filters</p>
                {hasFilters && (
                  <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid-products">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                <Pagination page={page} pages={pages} onPageChange={setPage} />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
