import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Order, OrderItem } from "@/lib/types";
import { fmtDate, inr, invoiceNo } from "@/lib/format";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function Invoice({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [o] = await query<Order>("select * from orders where id=$1", [id]);
  if (!o) notFound();
  const items = await query<OrderItem>("select * from order_items where order_id=$1 order by id", [id]);

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/admin/orders" className="text-sm underline underline-offset-4">
          Back to orders
        </Link>
        <PrintButton />
      </div>

      <article className="panel p-8 print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-bold">Kadai &amp; Co.</p>
            <p className="text-sm text-mute">Madurai, Tamil Nadu</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-lg font-bold">{invoiceNo(o.id)}</p>
            <p className="text-mute">{fmtDate(o.created_at)}</p>
            <p className="capitalize">Status: {o.status}</p>
          </div>
        </header>

        <section className="mt-8 text-sm">
          <p className="text-mute">Billed to</p>
          <p className="font-medium">{o.customer_name}</p>
          <p>{o.email}</p>
          {o.phone && <p>{o.phone}</p>}
          <p className="whitespace-pre-line">{o.address}</p>
        </section>

        <table className="mt-8 w-full">
          <thead>
            <tr>
              <th className="th">Item</th>
              <th className="th text-right">Qty</th>
              <th className="th text-right">Unit price</th>
              <th className="th text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td className="td">{i.name}</td>
                <td className="td text-right tabular-nums">{i.quantity}</td>
                <td className="td text-right tabular-nums">{inr(i.unit_price)}</td>
                <td className="td text-right tabular-nums">{inr(i.unit_price * i.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="px-3 py-3 text-right font-semibold">
                Total due
              </td>
              <td className="px-3 py-3 text-right text-lg font-bold tabular-nums">{inr(o.total)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-6 text-xs text-mute">Payment: cash on delivery.</p>
      </article>
    </div>
  );
}
