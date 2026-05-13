import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserNavbar from '../components/UserNavbar';
import Spinner from '../components/Spinner';

export default function UserLayout() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  // Admins have no business on the user-facing side
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
}
