// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill')
  // },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: getIcon('eva:people-fill')
  // },
  {
    title: 'enterprise',
    path: '/dashboard/enterprise',
    icon: getIcon('eva:people-fill')
  },
  // {
  //   title: 'subscription',
  //   path: '/dashboard/subscription',
  //   icon: getIcon('eva:people-fill')
  // },
  {
    title: 'projects',
    path: '/dashboard/projects',
    icon: getIcon('eva:shopping-bag-fill')
  }

  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill')
  // },
  // // {
  // //   title: 'register',
  // //   path: '/register',
  // //   icon: getIcon('eva:person-add-fill')
  // // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill')
  // }
];

export default sidebarConfig;
