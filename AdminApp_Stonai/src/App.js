import { SnackbarProvider, useSnackbar } from 'notistack';

// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
// hooks

import useUserToken from './hooks/useUserToken';

// ----------------------------------------------------------------------

export default function App() {
  const { user, setUser } = useUserToken();

  return (
    <ThemeConfig>
      <SnackbarProvider maxSnack={3}>
        <ScrollToTop />
        <GlobalStyles />
        <Router setUser={setUser} user={user} />
      </SnackbarProvider>
    </ThemeConfig>
  );
}
