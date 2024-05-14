import {State} from '../types';

export const getAuthorizationStatus = (state: State) => state.authorizationStatus;

export const getRole = (state: State) => state.userRole;

export const getUsers = (state: State) => state.allUsers.data;

export const getError = (state: State) => state.error;
