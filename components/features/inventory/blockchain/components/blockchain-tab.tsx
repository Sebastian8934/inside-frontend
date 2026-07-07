"use client";

import { useState } from "react";
import { Loader2, Link2, Plus, Unlink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBlockchainList } from "@/components/features/inventory/blockchain/hooks/use-blockchain-list";
import { useBlockchainMatchForm } from "@/components/features/inventory/blockchain/hooks/use-blockchain-match-form";
import { useBlockchainMutations } from "@/components/features/inventory/blockchain/hooks/use-blockchain-mutations";
import { useBlockchainTransactionForm } from "@/components/features/inventory/blockchain/hooks/use-blockchain-transaction-form";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useConfirmAction } from "@/hooks/use-confirm-action";
import {
  formatUsdt,
  truncateHash,
  usdtColorClass,
} from "@/lib/utils/format";

export function BlockchainTab() {
  const companyId = useActiveCompanyId();
  const [createOpen, setCreateOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);

  const { data, isLoading } = useBlockchainList({ companyId });
  const { unmatchTransaction } = useBlockchainMutations(companyId);
  const { requestConfirm, confirmDialogProps } = useConfirmAction();

  const createForm = useBlockchainTransactionForm({
    open: createOpen,
    companyId,
    onSuccess: () => setCreateOpen(false),
  });

  const matchForm = useBlockchainMatchForm({
    open: matchOpen,
    transactionId: selectedTxId,
    companyId,
    onSuccess: () => setMatchOpen(false),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Registrar hash
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {!isLoading && data?.length === 0 ? (
            <EmptyState message="No hay transacciones blockchain registradas." />
          ) : null}
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash</TableHead>
                  <TableHead>Monto USDT</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Movimiento</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{truncateHash(tx.txHash, 10, 8)}</TableCell>
                    <TableCell className={usdtColorClass(tx.amountUsdt)}>
                      {formatUsdt(tx.amountUsdt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.matchStatus === "Matched" ? "default" : "secondary"
                        }
                      >
                        {tx.matchStatus === "Matched"
                          ? "Conciliado"
                          : "Sin conciliar"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tx.usdtInventoryMovementId
                        ? `#${tx.usdtInventoryMovementId} ${tx.movementClientCode ?? ""}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {tx.matchStatus === "Unmatched" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTxId(tx.id);
                              setMatchOpen(true);
                            }}
                          >
                            <Link2 className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              requestConfirm({
                                title: "¿Desvincular transacción?",
                                description:
                                  "La transacción blockchain dejará de estar asociada al movimiento de inventario.",
                                confirmLabel: "Desvincular",
                                onConfirm: () =>
                                  unmatchTransaction.mutate(tx.id),
                              })
                            }
                          >
                            <Unlink className="size-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>

      <FormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        size="xs"
        title="Registrar transacción blockchain"
        description="Ingresa el hash y el monto USDT de la transacción."
        footer={
          <FormModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="blockchain-create-form"
              disabled={createForm.isSubmitting}
            >
              {createForm.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Registrar"
              )}
            </Button>
          </FormModalFooter>
        }
      >
        <Form {...createForm.form}>
          <form
            id="blockchain-create-form"
            onSubmit={createForm.form.handleSubmit(createForm.handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={createForm.form.control}
              name="txHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TxHash</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.form.control}
              name="amountUsdt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto USDT</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="tabular-nums"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FormModal>

      <FormModal
        open={matchOpen}
        onOpenChange={setMatchOpen}
        size="xs"
        title="Conciliar transacción"
        description="Vincula esta transacción con un movimiento de inventario por ID."
        footer={
          <FormModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setMatchOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="blockchain-match-form"
              disabled={matchForm.isSubmitting}
            >
              {matchForm.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Conciliar"
              )}
            </Button>
          </FormModalFooter>
        }
      >
        <Form {...matchForm.form}>
          <form
            id="blockchain-match-form"
            onSubmit={matchForm.form.handleSubmit(matchForm.handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={matchForm.form.control}
              name="usdtInventoryMovementId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID movimiento inventario</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="tabular-nums"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FormModal>

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
