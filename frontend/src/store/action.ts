import { createAction } from '@reduxjs/toolkit';
import { BaseUser } from '../types';

type LoadUsersPayload = {
  isLoading: boolean;
  data: BaseUser[];
};

export const loadUsers = createAction<LoadUsersPayload>('mainScreen/loadUsers');

export const setError = createAction<string | null>('data/setError');
