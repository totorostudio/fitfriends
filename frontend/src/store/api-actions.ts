import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Base64 } from 'js-base64';
import { AppDispatch, State, BaseUser, AuthData, UserData, FullUser, Trainings } from '../types';
import { clearUserData, loadTrainings, loadUserInfo, loadUsers, requireAuthorization, setError, setUserData } from './action';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { store } from './';
import { clearTokens, dropAccessToken, dropRefreshToken, getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken } from '../services/token-service';

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

interface FetchTrainingParams {
  coachId?: string;
  limit?: number;
  priceFrom?: number;
  priceTo?: number;
  caloriesFrom?: number;
  caloriesTo?: number;
}

export const fetchTrainingsAction = createAsyncThunk<void, FetchTrainingParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchTrainings',
  async (params, {dispatch, extra: api}) => {
    dispatch(loadTrainings({isLoading: true, data: null}));
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof FetchTrainingParams];
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    try {
      const {data} = await api.get<Trainings>(`${APIRoute.Training}?${searchParams.toString()}`);
      console.log('data:', data)
      dispatch(loadTrainings({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export const fetchUserInfoAction = createAsyncThunk<void, String, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchUserInfo',
  async (id, {dispatch, extra: api}) => {
    dispatch(loadUserInfo({isLoading: true, data: null}));
    try {
      const {data} = await api.get<FullUser>(`${APIRoute.Users}/${id}`);
      dispatch(loadUserInfo({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export const updateUserAction = createAsyncThunk<void, { id: string, updateData: Partial<FullUser> }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/updateUser',
  async ({ id, updateData }, { dispatch, extra: api }) => {
    dispatch(loadUserInfo({ isLoading: true, data: null }));
    try {
      const { data } = await api.patch<FullUser>(`${APIRoute.Users}/${id}`, updateData);
      dispatch(loadUserInfo({ isLoading: false, data }));
    } catch (error) {
      dispatch(setError('Error updating the user on the server'));
      throw error;
    }
  },
);

const checkTokenExpired = (token: string): boolean => {
  console.log('token:', token);
  try {
    console.log('Проверяю токен на просроченность');
    const parts = token.split('.');

    if (parts.length !== 3) {
      console.error('Неверный формат токена');
      return true;
    }

    const payload = JSON.parse(Base64.decode(parts[1]));
    const result = payload.exp < Date.now() / 1000;
    console.log('Токен просрочен?', result);
    return result;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return true;
  }
};

const refreshAccessToken = async (api: AxiosInstance, refreshToken: string) => {
  try {
    const { data } = await api.post('/api/refresh-token', { refreshToken });
    const { accessToken } = data;
    saveAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    console.log('Запускаю checkauth');
    let accessToken = getAccessToken();
    console.log('accessToken', accessToken);
    let isTokenExpired = checkTokenExpired(accessToken);

    if (accessToken && isTokenExpired) {
      console.log('Токен просрочен:', isTokenExpired);
      const refreshToken = getRefreshToken();
      const isRefreshExpired = checkTokenExpired(refreshToken)
      if (refreshToken && !isRefreshExpired) {
        try {
          accessToken = await refreshAccessToken(api, refreshToken);
        } catch {
          clearTokens();
          dispatch(clearUserData());
          dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
          return;
        }
      } else {
        clearTokens();
        dispatch(clearUserData());
        dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
        return;
      }
    }

    if (accessToken) {
      console.log('Вижу, что токен есть:', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      try {
        const {data} = await api.get<FullUser>(APIRoute.Login);
        dispatch(loadUserInfo({isLoading: false, data}));
        const { id, email, role } = data;
        if (id) {
          dispatch(requireAuthorization(AuthorizationStatus.Auth));
          dispatch(setUserData({id, email, role}));
          console.log('Авторизирован с ролью:', role);
        } else {
          throw new Error('id or role is missing');
        }
      } catch {
        clearTokens();
        dispatch(clearUserData());
        dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
        dispatch(setError('Error connection to the server'));
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
    const {data: {accessToken, refreshToken, id, role}} = await api.post<UserData>(APIRoute.Login, {email, password});

    if (accessToken) {
      saveAccessToken(accessToken);
    }

    if (refreshToken) {
      saveRefreshToken(refreshToken);
    }

    dispatch(requireAuthorization(AuthorizationStatus.Auth));
    dispatch(setUserData({id, email, role}));
    console.log('Авторизирован с ролью:', role);
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
    dropAccessToken();

    if (refreshToken) {
      await api.delete(APIRoute.Logout, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
    }

    dropRefreshToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    dispatch(clearUserData());
    delete api.defaults.headers.common['Authorization'];
  },
);
