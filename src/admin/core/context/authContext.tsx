import { createContext, useState, useMemo, useEffect, type ReactNode, useCallback } from "react";
import { type AuthUserData, type AuthContextValue, AuthUserDataSchema } from "@/admin/types/adminLogin";

const defaultAuthContext: AuthContextValue = {
   usuario: null,
   access_token: null,
   loading: true,
   setLogin: () => {},
   setLogout: () => {}
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [usuario, setUsuario] = useState<AuthUserData | null>(() => {
      const user = localStorage.getItem("usuario");
      if (user) {
         try {
            const parsedUser = JSON.parse(user);
            const validation = AuthUserDataSchema.safeParse(parsedUser);
            if (validation.success) {
               return validation.data;
            }
         }
         catch (error) {
            console.error("Error, usuario alterado en el localStorage:", error);
         }
      }
      return null;
   });
   const [access_token, setAccessToken] = useState<string | null>(() => localStorage.getItem("access_token"));
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("usuario");
      
      if (token && user) {
         try {
            const parsedUser = JSON.parse(user);
            const validation = AuthUserDataSchema.safeParse(parsedUser);

            if (validation.success) {
               setUsuario(validation.data);
               setAccessToken(token);
            }
            else {
               console.warn("Datos de sesión inválidos, cerrando sesión...", validation.error);
               localStorage.removeItem("access_token");
               localStorage.removeItem("usuario");
            }
         }
         catch (error) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("usuario");
         }
      }
      setLoading(false);
   }, []);

   const setLogin = useCallback((usuario: AuthUserData, access_token: string) => {
      setUsuario(usuario);
      setAccessToken(access_token);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
   }, []);

   const setLogout = useCallback(() => {
      setUsuario(null);
      setAccessToken(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("usuario");
   }, []);

   useEffect(() => {
      const handleLogout = () => {
         setLogout();
      };

      window.addEventListener('auth-error', handleLogout);

      return () => {
         window.removeEventListener('auth-error', handleLogout);
      };
   }, [setLogout]);

   const value = useMemo(() => ({
      usuario,
      access_token,
      loading,
      setLogin,
      setLogout
   }), [usuario, access_token, loading, setLogin, setLogout]);

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   );
}