import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Product } from "@/lib/types";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();
  const [product] = await query<Product>("select * from products where id=$1", [id]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Edit {product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
