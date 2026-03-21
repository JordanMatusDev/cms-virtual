export const RESOURCE_URLS = {
   PANEL_BACKGROUND: '/main.jpg',
   LOGO: '/virtualz.png',
   PROFILE_PIC: '/profile.jpg',
   APP_ICON: '/icono.ico',
};

export const LOGIN_UI_TEXTS = {
   PAGE_TITLE: 'Admin Login - Virtual',
   LOGIN_TITLE: 'Admin Login',
   USERNAME_LABEL: 'Usuario',
   PASSWORD_LABEL: 'Contraseña',
   USERNAME_PLACEHOLDER: 'Ingrese su usuario',
   PASSWORD_PLACEHOLDER: 'Ingrese su contraseña',
   LOGIN_BUTTON: 'Iniciar Sesión',
   TOGGLE_PASSWORD: 'Mostrar/Ocultar Contraseña',
   SHOW_PASS_ICON: 'Mostrar contraseña',
   HIDE_PASS_ICON: 'Ocultar contraseña',
};

export const ERROR_MSGS = {
   EMPTY_FIELDS: 'Por favor, complete todos los campos.',
   INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos.',
   SERVER_ERROR: 'Error del servidor. Por favor, inténtelo de nuevo más tarde.',
   NETWORK_ERROR: 'Error de red. Verifique su conexión e inténtelo de nuevo.',
   UNKNOWN_ERROR: 'Error desconocido. Por favor, inténtelo de nuevo.',
   INVALID_RESPONSE: 'Respuesta inválida del servidor.',
};

export const ADMIN_PANEL_TEXTS = {
   PAGE_TITLE: 'Admin Panel - Virtual',
   WELCOME_MESSAGE: '¡Bienvenido de nuevo ',
   SUBTITLE_TEXT: 'Gestiona tu plataforma desde aquí.',
   HOME: 'Inicio',
   USERS: 'Usuarios',
   COURSES: 'Cursos',
};

export const ADMIN_PANEL_ICONS = {
   HOME: 'home',
   USERS: 'users',
   COURSES: 'courses',
};

export const PROFILE_MENU_OPTIONS = {
   PROFILE: 'Mi perfil',
   LOGOUT: 'Cerrar sesión',
};

export const USERS_PAGE_HEADERS = {
   ID: 'ID',
   AVATAR: 'Avatar',
   FIRST_NAME: 'Nombre',
   LAST_NAME: 'Apellido',
   USERNAME: 'Usuario',
   EMAIL: 'Correo electrónico',
   ROLE: 'Rol',
   STATUS: 'Estado',
   VERIFICATION: 'Verificación',
   CREATED_AT: 'Creado el',
   UPDATED_AT: 'Actualizado el',
   LAST_ACCESS: 'Último acceso',
};

export const USERS_PAGE_ACTIONS = {
   ADD_USER: 'Agregar Usuario',
   EDIT_USER: 'Editar Usuario',
   DEACTIVATE_USER: 'Desactivar Usuario',
   ADD_USER_FORM_TITLE: 'Agregar un nuevo usuario',
   EDIT_USER_FORM_TITLE: 'Editar un usuario',
   VIEW_USER: 'Ver Usuario',
   PASSWORD: 'Contraseña',
   ENTER_NAME: 'Ingrese el nombre',
   ENTER_LAST_NAME: 'Ingrese el apellido',
   ENTER_USERNAME: 'Ingrese el nombre de usuario',
   ENTER_EMAIL: 'Ingrese el correo electrónico',
   SELECT_ROLE: 'Seleccione el rol',
   ENTER_PASSWORD: 'Ingrese la contraseña',
   SUBMIT_PROFILE_PIC: 'Subir foto de perfil',
   SUBMIT_BUTTON: 'Guardar',
   RELOAD_BUTTON: 'Recargar lista',
};

export const USERS_PAGE_ERRORS = {
   FETCH_USERS_ERROR: 'Error al obtener la lista de usuarios.',
   SUBMIT_USER_ERROR: 'Error al enviar los datos del usuario.',
   USERNAME_REQUIRED: 'El nombre de usuario es obligatorio.',
   INVALID_PASSWORD:
      'Contraseña inválida, mínimo 8 caracteres, una letra mayúscula y un número.',
   EMAIL_REQUIRED: 'El correo electrónico es obligatorio.',
   INVALID_EMAIL: 'El correo electrónico no es válido.',
   NAME_REQUIRED: 'El nombre es obligatorio.',
   LAST_NAME_REQUIRED: 'El apellido es obligatorio.',
   ROLE_REQUIRED: 'El rol es obligatorio.',
};

export const TOAST_MESSAGES = {
   AUTH: {
      LOGIN_SUCCESS_PREFIX: 'Bienvenido, ',
      LOGIN_ERROR: 'No se pudo iniciar sesión',
      LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
   },
   USERS: {
      CREATE_SUCCESS: 'Usuario creado correctamente',
      CREATE_ERROR: 'No se pudo crear el usuario',
      UPDATE_SUCCESS: 'Usuario actualizado correctamente',
      UPDATE_ERROR: 'No se pudo actualizar el usuario',
      DELETE_SUCCESS: 'Usuario eliminado correctamente',
      DELETE_ERROR: 'No se pudo eliminar el usuario',
   },
   COURSES: {
      CREATE_SUCCESS: 'Curso creado correctamente',
      CREATE_ERROR: 'No se pudo guardar el curso',
      UPDATE_SUCCESS: 'Curso actualizado correctamente',
      UPDATE_ERROR: 'No se pudo guardar el curso',
      DELETE_SUCCESS: 'Curso eliminado correctamente',
      DELETE_ERROR: 'No se pudo eliminar el curso',
      DEACTIVATE_SUCCESS: 'Curso desactivado correctamente',
      DEACTIVATE_ERROR: 'No se pudo desactivar el curso',
   },
   PROFILE: {
      UPDATE_SUCCESS: 'Perfil actualizado correctamente',
      UPDATE_ERROR: 'No se pudo actualizar el perfil',
   },
} as const;
