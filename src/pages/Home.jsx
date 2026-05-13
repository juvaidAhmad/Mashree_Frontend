import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
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

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch(''); setSearchInput(''); setCategory('');
    setMinPrice(''); setMaxPrice(''); setPage(1);
  };

  const hasFilters = search || category || minPrice || maxPrice;

  return (
    <div className="page">
      <div className="container">
        <div className="home-hero">
          <h1>Find What You Need</h1>
          <p>Browse thousands of listings from sellers near you</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text" placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="home-layout">
          <aside className="filters-panel card">
            <div className="filters-header">
              <h3>Filters</h3>
              {hasFilters && (
                <button className="btn-clear" onClick={clearFilters}>
                  <FiX size={14} /> Clear
                </button>
              )}
            </div>
            <div className="filter-section">
              <label>Category</label>
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-section">
              <label>Price Range</label>
              <div className="price-inputs">
                <input type="number" placeholder="Min" value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} min="0" />
                <span>–</span>
                <input type="number" placeholder="Max" value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} min="0" />
              </div>
            </div>
          </aside>

          <main className="products-main">
            <div className="results-info">
              {!loading && <span>{total} product{total !== 1 ? 's' : ''} found</span>}
            </div>

            {loading ? (
              <Spinner />
            ) : error ? (
              <div className="empty-state">
                <p style={{ color: 'var(--danger)' }}>{error}</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchProducts}>Retry</button>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <FiSearch size={48} />
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
                {hasFilters && <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={clearFilters}>Clear Filters</button>}
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
