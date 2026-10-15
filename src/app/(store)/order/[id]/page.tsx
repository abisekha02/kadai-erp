import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Order, OrderItem } from "@/lib/types";
import { inr, invoiceNo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [order] = await query<Order>("select * from orders where id=$1", [id]);
  if (!order) notFound();
  const items = await query<OrderItem>("select * from order_items where order_id=$1 order by id", [id]);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl font-bold">Thank you, {order.customer_name.split(" ")[0]}.</h1>
      <p className="mt-2 text-mute">
        Order {invoiceNo(order.id)} is placed. We will pack it and ship to the address below. Pay when it arrives.
      </p>

      <ul className="panel mt-6 divide-y divide-line">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between gap-4 p-4 text-sm">
            <span>
              {i.name} <span className="text-mute">× {i.quantity}</span>
            </span>
            <span className="tabular-nums">{inr(i.unit_price * i.quantity)}</span>
          </li>
        ))}
        <li className="flex justify-between p-4 font-bold">
          <span>Total</span>
          <span className="tabular-nums">{inr(order.total)}</span>
        </li>
      </ul>

      <p className="mt-6 whitespace-pre-line text-sm text-mute">{order.address}</p>
      <Link href="/" className="btn btn-primary mt-6">
        Keep shopping
      </Link>
    </div>
  );
}
