
import { useState, useRef, useEffect } from 'react';
import { getCroppedImg } from './cropImage';
import { updateUserProfile, updateUserPassword, verifyUserCredentials, deleteUserAccount, uploadUserAvatar } from '../../services/pages/settingsService';

const useSettings = () => {
	const [passwordValidationError, setPasswordValidationError] = useState<string | null>(null);
	// Estado para el modal de confirmación de eliminar avatar
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
		// Para saber qué campo fue editado por última vez
		const lastEditedFieldRef = useRef<string | null>(null);
	// Referencias
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const croppedAreaRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

	// Estados
	const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'danger'>('profile');
	const [loading, setLoading] = useState<boolean>(false);
	const [resultModal, setResultModal] = useState<null | { type: 'success' | 'error'; title: string; detail?: string }>(null);
	const [user, setUser] = useState<{ nombre: string; apellido: string; username: string; email: string; avatarUrl: string }>({ nombre: '', apellido: '', username: '', email: '', avatarUrl: '' });
	const [initialUser, setInitialUser] = useState<{ nombre: string; apellido: string; username: string; email: string; avatarUrl: string } | null>(null);
	const [profileError, setProfileError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<{ nombre: boolean; apellido: boolean; username: boolean; email: boolean; currentPassword: boolean }>({ nombre: false, apellido: false, username: false, email: false, currentPassword: false });
	const [fieldErrorMessages, setFieldErrorMessages] = useState<{ nombre: string; apellido: string; username: string; email: string; currentPassword: string }>({ nombre: '', apellido: '', username: '', email: '', currentPassword: '' });
	const [passwords, setPasswords] = useState<{ current: string; new: string; confirm: string }>({ current: '', new: '', confirm: '' });
	const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
	const [showNewPass, setShowNewPass] = useState<boolean>(false);
	const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
	const [passVerified, setPassVerified] = useState<boolean>(false);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [showAvatarOptions, setShowAvatarOptions] = useState<boolean>(false);
	const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
	const [showCropModal, setShowCropModal] = useState<boolean>(false);
	const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState<number>(1);
	const [cropSaving, setCropSaving] = useState<boolean>(false);

	// Lógica de usuario inicial
	useEffect(() => {
		const storedUser = {
			nombre: localStorage.getItem('userNombre') || 'Usuario',
			apellido: localStorage.getItem('userApellido') || '',
			username: localStorage.getItem('username') || 'usuario',
			email: localStorage.getItem('userEmail') || 'usuario@ejemplo.com',
			avatarUrl: localStorage.getItem('userAvatar') || ''
		};
		storedUser.username = storedUser.username.startsWith('@') ? storedUser.username.slice(1) : storedUser.username;
		setUser(storedUser);
		setInitialUser(storedUser);
	}, []);

		const isProfileDirty = initialUser
				? user.nombre !== initialUser.nombre ||
					user.apellido !== initialUser.apellido ||
					user.username !== initialUser.username ||
					user.email !== initialUser.email ||
					user.avatarUrl !== initialUser.avatarUrl
				: false;

	// Handlers
	const handleTabChange = (tab: 'profile' | 'security' | 'danger') => {
		setActiveTab(tab);
		setPasswords({ current: '', new: '', confirm: '' });
		setShowCurrentPass(false);
		setShowNewPass(false);
		setShowConfirmPass(false);
		setPassVerified(false);
		setFieldErrors({ nombre: false, apellido: false, username: false, email: false, currentPassword: false });
		setFieldErrorMessages({ nombre: '', apellido: '', username: '', email: '', currentPassword: '' });
		setProfileError(null);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'username') {
			const trimmedValue = value.trim();
			const withoutPrefix = trimmedValue.startsWith('@') ? trimmedValue.slice(1) : trimmedValue;
			setUser(prev => ({ ...prev, username: withoutPrefix }));
			setFieldErrors(prev => ({ ...prev, username: false }));
			setFieldErrorMessages(prev => ({ ...prev, username: '' }));
			setProfileError(null);
			lastEditedFieldRef.current = 'username';
			return;
		}
		if (name === 'nombre' || name === 'apellido' || name === 'email') {
			setFieldErrors(prev => ({ ...prev, [name]: false }));
			setFieldErrorMessages(prev => ({ ...prev, [name]: '' }));
			if (name === 'email') lastEditedFieldRef.current = 'email';
		}
		setUser(prev => ({ ...prev, [name]: value }));
		setProfileError(null);
	};

	const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswords(prev => ({ ...prev, [name]: value }));
		if (name === 'current') {
			setFieldErrors(prev => ({ ...prev, currentPassword: false }));
			setFieldErrorMessages(prev => ({ ...prev, currentPassword: '' }));
		}
	};

	// Avatar
	const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const maxSizeMb = 2;
			if (file.size > maxSizeMb * 1024 * 1024) {
				showError('La imagen supera 2MB');
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				const result = typeof reader.result === 'string' ? reader.result : '';
				setCropImageSrc(result);
				setCrop({ x: 0, y: 0 });
				setZoom(1);
				setShowCropModal(true);
			};
			reader.readAsDataURL(file);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	// Paso 1: Solo abre el modal (se conecta al botón de la papelera)
	const handleRemoveAvatarClick = () => {
		setShowDeleteConfirm(true);
	};

	// Paso 2: Hace la eliminación REAL (se conecta al botón "Sí, eliminar" del modal)
	const confirmRemoveAvatar = async () => {
		setShowDeleteConfirm(false); // Cerramos el modal
		const userId = localStorage.getItem('userId');
		if (!userId) {
			showError('No se encontró el usuario');
			return;
		}
		try {
			await updateUserProfile(userId, { avatar: '' });
			setUser(prev => ({ ...prev, avatarUrl: '' }));
			setInitialUser(prev => prev ? { ...prev, avatarUrl: '' } : null);
			localStorage.removeItem('userAvatar');
			window.dispatchEvent(new Event('user:updated'));
			showSuccess('Foto de perfil eliminada');
		} catch (error: any) {
			showError('No se pudo eliminar la foto', error?.message || 'Error desconocido');
		}
	};

	// Cámara
	const handleOpenCamera = async () => {
		setShowAvatarOptions(false);
		setShowCameraModal(true);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (error) {
			showError('No se pudo acceder a la cámara');
			setShowCameraModal(false);
		}
	};

	const handleCloseCamera = () => {
		setShowCameraModal(false);
		if (videoRef.current && videoRef.current.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
			tracks.forEach(track => track.stop());
			videoRef.current.srcObject = null;
		}
	};

	const handleCapturePhoto = () => {
		if (!videoRef.current) return;
		const video = videoRef.current;
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		// Reflejar horizontalmente (espejo) y aplicar zoom visual
		ctx.save();
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		// Calcular el área a recortar según el zoom visual
		const zoomFactor = zoom || 1;
		const cropWidth = canvas.width / zoomFactor;
		const cropHeight = canvas.height / zoomFactor;
		const cropX = (canvas.width - cropWidth) / 2;
		const cropY = (canvas.height - cropHeight) / 2;
		ctx.drawImage(
			video,
			cropX, cropY, cropWidth, cropHeight, // src rect
			0, 0, canvas.width, canvas.height    // dest rect
		);
		ctx.restore();
		// Liberar la cámara inmediatamente después de capturar
		if (video.srcObject) {
			const tracks = (video.srcObject as MediaStream).getTracks();
			tracks.forEach(track => track.stop());
			video.srcObject = null;
		}
		const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
		setShowCameraModal(false);
		setCropImageSrc(dataUrl);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setShowCropModal(true);
	};

	// Crop
	const handleCropComplete = (_: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
		croppedAreaRef.current = croppedAreaPixels;
	};

	const handleConfirmCrop = async () => {
		if (!cropImageSrc || !croppedAreaRef.current) return;
		setCropSaving(true);
		const userId = localStorage.getItem('userId');
		if (!userId) {
			showError('No se encontró el usuario');
			setCropSaving(false);
			return;
		}
		try {
			// Recortar la imagen según el área seleccionada y convertir a Blob
			const croppedDataUrl = await getCroppedImg(
				cropImageSrc,
				croppedAreaRef.current,
				256 // tamaño de salida (puedes ajustar)
			);
			// Convertir base64 a Blob
			const blob = await (async () => {
				const res = await fetch(croppedDataUrl);
				return await res.blob();
			})();
			// Crear un archivo con nombre único
			const file = new File([blob], `avatar_${userId}_${Date.now()}.jpg`, { type: blob.type });
			// Subir a S3 usando el endpoint
			const userData = await uploadUserAvatar(userId, file);
			const imgUrl = userData.img || '';
			setUser(prev => ({ ...prev, avatarUrl: imgUrl }));
			setInitialUser(prev => prev ? { ...prev, avatarUrl: imgUrl } : null);
			localStorage.setItem('userAvatar', imgUrl);
			window.dispatchEvent(new Event('user:updated'));
			setShowCropModal(false);
			setCropImageSrc(null);
			showSuccess('Foto de perfil actualizada');
		} catch (error: any) {
			showError('No se pudo actualizar la foto', error?.message || 'Error desconocido');
		}
		setCropSaving(false);
	};

	const handleCancelCrop = () => {
		setShowCropModal(false);
		setCropImageSrc(null);
	};

	// Perfil
	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setProfileError(null);
		setFieldErrorMessages({ nombre: '', apellido: '', username: '', email: '', currentPassword: '' });
		const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
		const emailEmpty = !user.email.trim();
		const emailInvalid = !emailEmpty && !emailRegex.test(user.email);
		const nextErrors = {
			nombre: !user.nombre.trim(),
			apellido: !user.apellido.trim(),
			username: !user.username.trim(),
			email: emailEmpty || emailInvalid,
			currentPassword: false,
		};
		if (nextErrors.nombre || nextErrors.apellido || nextErrors.username || nextErrors.email) {
			setFieldErrors(nextErrors);
			setFieldErrorMessages({
				nombre: nextErrors.nombre ? 'Este campo es obligatorio' : '',
				apellido: nextErrors.apellido ? 'Este campo es obligatorio' : '',
				username: nextErrors.username ? 'Este campo es obligatorio' : '',
				email: emailEmpty
					? 'Este campo es obligatorio'
					: emailInvalid
						? 'Correo electrónico no válido'
						: '',
				currentPassword: '',
			});
			return;
		}
		setLoading(true);
		setResultModal(null);
		const userId = localStorage.getItem('userId');
		const normalizedUsername = user.username?.startsWith('@') ? user.username.slice(1) : user.username;
		if (userId) {
			try {
				   await updateUserProfile(userId, {
					   username: normalizedUsername,
					   email: user.email,
					   name: user.nombre,
					   surnames: user.apellido,
					   img: user.avatarUrl
				   });
			} catch (error: any) {
				// Mostrar el error completo en consola para depuración
				console.log('Error al actualizar perfil:', error, error?.response);
				// Manejo de errores específicos de duplicados y mensajes personalizados
				if (error.response && (error.response.status === 409 || error.response.status === 400)) {
					const msg = (error.response.data?.message || '').toLowerCase();
					let handled = false;
					if (msg.includes('username') || msg.includes('usuario')) {
						setFieldErrors(prev => ({ ...prev, username: true }));
						setFieldErrorMessages(prev => ({ ...prev, username: error.response.data?.message || 'El nombre de usuario ya está en uso.' }));
						handled = true;
					}
					if (msg.includes('email') || msg.includes('correo')) {
						setFieldErrors(prev => ({ ...prev, email: true }));
						setFieldErrorMessages(prev => ({ ...prev, email: error.response.data?.message || 'El correo electrónico ya está en uso.' }));
						handled = true;
					}
					// Si no se detecta el campo pero el usuario editó username/email, asociar el error al campo editado
					if (!handled && lastEditedFieldRef.current) {
						if (lastEditedFieldRef.current === 'username') {
							setFieldErrors(prev => ({ ...prev, username: true }));
							setFieldErrorMessages(prev => ({ ...prev, username: 'Usuario ya en uso' }));
						} else if (lastEditedFieldRef.current === 'email') {
							setFieldErrors(prev => ({ ...prev, email: true }));
							setFieldErrorMessages(prev => ({ ...prev, email: 'Correo electrónico ya registrado' }));
						} else {
							setProfileError(error.response.data?.message || 'Ya existe un usuario con esos datos o datos inválidos.');
						}
					} else if (!handled) {
						setProfileError(error.response.data?.message || 'Ya existe un usuario con esos datos o datos inválidos.');
					}
				} else if (error.response && error.response.data?.message) {
					// Si hay error general y el usuario editó username/email, asociar el error al campo editado
					if (lastEditedFieldRef.current === 'username') {
						setFieldErrors(prev => ({ ...prev, username: true }));
						setFieldErrorMessages(prev => ({ ...prev, username: 'Usuario ya en uso' }));
					} else if (lastEditedFieldRef.current === 'email') {
						setFieldErrors(prev => ({ ...prev, email: true }));
						setFieldErrorMessages(prev => ({ ...prev, email: 'Correo electrónico ya registrado' }));
					} else {
						setProfileError(error.response.data.message);
					}
				} else {
					setProfileError('No se pudo actualizar el perfil');
				}
				setLoading(false);
				return;
			}
		}
		// Limpiar errores de campo y mensajes al guardar exitosamente
		setFieldErrors({ nombre: false, apellido: false, username: false, email: false, currentPassword: false });
		setFieldErrorMessages({ nombre: '', apellido: '', username: '', email: '', currentPassword: '' });
		setProfileError(null);
		localStorage.setItem('userNombre', user.nombre);
		localStorage.setItem('userApellido', user.apellido);
		localStorage.setItem('username', normalizedUsername || '');
		localStorage.setItem('userEmail', user.email);
		localStorage.setItem('userAvatar', user.avatarUrl || '');
		setInitialUser({ ...user });
		window.dispatchEvent(new Event('user:updated'));
		showSuccess('Perfil actualizado correctamente');
		setLoading(false);
	};

	const handleCancelProfileChanges = () => {
		if (!initialUser) return;
		setUser(initialUser);
		setFieldErrors({ nombre: false, apellido: false, username: false, email: false, currentPassword: false });
		setFieldErrorMessages({ nombre: '', apellido: '', username: '', email: '', currentPassword: '' });
		setProfileError(null);
	};

	// Contraseña
	const handleVerifyCurrentPass = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!passwords.current) {
			setFieldErrors(prev => ({ ...prev, currentPassword: true }));
			setFieldErrorMessages(prev => ({ ...prev, currentPassword: 'La contraseña no puede estar vacía.' }));
			return;
		}
		setLoading(true);
		const normalizedUsername = user.username?.startsWith('@') ? user.username.slice(1) : user.username;
		const login = normalizedUsername || user.email;
		if (!login) {
			setFieldErrors(prev => ({ ...prev, currentPassword: true }));
			setFieldErrorMessages(prev => ({ ...prev, currentPassword: 'No se encontró el usuario.' }));
			setLoading(false);
			return;
		}
		try {
			await verifyUserCredentials(login, passwords.current);
			setPassVerified(true);
			setFieldErrors(prev => ({ ...prev, currentPassword: false }));
			setFieldErrorMessages(prev => ({ ...prev, currentPassword: '' }));
		} catch (error: any) {
			setPassVerified(false);
			setFieldErrors(prev => ({ ...prev, currentPassword: true }));
			setFieldErrorMessages(prev => ({ ...prev, currentPassword: 'Contraseña incorrecta.' }));
		}
		setLoading(false);
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordValidationError(null);
		if (passwords.new !== passwords.confirm) {
			setPasswordValidationError('Las contraseñas no coinciden.');
			return;
		}
		if (!passVerified) {
			setPasswordValidationError('Primero verifica tu contraseña actual.');
			return;
		}
		// Validación de contraseña segura
		if (passwords.new.length < 8 || !/\d/.test(passwords.new)) {
			setPasswordValidationError('La contraseña debe tener al menos 8 caracteres y un número.');
			return;
		}
		setLoading(true);
		const userId = localStorage.getItem('userId');
		if (!userId) {
			setPasswordValidationError('No se encontró el usuario.');
			setLoading(false);
			return;
		}
		try {
			await updateUserPassword(userId, passwords.new);
			setPasswords({ current: '', new: '', confirm: '' });
			setPassVerified(false);
			showSuccess('Contraseña modificada con éxito');
		} catch (error: any) {
			setPasswordValidationError('No se pudo actualizar la contraseña. Asegúrate de que cumpla los requisitos.');
		}
		setLoading(false);
	};

	const handleCancelPasswordChange = () => {
		setPasswords({ current: '', new: '', confirm: '' });
		setPassVerified(false);
	};

	const handleCancelPasswordVerify = () => {
		setPasswords(prev => ({ ...prev, current: '' }));
		setPassVerified(false);
		setFieldErrors(prev => ({ ...prev, currentPassword: false }));
		setFieldErrorMessages(prev => ({ ...prev, currentPassword: '' }));
	};

	// Eliminar cuenta
	const handleDeleteAccount = async () => {
		setLoading(true);
		const userId = localStorage.getItem('userId');
		if (!userId) {
			showError('No se encontró el usuario');
			setLoading(false);
			return;
		}
		try {
			await deleteUserAccount(userId);
			localStorage.clear();
			window.dispatchEvent(new Event('auth:logout'));
			showSuccess('Cuenta eliminada correctamente');
		} catch (error: any) {
			showError('No se pudo eliminar la cuenta', error?.message || 'Error desconocido');
		}
		setLoading(false);
	};

	// Mensajes
	const showSuccess = (msg: string, detail?: string) => {
		setResultModal({ type: 'success', title: msg, detail });
	};

	const showError = (msg: string, detail?: string) => {
		setResultModal({ type: 'error', title: msg, detail });
	};

	return {
		user, setUser, initialUser, setInitialUser,
		activeTab, setActiveTab, handleTabChange,
		loading, setLoading,
		resultModal, setResultModal,
		profileError, setProfileError,
		fieldErrors, setFieldErrors,
		fieldErrorMessages, setFieldErrorMessages,
		passwords, setPasswords,
		showCurrentPass, setShowCurrentPass,
		showNewPass, setShowNewPass,
		showConfirmPass, setShowConfirmPass,
		passVerified, setPassVerified,
		showDeleteModal, setShowDeleteModal,
		showAvatarOptions, setShowAvatarOptions,
		showCameraModal, setShowCameraModal,
		showCropModal, setShowCropModal,
		cropImageSrc, setCropImageSrc,
		crop, setCrop,
		zoom, setZoom,
		cropSaving, setCropSaving,
		isProfileDirty,
		fileInputRef, videoRef, croppedAreaRef,
		handleInputChange,
		handlePassChange,
		handleAvatarUpload,
		handleRemoveAvatarClick,
		confirmRemoveAvatar,
		handleOpenCamera,
		handleCloseCamera,
		handleCapturePhoto,
		handleCropComplete,
		handleConfirmCrop,
		handleCancelCrop,
		handleSaveProfile,
		handleCancelProfileChanges,
		handleVerifyCurrentPass,
		handleChangePassword,
		handleCancelPasswordChange,
		handleCancelPasswordVerify,
		handleDeleteAccount,
		showSuccess,
		showError,
		showDeleteConfirm,
		setShowDeleteConfirm,
		passwordValidationError,
		setPasswordValidationError
	};
};

export default useSettings;
