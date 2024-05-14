import {createReducer} from '@reduxjs/toolkit';
import {loadUsers, requireAuthorization, setError, setUserRole} from './action';
import {BaseUser, UserRole} from '../types';
import { AuthorizationStatus } from '../const';

type InitialState = {
  allUsers: {
    isLoading: boolean;
    data: BaseUser[];
  };
  authorizationStatus: AuthorizationStatus;
  userRole: string;
  error: string | null;
};

const initialState: InitialState = {
  allUsers: {
    isLoading: false,
    data: [],
  },
  authorizationStatus: AuthorizationStatus.Unknown,
  userRole: UserRole.Unknown,
  error: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadUsers, (state, action) => {
      state.allUsers = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserRole, (state, action) => {
      const {userRole} = action.payload;
      state.userRole = userRole;
    });
});

export {reducer};
