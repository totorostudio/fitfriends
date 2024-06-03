import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, NewOrderBody, Order, State } from '../../../types';
import { APIRoute } from '../../../const';
import { setError } from '../../action';

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
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);
