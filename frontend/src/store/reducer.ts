import { createReducer } from '@reduxjs/toolkit';
import { loadUsers, loadCoachTrainings, requireAuthorization, setError, setUserData, loadUser, clearUserData, loadRelatedTrainings, loadFeaturedTrainings, loadPopularTrainings, loadTraining, loadReview } from './action';
import { FullUser, Reviews, Training, Trainings, UserData, UserRole, Users } from '../types';
import { AuthorizationStatus } from '../const';

type InitialState = {
  allUsers: {
    isLoading: boolean;
    data: Users | null;
  };
  user: {
    isLoading: boolean;
    data: FullUser | null;
  };
  training: {
    isLoading: boolean;
    data: Training | null;
  };
  review: {
    isLoading: boolean;
    data: Reviews | null;
  };
  coachTrainings: {
    isLoading: boolean;
    data: Trainings | null;
  };
  relatedTrainings: {
    isLoading: boolean;
    data: Trainings | null;
  };
  featuredTrainings: {
    isLoading: boolean;
    data: Trainings | null;
  };
  popularTrainings: {
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
    data: null,
  },
  user: {
    isLoading: false,
    data: null
  },
  training: {
    isLoading: false,
    data: null
  },
  review: {
    isLoading: false,
    data: null
  },
  coachTrainings: {
    isLoading: false,
    data: null
  },
  relatedTrainings: {
    isLoading: false,
    data: null
  },
  featuredTrainings: {
    isLoading: false,
    data: null
  },
  popularTrainings: {
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
    .addCase(loadUser, (state, action) => {
      state.user = action.payload;
    })
    .addCase(loadTraining, (state, action) => {
      state.training = action.payload;
    })
    .addCase(loadReview, (state, action) => {
      state.review = action.payload;
    })
    .addCase(loadCoachTrainings, (state, action) => {
      state.coachTrainings = action.payload;
    })
    .addCase(loadRelatedTrainings, (state, action) => {
      state.relatedTrainings = action.payload;
    })
    .addCase(loadFeaturedTrainings, (state, action) => {
      state.featuredTrainings = action.payload;
    })
    .addCase(loadPopularTrainings, (state, action) => {
      state.popularTrainings = action.payload;
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
      state.user = { isLoading: false, data: null };
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.userData = {
        id: '',
        email: '',
        role: UserRole.Unknown,
      };
    });
});

export {reducer};
