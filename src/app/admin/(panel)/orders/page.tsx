import Link from "next/link";
import { query } from "@/lib/db";
import { ORDER_STATUSES, type Order } from "@/lib/types";
import { fmtDate, inr, invoiceNo } from "@/lib/format";
import { updateOrderStatus } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Orders({ searchParams }: { searchParams: { status?: string } }) {
  const filter = ORDER_STATUSES.includes(searchParams.status as never) ? searchParams.status! : "";
  const orders = await query<Order>(
    "select * from orders where ($1 = '' or status = $1) order by created_at desc limit 200",
    [filter],
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Orders</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {["", ...ORDER_STATUSES].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`rounded-full border px-3 py-1 text-sm capitalize ${
              filter === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:bg-[#ecece5]"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">Invoice</th>
              <th className="th">Customer</th>
              <th className="th">Date</th>
              <th className="th text-right">Total</th>
              <th className="th">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td className="td text-mute" colSpan={5}>
                  No orders with this status yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="td">
                  <Link href={`/admin/orders/${o.id}`} className="underline underline-offset-4">
                    {invoiceNo(o.id)}
                  </Link>
                </td>
                <td className="td">
                  {o.customer_name}
                  <div className="text-xs text-mute">{o.email}</div>
                </td>
                <td className="td">{fmtDate(o.created_at)}</td>
                <td className="td text-right tabular-nums">{inr(o.total)}</td>
                <td className="td">
                  {o.status === "cancelled" ? (
                    <span className="text-brick">Cancelled</span>
                  ) : (
                    <form action={updateOrderStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status} className="input w-auto py-1 capitalize" aria-label={`Status for ${invoiceNo(o.id)}`}>
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button className="btn btn-ghost py-1">Update</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
