export type AuthView = 'login' | 'register' | 'forgot';

export interface User {
  name: string;
  email: string;
  avatar: string | null;
  role: string;
}