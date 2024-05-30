import { createReducer } from '@reduxjs/toolkit';
import { loadUsers, loadCoachTrainings, requireAuthorization, setError, setAuthUser, loadUser, clearUserData, loadRelatedTrainings, loadFeaturedTrainings, loadPopularTrainings, loadTraining, loadReview, loadFriends, loadBalance, loadNotify, setActiveTraining, loadOrders } from './action';
import { Balances, CoachOrders, FullReview, FullTraining, FullUser, Notify, Trainings, UserData, UserRole, Users } from '../types';
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
    data: FullTraining | null;
  };
  review: {
    isLoading: boolean;
    data: FullReview[] | null;
  };
  notify: {
    isLoading: boolean;
    data: Notify[] | null;
  };
  balance: {
    isLoading: boolean;
    data: Balances | null;
  };
  orders: {
    isLoading: boolean;
    data: CoachOrders | null;
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
  activeTraining: string | null;
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
  orders: {
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
  activeTraining: null,
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
    .addCase(loadOrders, (state, action) => {
      state.orders = action.payload;
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
    .addCase(setActiveTraining, (state, action) => {
      state.activeTraining = action.payload;
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
