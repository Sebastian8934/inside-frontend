export type UserInfo = {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
};

export type LoginResponse = {
  expiresAt: string;
  user: UserInfo;
};
