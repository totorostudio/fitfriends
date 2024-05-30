import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Base64 } from 'js-base64';
import { AppDispatch, State, AuthData, UserData, FullUser, Trainings, Users, UserRole, Level, Metro, SortDirection, Training, Reviews, TrainingType, Balances, Order, NewOrderBody, Review, Notify, FullTraining, FullReview, EditableTrainingData, SortOrder, CoachOrders } from '../types';
import { clearUserData, loadCoachTrainings, loadFeaturedTrainings, loadPopularTrainings, loadRelatedTrainings, loadReview, loadTraining, loadUser, loadUsers, requireAuthorization, setError, setAuthUser, loadFriends, loadBalance, loadNotify, loadOrders } from './action';
import { APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR } from '../const';
import { store } from './';
import { clearTokens, dropAccessToken, dropRefreshToken, getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken } from '../services/token-service';
import { buildQueryString } from '../utils';

interface BaseFetchParams {
  limit?: number;
  currentPage?: number;
}

export const clearErrorAction = createAsyncThunk(
  'data/clearError',
  () => {
    setTimeout(
      () => store.dispatch(setError(null)),
      TIMEOUT_SHOW_ERROR
    );
  },
);

export const createTrainingAction = createAsyncThunk<void, Training, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/createTraining',
  async (body, { dispatch, extra: api }) => {
    try {
      const {data} = await api.post(`${APIRoute.Training}`, body);
      console.log(data);
    } catch (error) {
      dispatch(setError('Error updating the user on the server'));
      throw error;
    }
  },
);

export const updateTrainingAction = createAsyncThunk<void, { id: String, editableData: EditableTrainingData }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/updateTraining',
  async ({id, editableData}, { dispatch, extra: api }) => {
    try {
      const {data} = await api.patch(`${APIRoute.Training}/${id}`, editableData);
      console.log(data);
    } catch (error) {
      dispatch(setError('Error updating the training on the server'));
      throw error;
    }
  },
);

