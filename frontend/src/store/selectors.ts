import {State} from '../types';

export const getAuthorizationStatus = (state: State) => state.authorizationStatus;

export const getUserData = (state: State) => state.userData;

export const getUser = (state: State) => state.user.data;

export const getUsers = (state: State) => state.allUsers.data;

export const getTraining = (state: State) => state.training.data;

export const getReview = (state: State) => state.review;

export const getCoachTrainings = (state: State) => state.coachTrainings.data;

export const getRelatedTrainings = (state: State) => state.relatedTrainings.data;

export const getFeaturedTrainings = (state: State) => state.featuredTrainings.data;

export const getPopularTrainings = (state: State) => state.popularTrainings.data;

export const getError = (state: State) => state.error;
