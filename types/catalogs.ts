export type Client = {
  id: number;
  companyId: number;
  code: string;
  correctedName: string;
  isActive: boolean;
};

export type ClientDetail = Client & {
  createdAt: string;
  updatedAt: string | null;
};

export type Wallet = {
  id: number;
  companyId: number;
  code: string;
  name: string;
  asset: string;
  network: string;
  walletType: string;
  platformId: number | null;
  isActive: boolean;
};

export type WalletDetail = Wallet & {
  address: string | null;
  usageDescription: string | null;
  referenceBalanceUsdt: number;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateWalletPayload = {
  code: string;
  name: string;
  network: string;
  walletType: string;
  asset?: string;
  address?: string | null;
  platformId?: number | null;
  usageDescription?: string | null;
  referenceBalanceUsdt?: number;
  companyId?: number | null;
};

export type UpdateWalletPayload = {
  code: string;
  name: string;
  network: string;
  walletType: string;
  asset: string;
  address?: string | null;
  platformId?: number | null;
  usageDescription?: string | null;
  referenceBalanceUsdt: number;
  isActive: boolean;
};

export type OtcCounterparty = {
  id: number;
  companyId: number;
  code: string;
  name: string;
  type: string;
  isActive: boolean;
};

export type OtcCounterpartyDetail = OtcCounterparty & {
  createdAt: string;
  updatedAt: string | null;
};

export type CreateOtcCounterpartyPayload = {
  code: string;
  name: string;
  type?: string;
  companyId?: number | null;
};

export type UpdateOtcCounterpartyPayload = {
  code: string;
  name: string;
  type: string;
  isActive: boolean;
};

export type Platform = {
  id: number;
  companyId: number;
  name: string;
  type: string;
  isActive: boolean;
};

export type PlatformDetail = Platform & {
  createdAt: string;
  updatedAt: string | null;
};

export type CreatePlatformPayload = {
  name: string;
  type: string;
  companyId?: number | null;
};

export type UpdatePlatformPayload = {
  name: string;
  type: string;
  isActive: boolean;
};

export type CommercialRep = {
  id: number;
  companyId: number;
  initials: string;
  fullName: string;
  isActive: boolean;
};

export type CommercialRepDetail = CommercialRep & {
  createdAt: string;
  updatedAt: string | null;
};

export type CreateCommercialRepPayload = {
  initials: string;
  fullName: string;
  companyId?: number | null;
};

export type UpdateCommercialRepPayload = {
  initials: string;
  fullName: string;
  isActive: boolean;
};

export type CreateClientPayload = {
  code: string;
  correctedName: string;
  companyId?: number | null;
};

export type UpdateClientPayload = {
  code: string;
  correctedName: string;
  isActive: boolean;
};
