import { z } from "zod";

export const walletSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  asset: z.string().min(1, "Activo requerido"),
  network: z.string().min(1, "Red requerida"),
  walletType: z.string().min(1, "Tipo requerido"),
  address: z.string().optional(),
  platformId: z.number().nullable().optional(),
  usageDescription: z.string().max(500).optional(),
  referenceBalanceUsdt: z.number(),
  isActive: z.boolean().optional(),
});

export type WalletFormValues = z.infer<typeof walletSchema>;

export const walletDefaultValues: WalletFormValues = {
  code: "",
  name: "",
  asset: "USDT",
  network: "",
  walletType: "",
  address: "",
  platformId: null,
  usageDescription: "",
  referenceBalanceUsdt: 0,
  isActive: true,
};

export function walletToFormValues(
  wallet: {
    code: string;
    name: string;
    asset: string;
    network: string;
    walletType: string;
    platformId: number | null;
    isActive: boolean;
    address?: string | null;
    usageDescription?: string | null;
    referenceBalanceUsdt?: number;
  },
): WalletFormValues {
  return {
    code: wallet.code,
    name: wallet.name,
    asset: wallet.asset,
    network: wallet.network,
    walletType: wallet.walletType,
    address: wallet.address ?? "",
    platformId: wallet.platformId,
    usageDescription: wallet.usageDescription ?? "",
    referenceBalanceUsdt: wallet.referenceBalanceUsdt ?? 0,
    isActive: wallet.isActive,
  };
}
