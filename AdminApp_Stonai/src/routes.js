import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';

import Projects from './pages/Projects';
import Enterprise from './pages/Enterprise';
// import Subscription from './pages/Subscription';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router({ user, setUser }) {
  return useRoutes([
    {
      path: '/dashboard',
      element: user?.token ? (
        <DashboardLayout setUser={setUser} user={user} />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        // { path: 'app', element: <DashboardApp /> },
        // { path: 'user', element: <User /> },
        {
          path: 'projects',
          element: user?.token ? <Projects /> : <Navigate to="/login" replace />
        },
        // { path: 'blog', element: user ? <Blog /> : <Navigate to="/login" replace /> },
        {
          path: 'enterprise',
          element: user?.token ? <Enterprise /> : <Navigate to="/login" replace />
        }
        // { path: 'subscription', element: <Subscription /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        {
          path: '/',
          element: user?.token ? (
            <Navigate to="/dashboard/enterprise" />
          ) : (
            <Navigate to="/login" replace />
          )
        },
        {
          path: 'login',
          element: user?.token ? (
            <Navigate to="/dashboard/enterprise" replace />
          ) : (
            <Login setUser={setUser} />
          )
        },
        // { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
