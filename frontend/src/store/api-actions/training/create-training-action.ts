import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State, Training } from '../../../types';
import { APIRoute } from '../../../const';
import { setError } from '../../action';

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
      dispatch(setError('Error connection to the server'));
      throw error;
    }
  },
);
