import {createReducer} from '@reduxjs/toolkit';
import {loadUsers, loadTrainings, requireAuthorization, setError, setUserData, loadUserInfo, clearUserData} from './action';
import {BaseUser, FullUser, Trainings, UserData, UserRole} from '../types';
import { AuthorizationStatus } from '../const';

type InitialState = {
  allUsers: {
    isLoading: boolean;
    data: BaseUser[];
  };
  userInfo: {
    isLoading: boolean;
    data: FullUser | null;
  };
  allTrainings: {
    isLoading: boolean;
    data: Trainings | null;
  };
  authorizationStatus: AuthorizationStatus;
  userData: UserData;
  error: string | null;
};

const initialState: InitialState = {
  allUsers: {
    isLoading: false,
    data: [],
  },
  userInfo: {
    isLoading: false,
    data: null
  },
  allTrainings: {
    isLoading: false,
    data: null
  },
  authorizationStatus: AuthorizationStatus.Unknown,
  userData: {
    id: '',
    email: '',
    role: UserRole.Unknown,
  },
  error: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadUsers, (state, action) => {
      state.allUsers = action.payload;
    })
    .addCase(loadUserInfo, (state, action) => {
      state.userInfo = action.payload;
    })
    .addCase(loadTrainings, (state, action) => {
      state.allTrainings = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setUserData, (state, action) => {
      state.userData = action.payload;
    })
    .addCase(clearUserData, (state) => {
      state.userInfo = { isLoading: false, data: null };
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.userData = {
        id: '',
        email: '',
        role: UserRole.Unknown,
      };
    });
});

export {reducer};
