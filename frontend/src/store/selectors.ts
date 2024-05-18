import {State} from '../types';

export const getAuthorizationStatus = (state: State) => state.authorizationStatus;

export const getUserData = (state: State) => state.userData;

export const getUserInfo = (state: State) => state.userInfo;

export const getUsers = (state: State) => state.allUsers.data;

export const getTrainings = (state: State) => state.allTrainings.data;

export const getError = (state: State) => state.error;
