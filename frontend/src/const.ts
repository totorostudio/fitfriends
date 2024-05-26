export const BACKEND_URL = 'http://localhost:3000';

export const REQUEST_TIMEOUT = 5000;
export const TIMEOUT_SHOW_ERROR = 2000;
export const MESSAGE_SHORT_TIMEOUT = 750;
export const MESSAGE_LONG_TIMEOUT = 750;

export const DEFAULT_ITEMS_LIMIT = 4;

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum APIRoute {
  Login = '/api/auth/login',
  Logout = '/api/auth/logout',
  RegisterCustomer = '/api/auth/register-customer',
  RegisterCoach = '/api/auth/register-coach',
  Users = '/api/users',
  Training = '/api/training',
  Review = '/api/review',
  Friends = '/api/friends',
  Balance = '/api/balance',
  AddFriend = '/api/friends/add',
}

export enum AppRoute {
  Intro = '/',
  Login = '/login',
  Logout = '/logout',
  Register = '/register',
  QuestionnaireCoach = '/questionnaire-coach',
  QuestionnaireCustomer = '/questionnaire-customer',
  Main = '/main',
  AccountCoach = '/account-coach',
  AccountCustomer = '/account-customer',
  MyTrainings = '/my-trainings',
  Training = '/training/:id',
  TrainingUrl = '/training',
  Users = '/users',
  User = '/users/:id',
  Friends = '/friends',
  CreateTraining = '/create-training',
  Orders = '/my-orders',
  Purchases = '/my-purchases',
}
