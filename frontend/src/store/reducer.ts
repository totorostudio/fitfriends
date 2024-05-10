import {createReducer} from '@reduxjs/toolkit';
import {loadUsers, setError} from './action';
import {BaseUser} from '../types';


type InitialState = {
  allUsers: {
    isLoading: boolean;
    data: BaseUser[];
  };
  error: string | null;
};

const initialState: InitialState = {
  allUsers: {
    isLoading: false,
    data: [],
  },
  error: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadUsers, (state, action) => {
      state.allUsers = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    });
});

export {reducer};
