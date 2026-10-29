import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/purchases", label: "Purchasing" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-shell min-h-screen md:flex">
      <aside className="admin-sidebar border-b border-line bg-ink text-white md:min-h-screen md:w-60 md:border-b-0 print:hidden">
        <div className="flex items-center justify-between px-4 py-4 md:block">
          <p className="flex items-center gap-2.5 font-display text-xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-sand text-base text-ink">K</span> Kadai ERP
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-0">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="admin-nav-link whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-white/10">
              {n.label}
            </Link>
          ))}
          <Link href="/" className="admin-nav-link whitespace-nowrap rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10">
            View store
          </Link>
          <form action={logout}>
            <button className="admin-nav-link w-full rounded-md px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10">
              Sign out
            </button>
          </form>
        </nav>
      </aside>
      <main className="admin-main min-w-0 flex-1 overflow-x-auto p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}
