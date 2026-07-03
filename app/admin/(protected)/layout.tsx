import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/app/lib/auth";
import { logout } from "../actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/maravi-logo.png" alt="Maravi Group" width={120} height={28} />
          <span className="text-sm font-medium text-zinc-500">Admin</span>
        </Link>
        <form action={logout}>
          <button type="submit" className="text-sm text-zinc-500 hover:text-zinc-900">
            Log out
          </button>
        </form>
      </header>
      <main className="flex-1 bg-zinc-50 px-6 py-8">{children}</main>
    </div>
  );
}
