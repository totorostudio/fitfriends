import { useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//import { AppRoute } from '../../const';
import { AccountScreen, LoginScreen, NotFoundScreen, RegisterScreen } from '../../pages';
import { ScrollToTop } from '../';
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
                <Route path="" element={<Navigate to={AppRoute.Login} />} />
                <Route path={AppRoute.Login} element={<LoginScreen />} />
                <Route path={AppRoute.Register} element={<RegisterScreen />} />
                <Route path={AppRoute.Account} element={<AccountScreen />} />
                <Route path="*" element={<NotFoundScreen />} />
              </>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
  );
}
