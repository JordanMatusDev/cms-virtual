// src/hooks/header/useAuthSession.ts
// Maneja la sesión de usuario y sincronización con localStorage/eventos
import { useState, useEffect } from 'react';

export interface UserSession {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export function useAuthSession() {
  const [user, setUser] = useState<UserSession | null>(null);

  const getUserFromStorage = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return null;
    const nombre = localStorage.getItem('userNombre') || '';
    const apellido = localStorage.getItem('userApellido') || '';
    const username = localStorage.getItem('username') || '';
    const email = localStorage.getItem('userEmail') || '';
    const avatar = localStorage.getItem('userAvatar') || undefined;
    const role = localStorage.getItem('userRole') || '';
    const primerNombre = nombre.split(' ')[0] || '';
    const primerApellido = apellido.split(' ')[0] || '';
    const name = `${primerNombre} ${primerApellido}`.trim() || username;
    if (email || username) return { name, email, avatar, role };
    return null;
  };

  useEffect(() => {
    setUser(getUserFromStorage());
    const handleAuthChange = () => setUser(getUserFromStorage());
    window.addEventListener('auth:login', handleAuthChange as EventListener);
    window.addEventListener('auth:logout', handleAuthChange as EventListener);
    window.addEventListener('user:updated', handleAuthChange as EventListener);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth:login', handleAuthChange as EventListener);
      window.removeEventListener('auth:logout', handleAuthChange as EventListener);
      window.removeEventListener('user:updated', handleAuthChange as EventListener);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return { user, setUser };
}
