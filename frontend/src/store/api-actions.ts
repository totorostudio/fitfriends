import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Base64 } from 'js-base64';
import { AppDispatch, State, AuthData, UserData, FullUser, Trainings, Users, UserRole, Level, Metro, SortDirection, Training, Reviews, TrainingType } from '../types';
import { clearUserData, loadCoachTrainings, loadFeaturedTrainings, loadPopularTrainings, loadRelatedTrainings, loadReview, loadTraining, loadUser, loadUsers, requireAuthorization, setError, setUserData } from './action';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { store } from './';
import { clearTokens, dropAccessToken, dropRefreshToken, getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken } from '../services/token-service';
import { buildQueryString } from '../utils';

export const clearErrorAction = createAsyncThunk(
  'data/clearError',
  () => {
    setTimeout(
      () => store.dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR
    );
  },
);

export const fetchTrainingAction = createAsyncThunk<void, String, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchUserInfo',
  async (id, {dispatch, extra: api}) => {
    dispatch(loadTraining({isLoading: true, data: null}));
    try {
      const {data} = await api.get<Training>(`${APIRoute.Training}/${id}`);
      dispatch(loadTraining({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

interface FetchTrainingsParams {
  storeName: 'related' | 'featured' | 'popular' | 'coach';
  coachId?: string;
  limit?: number;
  priceFrom?: number;
  priceTo?: number;
  caloriesFrom?: number;
  caloriesTo?: number;
}

export const fetchTrainingsAction = createAsyncThunk<void, FetchTrainingsParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchTrainings',
  async (params, {dispatch, extra: api}) => {
    const { storeName, ...apiParams } = params;

    console.log('params:', params);
    console.log('storeName:', storeName);
    console.log('apiParams:', apiParams);

    if (storeName === 'related') {
      dispatch(loadRelatedTrainings({isLoading: true, data: null}));
    } else if (storeName === 'featured') {
      dispatch(loadFeaturedTrainings({isLoading: true, data: null}));
    } else if (storeName === 'popular') {
      dispatch(loadPopularTrainings({isLoading: true, data: null}));
    } else if (storeName === 'coach') {
      dispatch(loadCoachTrainings({isLoading: true, data: null}));
    } else {
      throw new Error('Unknown storeName');
    }

    const searchParams = new URLSearchParams();
    Object.keys(apiParams).forEach(key => {
      const value = apiParams[key as keyof typeof apiParams];
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    try {
      const {data} = await api.get<Trainings>(`${APIRoute.Training}?${searchParams.toString()}`);

      if (storeName === 'related') {
        dispatch(loadRelatedTrainings({isLoading: false, data}));
      } else if (storeName === 'featured') {
        dispatch(loadFeaturedTrainings({isLoading: false, data}));
      } else if (storeName === 'popular') {
        dispatch(loadPopularTrainings({isLoading: false, data}));
      } else if (storeName === 'coach') {
        dispatch(loadCoachTrainings({isLoading: false, data}));
      }
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

interface FetchReviewsParams {
  trainingId: string;
  limit?: number;
  sort?: SortDirection;
  page?: number;
}

export const fetchReviewsAction = createAsyncThunk<void, FetchReviewsParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchTrainings',
  async (params, {dispatch, extra: api}) => {
    dispatch(loadReview({isLoading: true, data: null}));

    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    try {
      const {data} = await api.get<Reviews>(`${APIRoute.Review}?${searchParams.toString()}`);
      dispatch(loadReview({isLoading: false, data}));
    } catch (error) {
      dispatch(loadReview({isLoading: false, data: null}));
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export interface UsersFilterParams {
  limit?: number;
  sort?: SortDirection;
  page?: number;
  trainingType?: TrainingType[];
  metro?: Metro;
  level?: Level;
  role?: UserRole;
}

export const fetchUsersAction = createAsyncThunk<void, UsersFilterParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchUsers',
  async (params, {dispatch, extra: api}) => {
    dispatch(loadUsers({isLoading: true, data: null}));
    console.log('params:', params);

    const queryString = buildQueryString(params);

    try {
      console.log('queryString:', queryString);
      const { data } = await api.get<Users>(`${APIRoute.Users}?${queryString}`);
      dispatch(loadUsers({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export const fetchUserAction = createAsyncThunk<void, String, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchUserInfo',
  async (id, {dispatch, extra: api}) => {
    dispatch(loadUser({isLoading: true, data: null}));
    try {
      const {data} = await api.get<FullUser>(`${APIRoute.Users}/${id}`);
      dispatch(loadUser({isLoading: false, data}));
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
    dispatch(loadUser({ isLoading: true, data: null }));
    try {
      const { data } = await api.patch<FullUser>(`${APIRoute.Users}/${id}`, updateData);
      dispatch(loadUser({ isLoading: false, data }));
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
    let accessToken = getAccessToken();
    let isTokenExpired = checkTokenExpired(accessToken);

    if (accessToken && isTokenExpired) {
      console.log('Токен просрочен:', isTokenExpired);
      const refreshToken = getRefreshToken();
      const isRefreshExpired = checkTokenExpired(refreshToken)
      if (refreshToken && !isRefreshExpired) {
        try {
          accessToken = await refreshAccessToken(api, refreshToken);
          console.log('Перевыпустил токен:', accessToken);
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
        dispatch(loadUser({isLoading: false, data}));
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
