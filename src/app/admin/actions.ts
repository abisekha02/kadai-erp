"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getClient, query } from "@/lib/db";
import { requireAdmin, signIn, signOut } from "@/lib/auth";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

const int = (v: FormDataEntryValue | null, fallback = 0) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? n : fallback;
};
const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();

export async function login(formData: FormData) {
  const expected = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "admin123" : "");
  if (expected && str(formData.get("password")) === expected) {
    await signIn();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logout() {
  signOut();
  redirect("/admin/login");
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = int(formData.get("id"));
  const values = [
    str(formData.get("name")),
    str(formData.get("category")),
    str(formData.get("description")),
    Math.max(0, int(formData.get("price"))),
    Math.max(0, int(formData.get("stock"))),
    Math.max(0, int(formData.get("reorder_level"), 10)),
    str(formData.get("emoji")) || "📦",
  ];
  if (!values[0] || !values[1]) redirect("/admin/products");

  if (id) {
    await query(
      `update products set name=$1, category=$2, description=$3, price=$4, stock=$5,
       reorder_level=$6, emoji=$7 where id=$8`,
      [...values, id],
    );
  } else {
    await query(
      `insert into products(name,category,description,price,stock,reorder_level,emoji)
       values($1,$2,$3,$4,$5,$6,$7)`,
      values,
    );
  }
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function toggleProduct(formData: FormData) {
  await requireAdmin();
  await query("update products set active = not active where id = $1", [int(formData.get("id"))]);
  revalidatePath("/", "layout");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const orderId = int(formData.get("id"));
  const next = str(formData.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(next)) return;

  const client = await getClient();
  try {
    await client.query("begin");
    const cur = await client.query<{ status: OrderStatus }>(
      "select status from orders where id=$1 for update",
      [orderId],
    );
    const prev = cur.rows[0]?.status;
    if (!prev || prev === "cancelled" || prev === next) {
      await client.query("rollback");
      return;
    }
    if (next === "cancelled") {
      // put the stock back
      await client.query(
        `update products p set stock = p.stock + oi.quantity
         from order_items oi where oi.order_id = $1 and oi.product_id = p.id`,
        [orderId],
      );
    }
    await client.query("update orders set status=$1 where id=$2", [next, orderId]);
    await client.query("commit");
  } catch (e) {
    await client.query("rollback").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  revalidatePath("/admin", "layout");
}

export async function createSupplier(formData: FormData) {
  await requireAdmin();
  const name = str(formData.get("name"));
  if (!name) return;
  await query("insert into suppliers(name,city,phone) values($1,$2,$3)", [
    name,
    str(formData.get("city")),
    str(formData.get("phone")),
  ]);
  revalidatePath("/admin/purchases");
}

export async function createPurchase(formData: FormData) {
  await requireAdmin();
  const supplier = int(formData.get("supplier_id"));
  const product = int(formData.get("product_id"));
  const qty = int(formData.get("quantity"));
  const cost = int(formData.get("unit_cost"));
  if (!supplier || !product || qty < 1 || cost < 0) return;
  await query(
    "insert into purchase_orders(supplier_id,product_id,quantity,unit_cost) values($1,$2,$3,$4)",
    [supplier, product, qty, cost],
  );
  revalidatePath("/admin/purchases");
}

export async function receivePurchase(formData: FormData) {
  await requireAdmin();
  const id = int(formData.get("id"));
  const client = await getClient();
  try {
    await client.query("begin");
    const po = await client.query<{ product_id: number; quantity: number }>(
      `update purchase_orders set status='received', received_at=now()
       where id=$1 and status='ordered' returning product_id, quantity`,
      [id],
    );
    if (po.rows[0]) {
      await client.query("update products set stock = stock + $1 where id = $2", [
        po.rows[0].quantity,
        po.rows[0].product_id,
      ]);
    }
    await client.query("commit");
  } catch (e) {
    await client.query("rollback").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
}
