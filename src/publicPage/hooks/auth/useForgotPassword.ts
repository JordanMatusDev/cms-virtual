import { useState } from 'react';
import { requestPasswordReset } from '../../services/email/resetPasswService';

const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await requestPasswordReset(email);
    setLoading(false);
    if (success) {
      setShowResult(true);
    } else {
      setError('No se pudo enviar el email. Intenta de nuevo.');
    }
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
