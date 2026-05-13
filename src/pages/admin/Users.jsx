import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { BtnSpinner } from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FiTrash2, FiMail, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminTable.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data.data?.users ?? []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("Can't delete yourself");
    if (!confirm('Delete this user? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
        <div className="table-search">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="table-search-input"
          />
        </div>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="empty-state">
          <FiUsers size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-3)' }} />
          <h3>{search ? 'No users match your search' : 'No users yet'}</h3>
          <p>Registered users will appear here</p>
        </div>
      ) : (
        <>
          <p className="table-count">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-info">
                        {u.avatar
                          ? <img src={u.avatar} alt={u.name} className="user-avatar" />
                          : <div className="user-avatar-placeholder">{u.name[0].toUpperCase()}</div>
                        }
                        <div>
                          <p className="user-name">{u.name}</p>
                          <p className="user-email-mobile">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td-email">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="td-date">{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <div className="table-actions">
                        <a href={`mailto:${u.email}`} className="btn btn-outline btn-sm" title="Send email">
                          <FiMail size={14} />
                        </a>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u._id)}
                          disabled={u._id === currentUser._id || deletingId === u._id}
                          title="Delete user"
                        >
                          {deletingId === u._id ? <BtnSpinner /> : <FiTrash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
