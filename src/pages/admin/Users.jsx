import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './AdminTable.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data.data?.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("Can't delete yourself");
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <h1 className="admin-page-title">Users</h1>
      {loading ? <Spinner /> : (
        <div className="admin-table-wrap card">
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
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-info">
                      {u.avatar
                        ? <img src={u.avatar} alt={u.name} className="user-avatar" />
                        : <div className="user-avatar-placeholder">{u.name[0].toUpperCase()}</div>
                      }
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser._id}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
