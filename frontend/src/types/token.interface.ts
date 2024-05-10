import { UserRole } from 'src/libs/types';

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
  avatar: string;
  isReady: boolean;
}
