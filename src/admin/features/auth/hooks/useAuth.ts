import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router";
import { useContext } from "react";
import { authService } from "../services/auth.service";
import { type Credentials } from "../schemas/auth.schema";
import { type AuthUserResponse } from "@/admin/types/adminLogin";
import { AuthContext } from "@/admin/core/context/authContext";
import { useToast } from "@/admin/core/context/toastContext";
import { ROUTES_PATHS } from "@/admin/routes/AdminRoutes.constants";
import type { AuthUserData } from "@/admin/types/adminLogin";
import { TOAST_MESSAGES } from "@/admin/core/constants/appConstants";

export const useAuth = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const from = location.state?.from?.pathname || ROUTES_PATHS.ADMIN_HOME;
   const { setLogin } = useContext(AuthContext);
   const { showToast } = useToast();

   return useMutation({
      mutationFn: (credentials: Credentials) => authService.login(credentials),
      onSuccess: (data: AuthUserResponse) => {
         const userData: AuthUserData = {
            username: data.username,
            email: data.email,
            name: data.name,
            surnames: data.surnames,
            img: data.img,
         }
         setLogin(userData, data.access_token);
         showToast(`${TOAST_MESSAGES.AUTH.LOGIN_SUCCESS_PREFIX}${data.username}`, 'success');
         navigate(from, { replace: true });
      },
      onError: (error: any) => {
         console.error("Login error:", error);
         showToast(error?.detail || error?.message || TOAST_MESSAGES.AUTH.LOGIN_ERROR, 'error');
      }
   })
}
export default useAuth;