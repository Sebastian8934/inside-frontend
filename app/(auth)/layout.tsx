import { GuestGuard } from "@/components/auth/guest-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="flex min-h-dvh w-full items-center justify-center bg-inside-content p-4 sm:p-6">
        {children}
      </div>
    </GuestGuard>
  );
}
