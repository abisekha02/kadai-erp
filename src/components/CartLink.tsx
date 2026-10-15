"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="btn btn-accent">
      Cart
      <span className="rounded bg-ink px-1.5 text-xs text-white" aria-label={`${count} items`}>
        {ready ? count : 0}
      </span>
    </Link>
  );
}
