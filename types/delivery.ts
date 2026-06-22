export type DeliveryMovementListItem = {
  id: number;
  companyId: number;
  operationDate: string;
  clientId: number;
  clientCode: string;
  clientName: string;
  movementType: string;
  concept: string;
  totalCop: number;
  comment: string | null;
  referenceKey: string;
  createdAt: string;
};

export type DeliveryMovementDetail = DeliveryMovementListItem & {
  createdByUserId: string | null;
  updatedAt: string | null;
};

export type CreateDeliveryMovementPayload = {
  operationDate: string;
  clientId: number;
  movementType: string;
  concept: string;
  totalCop: number;
  referenceKey: string;
  comment?: string | null;
  companyId?: number | null;
};

export type UpdateDeliveryMovementPayload = {
  operationDate: string;
  clientId: number;
  movementType: string;
  concept: string;
  totalCop: number;
  referenceKey: string;
  comment?: string | null;
};

export type DeliveryClientSummary = {
  companyId: number;
  clientId: number;
  clientCode: string;
  porPagarTotal: number;
  pagadoTotal: number;
  saldoPriorYear: number;
  porPagarCurrentYear: number;
  pagadoCurrentYear: number;
  saldoCurrentYear: number;
  saldoTotal: number;
};

export const DELIVERY_MOVEMENT_TYPES = [
  "Pago",
  "Compra",
  "Salida",
  "Entrada",
] as const;

export type DeliveryMovementType = (typeof DELIVERY_MOVEMENT_TYPES)[number];
