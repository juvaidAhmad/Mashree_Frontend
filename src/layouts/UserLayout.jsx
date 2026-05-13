import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserNavbar from '../components/UserNavbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';

export default function UserLayout() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <>
      <UserNavbar />
      <Outlet />
      <Footer />
    </>
  );
}
