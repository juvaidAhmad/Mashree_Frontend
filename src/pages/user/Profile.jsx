import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="profile-wrapper">
        <div className="profile-card card">
          <div className="profile-banner">
            <div className="profile-avatar-wrap">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="profile-avatar" />
                : <div className="profile-avatar-placeholder"><FiUser size={36} /></div>
              }
            </div>
          </div>
          <div className="profile-body">
            <h1 className="profile-name">{user.name}</h1>
            <div className="profile-meta">
              <span><FiMail size={14} /> {user.email}</span>
              <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                <FiShield size={11} /> {user.role}
              </span>
            </div>
            <p className="profile-joined">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
