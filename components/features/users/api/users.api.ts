import { fetchRoles } from "@/lib/api/roles";
import {
  createUser,
  deactivateUser,
  fetchUsers,
  updateUser,
} from "@/lib/api/users";

export {
  fetchUsers as fetchUsersApi,
  createUser as createUserApi,
  updateUser as updateUserApi,
  deactivateUser as deactivateUserApi,
  fetchRoles as fetchRolesApi,
};
