import {State} from '../types';

export const getUsers = (state: State) => state.allUsers.data;

export const getError = (state: State) => state.error;
