"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type P = { id: number; name: string; price: number; emoji: string; stock: number };

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
    add({ id: p.id, name: p.name, price: p.price, emoji: p.emoji }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="flex items-center gap-2">
      {withQty && (
        <div className="flex items-center rounded-md border border-line bg-white">
          <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
            −
          </button>
          <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
          <button className="px-3 py-2" onClick={() => setQty((q) => Math.min(p.stock, q + 1))} aria-label="Increase">
            +
          </button>
        </div>
      )}
      <button className="btn btn-primary flex-1" onClick={onAdd}>
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
