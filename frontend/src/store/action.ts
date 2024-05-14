import { createAction } from '@reduxjs/toolkit';
import { BaseUser } from '../types';
import {AuthorizationStatus} from '../const';

type LoadUsersPayload = {
  isLoading: boolean;
  data: BaseUser[];
};

export const loadUsers = createAction<LoadUsersPayload>('mainScreen/loadUsers');

export const requireAuthorization = createAction<AuthorizationStatus>('user/requireAuthorization');

export const setUserRole = createAction<{userRole: string}>('user/role');

export const setError = createAction<string | null>('data/setError');
