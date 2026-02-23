import api from '../apiService';

export async function requestPasswordReset(email: string): Promise<boolean> {
	try {
		const { data } = await api.post('/api/v1/auth/request-password-reset', { email });
		console.log('[requestPasswordReset] Respuesta backend:', data);
		return true;
	} catch (err) {
		console.error('[requestPasswordReset] Error:', err);
		return false;
	}
}

