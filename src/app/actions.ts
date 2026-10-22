"use server";

import { getClient, query } from "@/lib/db";

type Input = {
  name: string;
  email: string;
  phone: string;
  address: string;
  lines: { id: number; qty: number }[];
};

type Result = { ok: true; orderId: number } | { ok: false; error: string };

/**
 * Places an order inside a single transaction:
 * rows are locked, prices are re-read from the database (never trusted from the
 * browser), stock is checked and decremented atomically.
 */
export async function placeOrder(input: Input): Promise<Result> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  const address = input.address?.trim();
  if (!name || !email || !address) return { ok: false, error: "Name, email and address are required." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Enter a valid email address." };

  const merged = new Map<number, number>();
  for (const l of input.lines ?? []) {
    const qty = Math.floor(Number(l.qty));
    if (!Number.isInteger(l.id) || !(qty >= 1 && qty <= 50)) continue;
    merged.set(l.id, (merged.get(l.id) ?? 0) + qty);
  }
  if (merged.size === 0) return { ok: false, error: "Your cart is empty." };

  const client = await getClient();
  try {
    await client.query("begin");
    const ids = [...merged.keys()];
    const { rows } = await client.query<{ id: number; name: string; price: number; stock: number }>(
      "select id, name, price, stock from products where id = any($1) and active order by id for update",
      [ids],
    );
    if (rows.length !== ids.length) {
      await client.query("rollback");
      return { ok: false, error: "A product in your cart is no longer available." };
    }

    let total = 0;
    for (const p of rows) {
      const qty = merged.get(p.id)!;
      if (p.stock < qty) {
        await client.query("rollback");
        return { ok: false, error: `Only ${p.stock} left of ${p.name}. Reduce the quantity and try again.` };
      }
      total += p.price * qty;
    }

    const order = await client.query<{ id: number }>(
      "insert into orders(customer_name,email,phone,address,total) values($1,$2,$3,$4,$5) returning id",
      [name, email, input.phone?.trim() ?? "", address, total],
    );
    const orderId = order.rows[0].id;

    for (const p of rows) {
      const qty = merged.get(p.id)!;
      await client.query(
        "insert into order_items(order_id,product_id,name,unit_price,quantity) values($1,$2,$3,$4,$5)",
        [orderId, p.id, p.name, p.price, qty],
      );
      await client.query("update products set stock = stock - $1 where id = $2", [qty, p.id]);
    }

    await client.query("commit");
    return { ok: true, orderId };
  } catch (e) {
    await client.query("rollback").catch(() => {});
    console.error("placeOrder failed", e);
    return { ok: false, error: "Could not place the order. Please try again." };
  } finally {
    client.release();
  }
}

export type SubscribeResult = { ok: true } | { ok: false; error: string };

/** Newsletter sign-up. Stored in the `subscribers` table and visible to staff in the admin. */
export async function subscribe(email: string, honeypot = ""): Promise<SubscribeResult> {
  if (honeypot.trim()) return { ok: true }; // bots fill the hidden field; pretend success
  const e = (email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(e) || e.length > 200) return { ok: false, error: "Enter a valid email address." };
  try {
    await query("insert into subscribers(email) values($1) on conflict (email) do nothing", [e]);
    return { ok: true };
  } catch (err) {
    console.error("subscribe failed", err);
    return { ok: false, error: "Could not subscribe right now. Please try again." };
  }
}

export type TrackResult =
  | { ok: true; order: { id: number; status: string; total: number; created: string; name: string }; items: { name: string; qty: number; price: number }[] }
  | { ok: false; error: string };

/** Order tracking: the order number and the email used at checkout must both match. */
export async function trackOrder(orderNo: string, email: string): Promise<TrackResult> {
  const id = Number(String(orderNo).replace(/\D/g, ""));
  const e = (email ?? "").trim().toLowerCase();
  if (!Number.isInteger(id) || id < 1 || !e) return { ok: false, error: "Enter your order number and the email you used at checkout." };
  const rows = await query<{ id: number; status: string; total: number; created_at: Date; customer_name: string }>(
    "select id, status, total, created_at, customer_name from orders where id=$1 and lower(email)=$2",
    [id, e],
  );
  if (!rows[0]) return { ok: false, error: "We could not find an order with that number and email." };
  const items = await query<{ name: string; quantity: number; unit_price: number }>(
    "select name, quantity, unit_price from order_items where order_id=$1 order by id",
    [id],
  );
  const o = rows[0];
  return {
    ok: true,
    order: { id: o.id, status: o.status, total: o.total, created: new Date(o.created_at).toISOString(), name: o.customer_name },
    items: items.map((i) => ({ name: i.name, qty: i.quantity, price: i.unit_price })),
  };
}
