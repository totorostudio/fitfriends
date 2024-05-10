import { useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//import { AppRoute } from '../../const';
import { MainScreen } from '../../pages';
import { ScrollToTop } from '../';
import { fetchUsersAction } from '../../store/api-actions';
import { useAppDispatch } from '../../hooks';

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
                <Route path="" element={<MainScreen />} />
              </>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
  );
}
