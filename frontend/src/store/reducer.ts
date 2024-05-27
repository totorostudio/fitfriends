import { createReducer } from '@reduxjs/toolkit';
import { loadUsers, loadCoachTrainings, requireAuthorization, setError, setAuthUser, loadUser, clearUserData, loadRelatedTrainings, loadFeaturedTrainings, loadPopularTrainings, loadTraining, loadReview, loadFriends, loadBalance, loadNotify } from './action';
import { Balances, FullUser, Notify, Reviews, Training, Trainings, UserData, UserRole, Users } from '../types';
import { AuthorizationStatus } from '../const';

type InitialState = {
  allUsers: {
    isLoading: boolean;
    data: Users | null;
  };
  friends: {
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
  notify: {
    isLoading: boolean;
    data: Notify[] | null;
  };
  balance: {
    isLoading: boolean;
    data: Balances | null;
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
  authUser: UserData;
  error: string | null;
};

const initialState: InitialState = {
  allUsers: {
    isLoading: false,
    data: null,
  },
  friends: {
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
  notify: {
    isLoading: false,
    data: null
  },
  balance: {
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
  authUser: {
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
    .addCase(loadFriends, (state, action) => {
      state.friends = action.payload;
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
    .addCase(loadNotify, (state, action) => {
      state.notify = action.payload;
    })
    .addCase(loadBalance, (state, action) => {
      state.balance = action.payload;
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
    .addCase(setAuthUser, (state, action) => {
      state.authUser = action.payload;
    })
    .addCase(clearUserData, (state) => {
      state.user = { isLoading: false, data: null };
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.authUser = {
        id: '',
        email: '',
        role: UserRole.Unknown,
      };
    });
});

export {reducer};
