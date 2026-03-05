import { Suspense, lazy, type ReactNode } from 'react';
import {
   ADMIN_PANEL_TEXTS,
   ADMIN_PANEL_ICONS,
} from '@/admin/core/constants/appConstants';
import AdminPageLoader from '@/admin/core/components/AdminPageLoader';
import { ROUTES_PATHS } from './AdminRoutes.constants';

const HomePage = lazy(
   () => import('@/admin/features/home/components/HomePage')
);
const UsersList = lazy(
   () => import('@/admin/features/users/components/UsersList')
);
const UsersForm = lazy(
   () => import('@/admin/features/users/components/UsersForm')
);
const CoursesList = lazy(
   () => import('@/admin/features/courses/components/CoursesList')
);
const CoursesForm = lazy(
   () => import('@/admin/features/courses/components/CoursesForm')
);
const ProfilePage = lazy(
   () => import('@/admin/features/profile/components/ProfilePage')
);
const StatsPage = lazy(() => import('@/admin/features/stats/components/stats'));

const withLazyFallback = (element: ReactNode) => (
   <Suspense fallback={<AdminPageLoader message="Cargando página..." />}>
      {element}
   </Suspense>
);

export const ADMIN_ROUTES = [
   {
      path: ROUTES_PATHS.ADMIN_HOME,
      label: ADMIN_PANEL_TEXTS.HOME,
      icon: ADMIN_PANEL_ICONS.HOME,
      element: withLazyFallback(<HomePage />),
      display: true,
   },
   {
      path: ROUTES_PATHS.ADMIN_USERS,
      label: ADMIN_PANEL_TEXTS.USERS,
      icon: ADMIN_PANEL_ICONS.USERS,
      element: withLazyFallback(<UsersList />),
      display: true,
   },
   {
      path: ROUTES_PATHS.ADMIN_COURSES,
      label: ADMIN_PANEL_TEXTS.COURSES,
      icon: ADMIN_PANEL_ICONS.COURSES,
      element: withLazyFallback(<CoursesList />),
      display: true,
   },
   {
      path: ROUTES_PATHS.ADMIN_PROFILE,
      label: '',
      icon: '',
      element: withLazyFallback(<ProfilePage />),
      display: false,
   },

   {
      path: ROUTES_PATHS.ADMIN_COURSES_FORM,
      label: '',
      icon: '',
      element: withLazyFallback(<CoursesForm />),
      display: false,
   },
   {
      path: ROUTES_PATHS.ADMIN_USERS_FORM,
      label: '',
      icon: '',
      element: withLazyFallback(<UsersForm />),
      display: false,
   },
   {
      path: ROUTES_PATHS.ADMIN_STATS,
      label: '',
      icon: '',
      element: withLazyFallback(<StatsPage />),
      display: false,
   },
];
