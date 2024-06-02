import { createAction } from '@reduxjs/toolkit';
import { Balances, CoachOrders, FullReview, FullTraining, FullUser, Notify, Trainings, UserData, Users } from '../types';
import {AuthorizationStatus} from '../const';

type LoadUsersPayload = {
  isLoading: boolean;
  data: Users | null;
};

type LoadTrainingPayload = {
  isLoading: boolean;
  data: FullTraining | null;
};

type LoadTrainingsPayload = {
  isLoading: boolean;
  data: Trainings | null;
};

type LoadReviewPayload = {
  isLoading: boolean;
  data: FullReview[] | null;
};

type LoadNotifyPayload = {
  isLoading: boolean;
  data: Notify[] | null;
};

type LoadBalancePayload = {
  isLoading: boolean;
  data: Balances | null;
};

type LoadOrdersPayload = {
  isLoading: boolean;
  data: CoachOrders | null;
};

type LoadUserPayload = {
  isLoading: boolean;
  data: FullUser | null;
};

export const loadUsers = createAction<LoadUsersPayload>('mainScreen/loadUsers');

export const loadFriends = createAction<LoadUsersPayload>('user/loadFriends');

export const loadUser = createAction<LoadUserPayload>('user/fullInfo');

export const loadTraining = createAction<LoadTrainingPayload>('training/loadTraining');

export const loadReview = createAction<LoadReviewPayload>('training/loadReview');

export const loadNotify = createAction<LoadNotifyPayload>('user/loadNotify');

export const loadBalance = createAction<LoadBalancePayload>('user/loadBalance');

export const loadOrders = createAction<LoadOrdersPayload>('coach/loadOrders');

export const loadCatalogTrainings = createAction<LoadTrainingsPayload>('myTrainingsPage/loadCatalogTrainings');

export const loadRelatedTrainings = createAction<LoadTrainingsPayload>('mainPage/loadRelatedTrainings');

export const loadFeaturedTrainings = createAction<LoadTrainingsPayload>('mainPage/loadFeaturedTrainings');

export const loadPopularTrainings = createAction<LoadTrainingsPayload>('mainPage/loadPopularTrainings');

export const requireAuthorization = createAction<AuthorizationStatus>('user/requireAuthorization');

export const setAuthUser = createAction<UserData>('user/authUser');

export const setActiveTraining = createAction<string | null>('user/activeTraining');

export const clearUserData = createAction('user/clearData');

export const setError = createAction<string | null>('data/setError');
