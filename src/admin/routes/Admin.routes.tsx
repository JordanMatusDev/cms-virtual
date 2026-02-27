import { ADMIN_PANEL_TEXTS, ADMIN_PANEL_ICONS } from "@/admin/core/constants/appConstants"
import { HomePage } from "@/admin/features/home"
import { UsersList, UsersForm } from "@/admin/features/users"
import { CoursesList, CoursesForm } from "@/admin/features/courses"
import { ProfilePage } from "@/admin/features/profile"
import { ROUTES_PATHS } from "./AdminRoutes.constants"

export const ADMIN_ROUTES = [
   { 
      path: ROUTES_PATHS.ADMIN_HOME, 
      label: ADMIN_PANEL_TEXTS.HOME, 
      icon: ADMIN_PANEL_ICONS.HOME, 
      element: <HomePage />, 
      display: true 
   },
   { 
      path: ROUTES_PATHS.ADMIN_USERS, 
      label: ADMIN_PANEL_TEXTS.USERS, 
      icon: ADMIN_PANEL_ICONS.USERS, 
      element: <UsersList />,
      display: true 
   },
   { 
      path: ROUTES_PATHS.ADMIN_COURSES, 
      label: ADMIN_PANEL_TEXTS.COURSES, 
      icon: ADMIN_PANEL_ICONS.COURSES, 
      element: <CoursesList />, 
      display: true 
   },
   {
      path: ROUTES_PATHS.ADMIN_PROFILE,
      label: '',
      icon: '',
      element: <ProfilePage />,
      display: false
   },

   { 
      path: ROUTES_PATHS.ADMIN_COURSES_FORM, 
      label: '', 
      icon: '', 
      element: <CoursesForm />, 
      display: false 
   },
   {
      path: ROUTES_PATHS.ADMIN_USERS_FORM,
      label: '',
      icon: '',
      element: <UsersForm />,
      display: false
   }
]