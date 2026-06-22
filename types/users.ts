export type UserDetail = {
  id: string;
  email: string;
  fullName: string;
  companyId: number;
  companyName: string;
  role: string;
  isActive: boolean;
  clientId: number | null;
  commercialRepId: number | null;
  companyAccessIds: number[];
};

export type RoleItem = {
  id: string;
  name: string;
  displayName: string;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  fullName: string;
  companyId: number;
  role: string;
  clientId?: number | null;
  commercialRepId?: number | null;
  companyIds?: number[] | null;
};

export type UpdateUserPayload = {
  fullName: string;
  companyId: number;
  role: string;
  isActive: boolean;
  clientId?: number | null;
  commercialRepId?: number | null;
  companyIds?: number[] | null;
};
