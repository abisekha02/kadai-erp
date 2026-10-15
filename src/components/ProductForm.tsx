import { saveProduct } from "@/app/admin/actions";
import { CATEGORIES, type Product } from "@/lib/types";

export default function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={saveProduct} className="panel max-w-xl space-y-4 p-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div>
        <label className="label" htmlFor="name">Name</label>
        <input id="name" name="name" className="input" defaultValue={product?.name} required />
      </div>
      <div>
        <label className="label" htmlFor="category">Category</label>
        <select id="category" name="category" className="input" defaultValue={product?.category ?? CATEGORIES[0]}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="image_url">Photo URL (optional)</label>
        <input id="image_url" name="image_url" type="url" className="input" placeholder="https://… leave empty to use the illustration" defaultValue={product?.image_url ?? ""} />
        <p className="mt-1 text-xs text-mute">Paste a link to your own product photo. If empty, the store shows its built-in illustration.</p>
      </div>
      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} className="input" defaultValue={product?.description} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label" htmlFor="price">Price (₹)</label>
          <input id="price" name="price" type="number" min={0} className="input" defaultValue={product?.price ?? 0} required />
        </div>
        <div>
          <label className="label" htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min={0} className="input" defaultValue={product?.stock ?? 0} required />
        </div>
        <div>
          <label className="label" htmlFor="reorder_level">Reorder at</label>
          <input id="reorder_level" name="reorder_level" type="number" min={0} className="input" defaultValue={product?.reorder_level ?? 10} required />
        </div>
      </div>
      <button className="btn btn-primary">{product ? "Save changes" : "Add product"}</button>
    </form>
  );
}
