import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State, BaseUser } from '../types';
import { loadUsers, setError } from './action';
import { APIRoute, TIMEOUT_SHOW_ERROR } from '../const';
import { store } from './';

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
