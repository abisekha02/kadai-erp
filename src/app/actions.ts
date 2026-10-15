"use server";

import { getClient } from "@/lib/db";

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
