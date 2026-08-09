export type AppModule = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  route?: string | null;
  icon?: string | null;
  sortOrder: number;
  parentModuleId?: number | null;
  isActive: boolean;
};

export type AppPermission = {
  id: number;
  moduleId: number;
  code: string;
  name: string;
  description?: string | null;
  action: string;
  isActive: boolean;
  moduleCode?: string | null;
  moduleName?: string | null;
};

export type CreateModulePayload = {
  code: string;
  name: string;
  description?: string | null;
  route?: string | null;
  icon?: string | null;
  sortOrder?: number;
  parentModuleId?: number | null;
  isActive?: boolean;
  seedCrudPermissions?: boolean;
};

export type UpdateModulePayload = {
  name?: string;
  description?: string | null;
  route?: string | null;
  icon?: string | null;
  sortOrder?: number;
  parentModuleId?: number | null;
  isActive?: boolean;
};

export type CreatePermissionPayload = {
  moduleId: number;
  code: string;
  name: string;
  description?: string | null;
  action: string;
  isActive?: boolean;
};

export type RolePermissionUpdatePayload = {
  roleId: string;
  permissionIds: number[];
};
