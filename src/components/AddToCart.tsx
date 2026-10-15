"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type P = { id: number; name: string; price: number; category: string; image_url: string | null; stock: number };

export default function AddToCart({ p, withQty = false }: { p: P; withQty?: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (p.stock <= 0) {
    return (
      <button className="btn btn-ghost w-full" disabled>
        Sold out
      </button>
    );
  }

  const onAdd = () => {
    add({ id: p.id, name: p.name, price: p.price, category: p.category, image: p.image_url }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="flex items-center gap-2">
      {withQty && (
        <div className="flex items-center rounded-lg border border-line bg-white">
          <button className="px-3 py-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
            −
          </button>
          <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
          <button className="px-3 py-2.5" onClick={() => setQty((q) => Math.min(p.stock, q + 1))} aria-label="Increase">
            +
          </button>
        </div>
      )}
      <button className={`btn flex-1 ${added ? "bg-betel text-white" : "btn-primary"}`} onClick={onAdd}>
        {added ? "✓ Added" : "Add to cart"}
      </button>
    </div>
  );
}
