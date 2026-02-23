import { useState } from 'react';
import { loginService } from '../../services/auth/loginService';
import { checkUserStatus } from '../../services/auth/checkUserStatus';

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
  handleLogin: (onSuccess: (user: any) => void) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const minLoadingMs = 3000;

  const handleLogin = async (onSuccess: (user: any) => void) => {
    const startTime = Date.now();
    setIsSubmitting(true);
    setFieldErrors({});
    let successPayload: { name: string; email: string; avatar: string; role: string } | null = null;

    if (!identifier.trim() || !password.trim()) {
      setFieldErrors({
        identifier: !identifier.trim() ? 'Este campo es obligatorio' : undefined,
        password: !password.trim() ? 'Este campo es obligatorio' : undefined,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await loginService(identifier, password);
      if (result.error) {
        // Si es usuario deshabilitado, consultar status y verification
        if (
          result.status === 401 &&
          typeof result.error === 'string' &&
          result.error.toLowerCase().includes('usuario deshabilitado')
        ) {
          const user = await checkUserStatus(identifier);
          // if (user) {
          if (user) {
            if (user.status === false && user.verification === false) {
              setFieldErrors({ general: 'Revisa tu correo para activar tu cuenta' });
              setIsSubmitting(false);
              return;
            } else if (user.status === false && user.verification === true) {
              setFieldErrors({ general: 'Cuenta suspendida, contacta a soporte' });
              setIsSubmitting(false);
              return;
            }
          }
          setFieldErrors({ general: result.error });
        } else if (result.status === 401) {
          setFieldErrors({ password: 'Usuario o contraseña incorrectos.', identifier: undefined });
        } else if (result.status === 403) {
          console.log('Status 403 detectado, consultando estado usuario...');
          const user = await checkUserStatus(identifier);
          console.log('Resultado checkUserStatus:', user);
          if (user) {
            // Log detallado para depuración
            console.log('Depuración login: status =', user.status, ', verification =', user.verification);
            if (user.status === false && user.verification === false) {
              setFieldErrors({ general: 'Revisa tu correo para activar tu cuenta' });
              setIsSubmitting(false);
              return;
            } else if (user.status === false && user.verification === true) {
              setFieldErrors({ general: 'Cuenta suspendida, contacta a soporte' });
              setIsSubmitting(false);
              return;
            }
          }
          setFieldErrors({ general: result.error });
        } else {
          setFieldErrors({ general: result.error });
        }
        throw new Error(result.error);
      }
      const data = result.data;
      if (!data.access_token) {
        setFieldErrors({ general: 'Token no recibido' });
        throw new Error('Token no recibido');
      }
      // ...existing code...
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('token', data.access_token); 
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', data.username || '');
      localStorage.setItem('userNombre', data.name || data.username || '');
      localStorage.setItem('userApellido', data.surnames || '');
      localStorage.setItem('userEmail', data.email || '');
      localStorage.setItem('userRole', data.rol || 'user');
      if (data.img) localStorage.setItem('userAvatar', data.img);
      // Decodificar el JWT y guardar el sub como userId
      if (data.access_token) {
        try {
          const payload = JSON.parse(atob(data.access_token.split('.')[1]));
          if (payload && payload.sub) {
            localStorage.setItem('userId', String(payload.sub));
          }
        } catch (e) {
          console.warn('No se pudo decodificar el JWT para obtener userId');
        }
      }
      // Preparamos el objeto para la animación de éxito
      successPayload = {
        name: `${data.name || ''} ${data.surnames || ''}`.trim() || data.username || '',
        email: data.email || '',
        avatar: data.img || '',
        role: data.rol || 'user',
      };
    } catch (err: any) {
      let msgServidor = (err.message || '').toLowerCase();
      let mensajeFinal = 'Usuario o contraseña incorrectos.';
      if (msgServidor.includes('usuario deshabilitado')) {
        // Traduce el mensaje por experiencia de usuario
        mensajeFinal = 'Revisa tu correo para activazzr tu cuenta';
        setFieldErrors({ general: mensajeFinal });
      } else if (msgServidor.includes('incorrect') || msgServidor.includes('inválid') || msgServidor.includes('credentials')) {
        mensajeFinal = 'Usuario o contraseña incorrectos.';
        setFieldErrors({ password: mensajeFinal, identifier: undefined });
      } else if (msgServidor.length > 5 && msgServidor.length < 100) {
        mensajeFinal = err.message;
        setFieldErrors({ general: mensajeFinal });
      } else {
        setFieldErrors({ general: mensajeFinal });
      }
    } finally {
      if (successPayload) {
        setIsSuccessAnimating(true);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadingMs - elapsed);
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        onSuccess(successPayload);
        setIsSuccessAnimating(false);
      }
      setIsSubmitting(false);
    }
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    showPass,
    setShowPass,
    isSubmitting,
    isSuccessAnimating,
    fieldErrors,
    handleLogin,
  };
}
