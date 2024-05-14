import { useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useAppSelector } from '../../hooks';
import { AccountCoachPage, AccountCustomerPage, CreateTrainingPage, FriendsPage, IntroPage, LoginPage, MainPage, MyOrdersPage, MyTrainingsPage, NotFoundPage, QuestionnaireCoachPage, QuestionnaireCustomerPage, RegisterPage } from '../../pages';
import { ScrollToTop } from '..';
import { AppRoute, AuthorizationStatus } from '../../const';
import { getAuthorizationStatus, getRole } from '../../store/selectors';
import { UserRole } from '../../types';
import { Logout } from '../logout/logout';

export function App(): JSX.Element {
  //const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const userRole = useAppSelector(getRole);

  useEffect(() => {
    console.log('authorizationStatus', authorizationStatus);
    console.log('userRole', userRole);
  }, [authorizationStatus]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {authorizationStatus === AuthorizationStatus.Auth ? (
            userRole === UserRole.Coach ? (
            <>
              <Route path="" element={<Navigate to={AppRoute.AccountCoach} />} />
              <Route path={AppRoute.Login} element={<Navigate to={AppRoute.AccountCoach} />} />
              <Route path={AppRoute.Register} element={<Navigate to={AppRoute.AccountCoach} />} />
              <Route path={AppRoute.QuestionnaireCoach} element={<QuestionnaireCoachPage />} />
              <Route path={AppRoute.QuestionnaireCustomer} element={<Navigate to={AppRoute.AccountCoach} />} />
              <Route path={AppRoute.Main} element={<Navigate to={AppRoute.AccountCoach} />} />
              <Route path={AppRoute.AccountCoach} element={<AccountCoachPage />} />
              <Route path={AppRoute.AccountCustomer} element={<Navigate to={AppRoute.AccountCoach} />} />
              <Route path={AppRoute.MyTrainings} element={<MyTrainingsPage />} />
              <Route path={AppRoute.Friends} element={<FriendsPage />} />
              <Route path={AppRoute.CreateTraining} element={<CreateTrainingPage />} />
              <Route path={AppRoute.MyOrders} element={<MyOrdersPage />} />
              <Route path={AppRoute.Logout} element={<Logout />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
            ) : (
            <>
              <Route path="" element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.Login} element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.Register} element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.QuestionnaireCoach} element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.QuestionnaireCustomer} element={<QuestionnaireCustomerPage />} />
              <Route path={AppRoute.Main} element={<MainPage />} />
              <Route path={AppRoute.AccountCoach} element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.AccountCustomer} element={<AccountCustomerPage />} />
              <Route path={AppRoute.MyTrainings} element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.CreateTraining} element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.MyOrders} element={<Navigate to={AppRoute.Main} />} />
              <Route path={AppRoute.Logout} element={<Logout />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
            )
          ) : (
            <>
              <Route path="" element={<IntroPage />} />
              <Route path={AppRoute.Login} element={<LoginPage />} />
              <Route path={AppRoute.Register} element={<RegisterPage />} />
              <Route path={AppRoute.QuestionnaireCoach} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.QuestionnaireCustomer} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.Main} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.AccountCoach} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.AccountCustomer} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.MyTrainings} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.Friends} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.CreateTraining} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.MyOrders} element={<Navigate to={AppRoute.Intro} />} />
              <Route path={AppRoute.Logout} element={<Logout />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
