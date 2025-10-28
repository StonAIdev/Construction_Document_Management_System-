import { Outlet } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core';
import MainNavbar from './MainNavbar';
import FloatImage from './FloatImage/Asserts/Network.png'
import { before } from 'lodash';

const MainLayoutRoot = experimentalStyled('div')(
  ({ theme }) => ({
    backgroundColor: "transparent",
    // backgroundImage: `url(${FloatImage})`,
    display: 'flex',
    flexDirection:'column',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const MainLayoutWrapper = experimentalStyled('div')({
  display: 'flex',
  flexDirection:'column',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 0
});

const MainLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flexDirection:'column',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const MainLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  backgroundRepeat:"no-repeat",
  backgroundImage: `url(${FloatImage})`,
  backgroundSize: "contain, cover",

});

const MainLayout = () => (
  <MainLayoutRoot>
    <MainNavbar />
    <MainLayoutWrapper>
      <MainLayoutContainer>
        <MainLayoutContent>
          <Outlet />
        </MainLayoutContent>
      </MainLayoutContainer>
    </MainLayoutWrapper>
  </MainLayoutRoot>
);

export default MainLayout;
