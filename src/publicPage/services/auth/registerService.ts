import api from '../apiService';

export async function registerService(formData: any) {
  try {
    const payload: any = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      name: formData.firstName || '',
      surnames: formData.lastName || '',
      rol: 'estudiante',
      status: false,
      verification: false,
      img: formData.img || '',
    };
    // Token de servicio desde variable de entorno
    const serviceToken = import.meta.env.VITE_SERVICE_TOKEN;
    const response = await api.post('/api/v1/users/', payload, {
      headers: {
        'X-API-Key': serviceToken,
      },
    });
    return { data: response.data };
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 409) {
        return { error: 'El usuario o correo ya existe.', status: 409 };
      }
      // Si el backend responde con errores de validación (422)
      if (error.response.status === 422 && Array.isArray(error.response.data?.detail)) {
        // Convertir los errores de validación a un objeto campo: mensaje (solo el mensaje relevante)
        const fieldErrors: any = {};
        error.response.data.detail.forEach((err: any) => {
          const field = err.loc?.[err.loc.length - 1];
          // Eliminar 'Value error, ' del mensaje si existe
          let msg = err.msg.replace(/^Value error,\s*/i, '');
          // Forzar mensaje personalizado para longitud mínima
          if (msg.toLowerCase().includes('longitud mínima') || msg.toLowerCase().includes('mínimo') || msg.toLowerCase().includes('at least')) {
            msg = 'La contraseña debe tener al menos 8 caracteres.';
          }
          fieldErrors[field] = msg;
        });
        return { error: 'Errores de validación.', status: 422, fieldErrors };
      }
      return { error: error.response.data?.detail || 'Error al registrar.', status: error.response.status };
    }
    return { error: error.message || 'Error de red', status: 500 };
  }
}

export async function sendVerificationEmail(email: string) {
  try {
    await api.post('/api/v1/auth/request-verify-email', { email });
    return true;
  } catch (err) {
    return false;
  }
}