export const fetchTrainingAction = createAsyncThunk<void, { id: String, role: String }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchTraining',
  async ({ id, role }, {dispatch, extra: api}) => {
    dispatch(loadTraining({isLoading: true, data: null}));
    try {
      const trainingResponse  = await api.get<Training>(`${APIRoute.Training}/${id}`);

      let balanceResponse;
      let count = 0;

      if (role === UserRole.Customer) {
        balanceResponse = await api.get<Balances>(APIRoute.Balance);

        const balances = balanceResponse.data.balances;
        const balance = balances.find(balance => balance.training.id === id);

        if (balance) {
          count = balance.count;
        }
      }

      const userResponse = await api.get<FullUser>(`${APIRoute.Users}/${trainingResponse.data.coachId}`);

      const fullTraining: FullTraining = {
        ...trainingResponse.data,
        coachName: userResponse.data.name,
        coachAvatar: userResponse.data.avatar,
        count
      };

      console.log('fullTraining:', fullTraining);
      dispatch(loadTraining({isLoading: false, data: fullTraining}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

interface FetchTrainingsParams extends BaseFetchParams {
  storeName: 'related' | 'featured' | 'popular' | 'coach';
  coachId?: string;
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
  currentPage?: number;
}

export const fetchReviewsAction = createAsyncThunk<void, FetchReviewsParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchReviews',
  async (params, {dispatch, extra: api}) => {
    const { trainingId, ...apiParams } = params;
    dispatch(loadReview({isLoading: true, data: null}));

    const searchParams = new URLSearchParams();
    Object.keys(apiParams).forEach(key => {
      const value = apiParams[key as keyof typeof apiParams];
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    try {
      const {data} = await api.get<Reviews>(`${APIRoute.Review}/${trainingId}?${searchParams.toString()}`);
      const reviews = data.reviews;

      const fullReviews: FullReview[] = await Promise.all(reviews.map(async (review) => {
        const userResponse = await api.get<FullUser>(`${APIRoute.Users}/${review.userId}`);
        const user = userResponse.data;
        return {
          ...review,
          userName: user.name,
          userAvatar: user.avatar
        };
      }));

      dispatch(loadReview({isLoading: false, data: fullReviews}));
    } catch (error) {
      dispatch(loadReview({isLoading: false, data: null}));
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

interface FetchBalanceParams extends BaseFetchParams {
  isActive: boolean;
}

export const fetchBalanceAction = createAsyncThunk<void, FetchBalanceParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchBalance',
  async (params, {dispatch, extra: api}) => {
    dispatch(loadBalance({isLoading: true, data: null}));

    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    try {
      console.log((`${APIRoute.Balance}?${searchParams.toString()}`));
      const {data} = await api.get<Balances>(`${APIRoute.Balance}?${searchParams.toString()}`);
      dispatch(loadBalance({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export const spendBalanceAction = createAsyncThunk<void, String, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/spendBalance',
  async (trainingId, { dispatch, extra: api }) => {
    try {
      await api.patch(`${APIRoute.Balance}/${trainingId}`);
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

interface FetchOrdersParams extends BaseFetchParams {
  sort?: SortDirection;
  sortOrder?: SortOrder;
}

export const fetchOrdersAction = createAsyncThunk<void, FetchOrdersParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOrders',
  async (params, {dispatch, extra: api}) => {
    dispatch(loadOrders({isLoading: true, data: null}));

    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    try {
      const {data} = await api.get<CoachOrders>(`${APIRoute.Orders}?${searchParams.toString()}`);
      dispatch(loadOrders({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export const createOrderAction = createAsyncThunk<void, NewOrderBody, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/createOrder',
  async (body, { dispatch, extra: api }) => {
    try {
      const {data} = await api.post<Order>(`${APIRoute.Orders}`, body);
      console.log(data);
    } catch (error) {
      dispatch(setError('Error updating the user on the server'));
      throw error;
    }
  },
);

export const createReviewAction = createAsyncThunk<void, Review, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/createReview',
  async (body, { dispatch, extra: api }) => {
    try {
      const {data} = await api.post<Review>(`${APIRoute.Review}`, body);
      console.log(data);
    } catch (error) {
      dispatch(setError('Error updating the user on the server'));
      throw error;
    }
  },
);

export const addToFriendAction = createAsyncThunk<void, { friendId: String }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/addToFriend',
  async ({ friendId }, { dispatch, extra: api }) => {
    try {
      await api.post(APIRoute.AddFriend, {friendId});
    } catch (error) {
      dispatch(setError('Error updating the user on the server'));
      throw error;
    }
  },
);

export interface FriendsParams {
  limit?: number;
  sort?: SortDirection;
  page?: number;
}

export const fetchFriendsAction = createAsyncThunk<void, FriendsParams, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchFriends',
  async (params, {dispatch, extra: api}) => {
    dispatch(loadFriends({isLoading: true, data: null}));

    const queryString = buildQueryString(params);

    try {
      console.log('queryString:', queryString);
      const { data } = await api.get<Users>(`${APIRoute.Friends}?${queryString}`);
      dispatch(loadFriends({isLoading: false, data}));
    } catch (error) {
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export interface UsersFilterParams {
  limit?: number;
  page?: number;
  sort?: SortDirection;
  currentPage?: number;
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

export const fetchNotifyAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchNotify',
  async (_arg, {dispatch, extra: api}) => {
    dispatch(loadNotify({isLoading: true, data: null}));

    try {
      const {data} = await api.get<Notify[]>(APIRoute.Notify);
      dispatch(loadNotify({isLoading: false, data}));
    } catch (error) {
      dispatch(loadNotify({isLoading: false, data: null}));
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);

export const deleteNotifyAction = createAsyncThunk<void, { id: string }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/deleteNotify',
  async ({ id }, {dispatch, extra: api}) => {

    try {
      await api.delete(`${APIRoute.Notify}/${id}`);
    } catch (error) {
      dispatch(setError('Error connection to the server'));
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
          dispatch(setAuthUser({id, email, role}));
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
    dispatch(setAuthUser({id, email, role}));
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
