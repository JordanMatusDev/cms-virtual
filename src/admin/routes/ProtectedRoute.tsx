import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES_PATHS } from "./AdminRoutes.constants";
import { AuthContext } from "@/admin/core/context/authContext";
import { CircularProgress } from "@mui/material";

function ProtectedRoute() {
   const { access_token, loading } = useContext(AuthContext);
   const currentLocation = useLocation();

   if (loading) {
      return <CircularProgress />;
   }

   if (!access_token) {
      return <Navigate to={ROUTES_PATHS.ADMIN_LOGIN} state={{ from: currentLocation }} replace />;
   }

   return (
      <Outlet />
   )
}

export default ProtectedRoute