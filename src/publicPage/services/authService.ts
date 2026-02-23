


const API_BASE_URL = 'https://api.virtual-edu.lat';

/**
 * Obtiene un usuario por su ID
 */
export async function getUserById(userId: number) {
  const resp = await fetch(`${API_BASE_URL}/usuarios/${userId}`);
  if (!resp.ok) throw new Error('No se pudo obtener el usuario');
  return await resp.json();
}

/**
 * Actualiza los datos de un usuario (incluyendo password)
 */
export async function updateUser(userId: number, userData: any) {
  const resp = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.detail || 'No se pudo actualizar el usuario');
  }
  return await resp.json();
}

/**
 * Restablece la contraseña de un usuario usando su ID
 * 1. Obtiene el usuario
 * 2. Actualiza solo el campo password
 */
export async function confirmPasswordReset(userId: number, newPassword: string): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getUserById(userId);
    const updatedUser = { ...user, password: newPassword };
    await updateUser(userId, updatedUser);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'No se pudo restablecer la contraseña.' };
  }
}
