import { useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//import { AppRoute } from '../../const';
import { IntroScreen, LoginScreen, MainScreen, NotFoundScreen, RegisterScreen } from '../../pages';
import { ScrollToTop } from '..';
import { fetchUsersAction } from '../../store/api-actions';
import { useAppDispatch } from '../../hooks';
import { AppRoute } from '../../const';

export default function App(): JSX.Element {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsersAction());
  }, [dispatch]);

  return (
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
              <>
                <Route path="" element={<IntroScreen />} />
                <Route path={AppRoute.Login} element={<LoginScreen />} />
                <Route path={AppRoute.Register} element={<RegisterScreen />} />
                <Route path={AppRoute.Main} element={<MainScreen />} />
                <Route path="*" element={<NotFoundScreen />} />
              </>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
  );
}
