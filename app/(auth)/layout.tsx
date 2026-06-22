import { GuestGuard } from "@/components/auth/guest-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="flex min-h-full items-center justify-center bg-inside-content p-4">
        {children}
      </div>
    </GuestGuard>
  );
}
