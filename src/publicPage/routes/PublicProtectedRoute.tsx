import { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router';

export default function PublicProtectedRoute() {
  const location = useLocation();
  // Leemos el estado de sesión del alumno desde el localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    // Escuchamos eventos globales por si el alumno inicia sesión o cierra sesión en otra pestaña
    window.addEventListener('auth:login', syncAuthState as EventListener);
    window.addEventListener('auth:logout', syncAuthState as EventListener);
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener('auth:login', syncAuthState as EventListener);
      window.removeEventListener('auth:logout', syncAuthState as EventListener);
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  // Si no está logueado como alumno, lo mandamos al inicio (la vista pública)
  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  // Si está logueado, Outlet renderiza la ruta hija (MyCourses, Settings, etc.)
  return <Outlet />;
}