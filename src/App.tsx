import { BrowserRouter, Routes, Route, Navigate } from "react-router"

// ==========================================
// IMPORTACIONES DEL ADMIN
// ==========================================
import { Auth } from "@/admin/features/auth"
import { ROUTES_PATHS } from "@/admin/routes/AdminRoutes.constants"
import { AuthProvider } from "@/admin/core/context/authContext"
import { ADMIN_ROUTES } from "./admin/routes/Admin.routes"
import AdminPanel from "@/admin/features/adminPanel/AdminPanel"
import AdminProtectedRoute from "@/admin/routes/ProtectedRoute"

// ==========================================
// IMPORTACIONES DE LA APP PÚBLICA
// ==========================================
// Ajusta estas rutas a tu nueva carpeta src/publicApp/...
import ResetPassword from "./publicPage/email/ResetPassword"
import VerifyEmail from "./publicPage/email/VerifyEmail"
import Hero from "./publicPage/layout/Hero"
import CourseGrid from "./publicPage/pages/CourseGrid"
import CoursePlayer from "./publicPage/pages/CoursePlayer"
import MyCourses from "./publicPage/pages/MyCourse"
import MyCertificates from "./publicPage/pages/MyCertificates"
import Verification from "./publicPage/pages/Verification"
import Settings from "./publicPage/pages/Settings"

// Componentes estructurales que creamos para la App Pública
import PublicLayout from "./publicPage/layout/PublicLayout"
import PublicProtectedRoute from "./publicPage/routes/PublicProtectedRoute"
import ScrollToTop from "./publicPage/layout/ScrollToTop"

function App() {
   return (
      <AuthProvider>
         <BrowserRouter>
            <ScrollToTop /> 
            
            <Routes>
               
               {/* ========================================== */}
               {/* RUTAS DEL PANEL DE ADMINISTRACIÓN       */}
               {/* ========================================== */}
               
               <Route path={ROUTES_PATHS.ADMIN_LOGIN} element={<Auth />} />
               <Route element={<AdminProtectedRoute />}>
                  <Route path={ROUTES_PATHS.ADMIN_PANEL} element={<AdminPanel />} >
                     <Route index element={<Navigate to={ROUTES_PATHS.ADMIN_HOME} />} />
                     {ADMIN_ROUTES.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                     ))}
                  </Route>
               </Route>


               {/* ========================================== */}
               {/* RUTAS PÚBLICAS (Alumnos)                */}
               {/* ========================================== */}

               {/* Pantallas completas (Sin Header/Footer) */}
               <Route path="/reset-password" element={<ResetPassword />} />
               <Route path="/verify-email" element={<VerifyEmail />} />

               {/* App principal envuelta en el Layout (Con Header/Footer) */}
               <Route element={<PublicLayout />}>
                  
                  {/* Vistas públicas */}
                  <Route path="/" element={<><Hero /><CourseGrid /></>} />
                  <Route path="/curso/:id" element={<CoursePlayer />} />
                  <Route path="/verificacion" element={<Verification />} />
                  
                  {/* Vistas privadas (Solo alumnos logueados) */}
                  <Route element={<PublicProtectedRoute />}>
                     <Route path="/mis-cursos" element={<MyCourses />} />
                     <Route path="/certificados" element={<MyCertificates />} />
                     <Route path="/settings" element={<Settings />} />
                  </Route>

               </Route>

            </Routes>
         </BrowserRouter>
      </AuthProvider>
   )
}

export default App