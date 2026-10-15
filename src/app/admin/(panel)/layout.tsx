import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/purchases", label: "Purchasing" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-line bg-ink text-white md:min-h-screen md:w-56 md:border-b-0 print:hidden">
        <div className="flex items-center justify-between px-4 py-4 md:block">
          <p className="font-display text-xl font-bold">Kadai ERP</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-0">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-white/10">
              {n.label}
            </Link>
          ))}
          <Link href="/" className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10">
            View store
          </Link>
          <form action={logout}>
            <button className="w-full rounded-md px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10">
              Sign out
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 overflow-x-auto bg-chalk p-5 md:p-8">{children}</main>
    </div>
  );
}
