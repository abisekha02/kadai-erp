import Link from "next/link";
import { query } from "@/lib/db";
import type { Order, Product } from "@/lib/types";
import { fmtDate, inr, invoiceNo } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [sales] = await query<{ revenue: number; orders: number; pending: number }>(
    `select coalesce(sum(total) filter (where status <> 'cancelled'),0)::int as revenue,
            (count(*) filter (where status <> 'cancelled'))::int as orders,
            (count(*) filter (where status = 'placed'))::int as pending
     from orders`,
  );
  const [inv] = await query<{ value: number; low: number }>(
    `select coalesce(sum(price*stock),0)::int as value,
            (count(*) filter (where active and stock <= reorder_level))::int as low
     from products`,
  );
  const week = await query<{ label: string; revenue: number }>(
    `select to_char(d,'Dy') as label, coalesce(sum(o.total),0)::int as revenue
     from generate_series(current_date - 6, current_date, interval '1 day') d
     left join orders o on o.created_at::date = d::date and o.status <> 'cancelled'
     group by d order by d`,
  );
  const lowStock = await query<Product>(
    "select * from products where active and stock <= reorder_level order by stock limit 6",
  );
  const recent = await query<Order>("select * from orders order by created_at desc limit 6");
  const max = Math.max(1, ...week.map((w) => w.revenue));

  const stats = [
    { label: "Revenue", value: inr(sales.revenue), bar: "bg-betel" },
    { label: "Orders", value: String(sales.orders), bar: "bg-ink" },
    { label: "Awaiting packing", value: String(sales.pending), bar: "bg-turmeric" },
    { label: "Stock value (retail)", value: inr(inv.value), bar: "bg-brick" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel relative overflow-hidden p-5">
            <span className={`absolute inset-x-0 top-0 h-1 ${s.bar}`} />
            <dt className="text-sm text-mute">{s.label}</dt>
            <dd className="mt-1 font-display text-3xl font-bold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel p-5">
          <h2 className="font-semibold">Sales, last 7 days</h2>
          <div className="mt-4 flex h-44 items-end gap-3" role="img" aria-label="Bar chart of daily revenue">
            {week.map((w, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs tabular-nums text-mute">{w.revenue ? inr(w.revenue) : ""}</span>
                <div
                  className="w-full rounded-t bg-betel"
                  style={{ height: `${Math.max(2, (w.revenue / max) * 120)}px` }}
                />
                <span className="text-xs text-mute">{w.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Needs restocking ({inv.low})</h2>
            <Link href="/admin/purchases" className="text-sm underline underline-offset-4">
              Create purchase order
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-mute">Every product is above its reorder level.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between py-2 text-sm">
                  <span className="flex items-center gap-3">
                    <ProductImage name={p.name} category={p.category} imageUrl={p.image_url} className="h-9 w-9 shrink-0 rounded-lg" artClassName="h-full w-full p-0.5" />
                    {p.name}
                  </span>
                  <span className="font-semibold text-brick tabular-nums">
                    {p.stock} / {p.reorder_level}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel overflow-x-auto">
        <div className="flex items-baseline justify-between px-5 pt-5">
          <h2 className="font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm underline underline-offset-4">
            All orders
          </Link>
        </div>
        <table className="mt-3 w-full">
          <thead>
            <tr>
              <th className="th">Invoice</th>
              <th className="th">Customer</th>
              <th className="th">Date</th>
              <th className="th">Status</th>
              <th className="th text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id}>
                <td className="td">
                  <Link href={`/admin/orders/${o.id}`} className="underline underline-offset-4">
                    {invoiceNo(o.id)}
                  </Link>
                </td>
                <td className="td">{o.customer_name}</td>
                <td className="td">{fmtDate(o.created_at)}</td>
                <td className="td capitalize">{o.status}</td>
                <td className="td text-right tabular-nums">{inr(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
