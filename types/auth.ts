export type UserInfo = {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
};

export type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  user: UserInfo;
};
