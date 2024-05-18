import { UserRole } from "./helper.enum";

export type UserData = {
  id: string;
  email: string;
  role: UserRole;
  accessToken?: string;
  refreshToken?: string;
};
