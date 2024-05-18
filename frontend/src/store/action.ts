import { createAction } from '@reduxjs/toolkit';
import { BaseUser, FullUser, Trainings, UserData } from '../types';
import {AuthorizationStatus} from '../const';

type LoadUsersPayload = {
  isLoading: boolean;
  data: BaseUser[];
};

type LoadTrainingsPayload = {
  isLoading: boolean;
  data: Trainings | null;
};

type LoadUserInfoPayload = {
  isLoading: boolean;
  data: FullUser | null;
};

export const loadUsers = createAction<LoadUsersPayload>('mainScreen/loadUsers');

export const loadUserInfo = createAction<LoadUserInfoPayload>('user/fullInfo');

export const loadTrainings = createAction<LoadTrainingsPayload>('mainScreen/loadTrainings');

export const requireAuthorization = createAction<AuthorizationStatus>('user/requireAuthorization');

export const setUserData = createAction<UserData>('user/data');

export const clearUserData = createAction('user/clearData');

export const setError = createAction<string | null>('data/setError');
