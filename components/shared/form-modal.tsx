"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

export type FormModalSize = "xs" | "sm" | "md" | "lg";

const SIZE_CLASSES: Record<FormModalSize, string> = {
  xs: "max-w-[calc(100%-2rem)] sm:max-w-[min(92vw,28rem)]",
  sm: "max-w-[calc(100%-2rem)] sm:max-w-[min(85vw,42rem)]",
  md: "max-w-[calc(100%-2rem)] sm:max-w-[min(80vw,72rem)]",
  lg: "max-w-[calc(100%-2rem)] sm:max-w-[min(88vw,96rem)]",
};

type FormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: FormModalSize;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
  footer,
  className,
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex w-full flex-col gap-0 overflow-hidden p-0",
          SIZE_CLASSES[size],
          className,
        )}
      >
        <DialogHeader className="shrink-0 border-b border-gray-100 px-6 py-4 text-left">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="max-h-[min(85vh,900px)] min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

type FormModalSectionProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function FormModalSection({
  title,
  children,
  className,
}: FormModalSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {title ? (
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  );
}

type FormModalFooterProps = {
  children: ReactNode;
  className?: string;
};

export function FormModalFooter({ children, className }: FormModalFooterProps) {
  return (
    <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}>
      {children}
    </div>
  );
}
