import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner, { BtnSpinner } from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiArrowLeft, FiCheck } from 'react-icons/fi';
import './ProductForm.css';

const CATEGORIES = ['Electronics','Clothing','Furniture','Vehicles','Books','Sports','Other'];
const EMPTY = { title: '', description: '', price: '', category: '', location: '' };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`)
      .then((res) => {
        const p = res.data.data?.product;
        setForm({ title: p.title, description: p.description, price: p.price, category: p.category, location: p.location || '' });
        setExistingImages(p.images || []);
      })
      .catch(() => { toast.error('Failed to load product'); navigate('/admin/products'); })
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (i) => {
    setImages((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append('images', img));
      if (isEdit) {
        await api.put(`/products/${id}`, fd);
        toast.success('Product updated');
      } else {
        await api.post('/products', fd);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  const displayImages = previews.length > 0 ? previews : existingImages;

  return (
    <>
      <div className="form-page-header">
        <Link to="/admin/products" className="btn btn-ghost btn-sm">
          <FiArrowLeft size={15} /> Back
        </Link>
        <h1 className="admin-page-title" style={{ margin: 0 }}>
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      <div className="product-form-card">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3 className="form-section-title">Basic Info</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input type="text" required value={form.title} disabled={loading}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. iPhone 14 Pro" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select required value={form.category} disabled={loading}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (USD) *</label>
                <input type="number" required min="0" step="0.01" value={form.price} disabled={loading}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={form.location} disabled={loading}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. New York, USA" />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea required value={form.description} disabled={loading}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the product in detail..." rows={5} />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              Images <span className="form-section-hint">up to 5</span>
            </h3>
            <label className="upload-area">
              <FiUpload size={26} />
              <span>Click to upload images</span>
              <small>PNG, JPG, WEBP accepted</small>
              <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            </label>
            {displayImages.length > 0 && (
              <div className="image-previews">
                {displayImages.map((src, i) => (
                  <div key={i} className="preview-wrap">
                    <img src={src} alt="" className="preview-img" />
                    {previews.length > 0 && (
                      <button type="button" className="preview-remove" onClick={() => removePreview(i)}>
                        <FiX size={11} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><BtnSpinner /> {isEdit ? 'Updating...' : 'Creating...'}</>
                : <><FiCheck size={15} /> {isEdit ? 'Update Product' : 'Create Product'}</>
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
