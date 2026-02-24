import { useState } from 'react';
import { requestPasswordReset } from '../../services/email/resetPasswService';
import { checkEmailExists } from '../../services/email/checkEmailService';

const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Verificar si el correo existe
    const exists = await checkEmailExists(email);
    if (!exists) {
      setLoading(false);
      setError('El correo no está registrado.');
      return false;
    }
    // Si existe, enviar solicitud
    const success = await requestPasswordReset(email);
    setLoading(false);
    if (success) {
      setShowResult(true);
    } else {
      setError('No se pudo enviar el email. Intenta de nuevo.');
    }
    return success;
  };

  return {
    email,
    setEmail,
    showResult,
    setShowResult,
    handleSubmit,
    error,
    loading,
  };
};

export default useForgotPassword;
