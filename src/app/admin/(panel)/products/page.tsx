import Link from "next/link";
import { query } from "@/lib/db";
import type { Product } from "@/lib/types";
import { inr } from "@/lib/format";
import { toggleProduct } from "../../actions";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export default async function Inventory() {
  const products = await query<Product>("select * from products order by category, name");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Inventory</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>

      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">Product</th>
              <th className="th">Category</th>
              <th className="th text-right">Price</th>
              <th className="th text-right">Stock</th>
              <th className="th text-right">Reorder at</th>
              <th className="th">Listing</th>
              <th className="th" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const low = p.stock <= p.reorder_level;
              return (
                <tr key={p.id} className={p.active ? "" : "opacity-50"}>
                  <td className="td font-medium">
                    <div className="flex items-center gap-3">
                      <ProductImage name={p.name} category={p.category} imageUrl={p.image_url} compact sizes="48px" className="h-11 w-11 shrink-0 rounded-lg" />
                      {p.name}
                    </div>
                  </td>
                  <td className="td">{p.category}</td>
                  <td className="td text-right tabular-nums">{inr(p.price)}</td>
                  <td className={`td text-right font-semibold tabular-nums ${low ? "text-brick" : ""}`}>
                    {p.stock}
                    {low && <span className="ml-1 text-xs font-normal">low</span>}
                  </td>
                  <td className="td text-right tabular-nums">{p.reorder_level}</td>
                  <td className="td">
                    <form action={toggleProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-sm underline underline-offset-4">
                        {p.active ? "Hide from store" : "Show in store"}
                      </button>
                    </form>
                  </td>
                  <td className="td">
                    <Link href={`/admin/products/${p.id}`} className="text-sm underline underline-offset-4">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
