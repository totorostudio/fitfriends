import { BaseUser, TokenPayload } from "src/libs/types";

export function createJWTPayload(user: BaseUser): TokenPayload {
  return {
    sub: user.id!,
    email: user.email,
    role: user.userRole,
    name: user.name,
    avatar: user.avatar,
    isReady: user.isReady,
  };
}
