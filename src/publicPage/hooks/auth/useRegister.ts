import { useState } from 'react';
import { registerService, sendVerificationEmail } from '../../services/auth/registerService';
import { checkEmailExists, checkUsernameExists } from '../../services/auth/checkExistsService';

interface UseRegisterReturn {
  step: number;
  setStep: (n: number) => void;
  formData: any;
  setFormData: (data: any) => void;
  showPass: boolean;
  setShowPass: (b: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (b: boolean) => void;
  isLoading: boolean;
  error: string | null;
  fieldErrors: any;
  handleNextStep: () => void;
  handleSubmit: (onRegisterSuccess?: (formData: any) => void) => Promise<void>;
}

export function useRegister(initialData?: any): UseRegisterReturn {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
    firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const handleNextStep = async () => {
    let errors: any = {};
    if (!formData.firstName.trim()) errors.firstName = 'El nombre es obligatorio.';
    if (!formData.lastName.trim()) errors.lastName = 'El apellido es obligatorio.';
    if (!formData.email.trim()) errors.email = 'El correo es obligatorio.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) errors.email = 'Ingresa un correo electrónico válido.';
    // Verificar si el correo ya existe antes de pasar al siguiente paso
    if (!errors.email) {
      const exists = await checkEmailExists(formData.email);
      if (exists) errors.email = 'El correo ya está registrado.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setFieldErrors({});
    setStep(2);
  };

  const handleSubmit = async (onRegisterSuccess?: (formData: any) => void) => {
    setIsLoading(true);
    setError(null);
    let errors: any = {};
    if (!formData.username.trim()) errors.username = 'El usuario es obligatorio.';
    if (!formData.password.trim()) errors.password = 'La contraseña es obligatoria.';
    if (!formData.confirmPassword.trim()) errors.confirmPassword = 'Confirma tu contraseña.';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden.';
    if (formData.password.length > 0 && formData.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    // Verificar si el usuario ya existe antes de crear la cuenta
    if (!errors.username) {
      const exists = await checkUsernameExists(formData.username);
      if (exists) errors.username = 'El usuario ya está registrado.';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) { setIsLoading(false); return; }
    try {
      const result = await registerService(formData);
      if (result.error) {
        if (result.status === 422 && result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else if (result.status === 409) {
          // Mostrar error debajo de usuario o correo según el mensaje
          let fieldErrors: any = { general: result.error };
          if (result.error.toLowerCase().includes('usuario')) fieldErrors.username = 'El usuario ya existe.';
          if (result.error.toLowerCase().includes('correo')) fieldErrors.email = 'El correo ya existe.';
          setFieldErrors(fieldErrors);
        } else {
          setFieldErrors({ general: result.error });
        }
        setIsLoading(false);
        return;
      }
      const newUserId = result.data.id || result.data.usuario?.id;
      if (newUserId) {
        await sendVerificationEmail(formData.email, formData.username);
      }
      if (onRegisterSuccess) onRegisterSuccess(formData);
    } catch (err: any) {
      setFieldErrors({ general: err.message || 'Error al registrar.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    setStep,
    formData,
    setFormData,
    showPass,
    setShowPass,
    showConfirm,
    setShowConfirm,
    isLoading,
    error,
    fieldErrors,
    handleNextStep,
    handleSubmit,
  };
}
