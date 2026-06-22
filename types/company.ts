export type CompanyListItem = {
  id: number;
  name: string;
  taxId: string | null;
  isActive: boolean;
};

export type CompanyContext = {
  userId: string;
  role: string;
  defaultCompanyId: number;
  activeCompanyId: number | null;
  accessibleCompanies: CompanyListItem[];
};
