import { useState } from 'react';
import { loginService } from '../../services/auth/loginService';

interface UseLoginReturn {
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPass: boolean;
  setShowPass: (val: boolean) => void;
  isSubmitting: boolean;
  isSuccessAnimating: boolean;
  fieldErrors: { identifier?: string; password?: string; general?: string };
  setFieldErrors: React.Dispatch<React.SetStateAction<{ identifier?: string; password?: string; general?: string }>>;
  handleLogin: (onSuccess: (user: any) => void) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const minLoadingMs = 2500; // Reduje un poco el tiempo para que se sienta más ágil

  const handleLogin = async (onSuccess: (user: any) => void) => {
    const startTime = Date.now();
    setIsSubmitting(true);
    setFieldErrors({});
    let successPayload: any = null;

    if (!identifier.trim() || !password.trim()) {
      setFieldErrors({
        identifier: !identifier.trim() ? 'Este campo es obligatorio' : undefined,
        password: !password.trim() ? 'Este campo es obligatorio' : undefined,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result: any = await loginService(identifier, password);

      // --- MANEJO DE ERRORES CON LOS NUEVOS CÓDIGOS ---
      if (result.error) {
        switch (result.code) {
          case 2: // Usuario no existe o contraseña incorrecta
            setFieldErrors({ password: 'Usuario o contraseña incorrectos.', identifier: undefined });
            break;
          case 3: // Cuenta deshabilitada (bloqueada)
            setFieldErrors({ general: 'Cuenta suspendida, contacta a soporte.' });
            break;
          case 4: // Email no verificado
            setFieldErrors({ general: 'Revisa tu correo para activar tu cuenta.' });
            break;
          default: // Cualquier otro error (ej. 500, 422)
            setFieldErrors({ general: result.error || 'Error al iniciar sesión.' });
        }
        setIsSubmitting(false);
        return;
      }

      // --- LOGIN EXITOSO ---
      const data = result.data;
      if (!data.access_token) throw new Error('Token no recibido');

      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('token', data.access_token); 
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.username || '');
      localStorage.setItem('userNombre', data.name || data.username || '');
      localStorage.setItem('userApellido', data.surnames || '');
      localStorage.setItem('userEmail', data.email || '');
      localStorage.setItem('userRole', data.rol || 'user');
      if (data.img) localStorage.setItem('userAvatar', data.img);

      if (data.access_token) {
        try {
          const payload = JSON.parse(atob(data.access_token.split('.')[1]));
          if (payload && payload.sub) localStorage.setItem('userId', String(payload.sub));
        } catch (e) {
          console.warn('No se pudo decodificar el JWT');
        }
      }

      successPayload = {
        name: `${data.name || ''} ${data.surnames || ''}`.trim() || data.username || '',
        email: data.email || '',
        avatar: data.img || '',
        role: data.rol || 'user',
      };

    } catch (err: any) {
      setFieldErrors({ general: 'Error de conexión con el servidor.' });
    } finally {
      if (successPayload) {
        setIsSuccessAnimating(true);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadingMs - elapsed);
        if (remaining > 0) await new Promise(r => setTimeout(r, remaining));
        onSuccess(successPayload);
        setIsSuccessAnimating(false);
      }
      setIsSubmitting(false);
    }
  };

  return {
    identifier, setIdentifier, password, setPassword,
    showPass, setShowPass, isSubmitting, isSuccessAnimating,
    fieldErrors, setFieldErrors, handleLogin,
  };
}