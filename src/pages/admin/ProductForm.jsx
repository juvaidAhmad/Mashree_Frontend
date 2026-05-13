import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';
import './ProductForm.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Furniture', 'Vehicles', 'Books', 'Sports', 'Other'];
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
        const { title, description, price, category, location, images: imgs } = res.data.data?.product;
        setForm({ title, description, price, category, location: location || '' });
        setExistingImages(imgs || []);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
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
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  return (
    <>
      <h1 className="admin-page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <div className="product-form-card card">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product title" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select required value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input type="number" required min="0" step="0.01" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the product..." rows={4} />
          </div>
          <div className="form-group">
            <label>Images (up to 5)</label>
            <label className="upload-area">
              <FiUpload size={24} />
              <span>Click to upload images</span>
              <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            </label>
            {(previews.length > 0 || existingImages.length > 0) && (
              <div className="image-previews">
                {(previews.length > 0 ? previews : existingImages).map((src, i) => (
                  <img key={i} src={src} alt="" className="preview-img" />
                ))}
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
