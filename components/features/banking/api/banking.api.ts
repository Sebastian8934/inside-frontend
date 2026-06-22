import {
  createAccountHolder,
  createBankMovement,
  deleteBankMovement,
  fetchAccountHolders,
  fetchBankMovementSummary,
  fetchBankMovements,
  updateAccountHolder,
  updateBankMovement,
} from "@/lib/api/banking";

export type {
  AccountHolderFilters,
  BankMovementFilters,
  BankSummaryFilters,
} from "@/lib/api/banking";

export {
  fetchAccountHolders as fetchAccountHoldersApi,
  createAccountHolder as createAccountHolderApi,
  updateAccountHolder as updateAccountHolderApi,
  fetchBankMovements as fetchBankMovementsApi,
  fetchBankMovementSummary as fetchBankMovementSummaryApi,
  createBankMovement as createBankMovementApi,
  updateBankMovement as updateBankMovementApi,
  deleteBankMovement as deleteBankMovementApi,
};
