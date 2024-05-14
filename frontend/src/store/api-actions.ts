import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State, BaseUser, AuthData, UserData } from '../types';
import { loadUsers, requireAuthorization, setError, setUserRole } from './action';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { store } from './';
import { dropAccessToken, dropRefreshToken, getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken } from '../services/token-service';

export const clearErrorAction = createAsyncThunk(
  'data/clearError',
  () => {
    setTimeout(
      () => store.dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR
    );
  },
);

export const fetchUsersAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchUsers',
  async (_arg, {dispatch, extra: api}) => {
    dispatch(loadUsers({isLoading: true, data: []}));
    try {
      const {data} = await api.get<BaseUser[]>(APIRoute.Users);
      dispatch(loadUsers({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    const token = getAccessToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        await api.get(APIRoute.Login);
        dispatch(requireAuthorization(AuthorizationStatus.Auth));
      } catch {
        dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      }
    } else {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({email, password}, {dispatch, extra: api}) => {
    const result = await api.post<UserData>(APIRoute.Login, {email, password});
    console.log(result);
    const {data: {accessToken, refreshToken, role}} = await api.post<UserData>(APIRoute.Login, {email, password});
    saveAccessToken(accessToken);
    saveRefreshToken(refreshToken);

    dispatch(requireAuthorization(AuthorizationStatus.Auth));
    dispatch(setUserRole({userRole: role}));
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, {dispatch, extra: api}) => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      await api.delete(APIRoute.Logout, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
    }

    dropAccessToken();
    dropRefreshToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  },
);
