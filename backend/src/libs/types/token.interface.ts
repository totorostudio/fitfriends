export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
}
