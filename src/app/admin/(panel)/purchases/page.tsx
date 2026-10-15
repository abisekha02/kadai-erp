import { query } from "@/lib/db";
import type { Product } from "@/lib/types";
import { fmtDate, inr } from "@/lib/format";
import { createPurchase, createSupplier, receivePurchase } from "../../actions";

export const dynamic = "force-dynamic";

type Supplier = { id: number; name: string; city: string; phone: string };
type PO = {
  id: number;
  supplier: string;
  product: string;
  quantity: number;
  unit_cost: number;
  status: "ordered" | "received";
  created_at: Date;
};

export default async function Purchasing() {
  const suppliers = await query<Supplier>("select * from suppliers order by name");
  const products = await query<Product>("select * from products order by name");
  const pos = await query<PO>(
    `select po.id, s.name as supplier, p.name as product, po.quantity, po.unit_cost, po.status, po.created_at
     from purchase_orders po
     join suppliers s on s.id = po.supplier_id
     join products p on p.id = po.product_id
     order by po.status, po.created_at desc`,
  );

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Purchasing</h1>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel p-5">
          <h2 className="font-semibold">New purchase order</h2>
          {suppliers.length === 0 ? (
            <p className="mt-3 text-sm text-mute">Add a supplier first, then you can order stock from them.</p>
          ) : (
            <form action={createPurchase} className="mt-4 space-y-3">
              <div>
                <label className="label" htmlFor="supplier_id">Supplier</label>
                <select id="supplier_id" name="supplier_id" className="input">
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="product_id">Product</label>
                <select id="product_id" name="product_id" className="input">
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (stock {p.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="quantity">Quantity</label>
                  <input id="quantity" name="quantity" type="number" min={1} defaultValue={20} className="input" required />
                </div>
                <div>
                  <label className="label" htmlFor="unit_cost">Unit cost (₹)</label>
                  <input id="unit_cost" name="unit_cost" type="number" min={0} defaultValue={0} className="input" required />
                </div>
              </div>
              <button className="btn btn-primary">Create purchase order</button>
            </form>
          )}
        </section>

        <section className="panel p-5">
          <h2 className="font-semibold">Suppliers</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {suppliers.map((s) => (
              <li key={s.id} className="py-2">
                <span className="font-medium">{s.name}</span>
                <span className="text-mute">
                  {" "}
                  {s.city}
                  {s.phone && `, ${s.phone}`}
                </span>
              </li>
            ))}
          </ul>
          <form action={createSupplier} className="mt-4 grid grid-cols-3 gap-2">
            <input name="name" className="input col-span-3" placeholder="Supplier name" required aria-label="Supplier name" />
            <input name="city" className="input" placeholder="City" aria-label="City" />
            <input name="phone" className="input" placeholder="Phone" aria-label="Phone" />
            <button className="btn btn-ghost">Add supplier</button>
          </form>
        </section>
      </div>

      <section className="panel overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">PO</th>
              <th className="th">Supplier</th>
              <th className="th">Product</th>
              <th className="th text-right">Qty</th>
              <th className="th text-right">Cost</th>
              <th className="th">Created</th>
              <th className="th">Status</th>
            </tr>
          </thead>
          <tbody>
            {pos.length === 0 && (
              <tr>
                <td className="td text-mute" colSpan={7}>
                  No purchase orders yet. Create one to restock low items.
                </td>
              </tr>
            )}
            {pos.map((po) => (
              <tr key={po.id}>
                <td className="td">PO-{String(po.id).padStart(4, "0")}</td>
                <td className="td">{po.supplier}</td>
                <td className="td">{po.product}</td>
                <td className="td text-right tabular-nums">{po.quantity}</td>
                <td className="td text-right tabular-nums">{inr(po.quantity * po.unit_cost)}</td>
                <td className="td">{fmtDate(po.created_at)}</td>
                <td className="td">
                  {po.status === "received" ? (
                    <span className="text-betel">Received</span>
                  ) : (
                    <form action={receivePurchase}>
                      <input type="hidden" name="id" value={po.id} />
                      <button className="btn btn-accent py-1">Mark received</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
