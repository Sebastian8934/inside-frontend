export type UserInfo = {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
};

export type LoginResponse = {
  expiresAt: string;
  user: UserInfo;
};
