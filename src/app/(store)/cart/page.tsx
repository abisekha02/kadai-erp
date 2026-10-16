"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { placeOrder } from "../../actions";
import { inr } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const { items, ready, total, setQty, remove, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!ready) return <p className="mx-auto max-w-6xl px-4 py-10 text-mute">Loading your cart…</p>;

  if (items.length === 0) {
    return (
      <div className="mx-auto my-10 max-w-xl rounded-2xl border border-line bg-white p-10 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-mute">Add a few things from the shop and they will show up here.</p>
        <Link href="/" className="btn btn-primary mt-5">
          Browse products
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const res = await placeOrder({
      name: String(f.get("name") ?? ""),
      email: String(f.get("email") ?? ""),
      phone: String(f.get("phone") ?? ""),
      address: String(f.get("address") ?? ""),
      lines: items.map((i) => ({ id: i.id, qty: i.qty })),
    });
    if (res.ok) {
      clear();
      router.push(`/order/${res.orderId}`);
    } else {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <section>
        <h1 className="font-display text-3xl font-bold">Your cart</h1>
        <ul className="panel mt-4 divide-y divide-line">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-4 p-4">
              <ProductImage name={i.name} category={i.category} imageUrl={i.image} compact sizes="64px" className="h-16 w-16 shrink-0 rounded-lg" />
              <div className="flex-1">
                <p className="font-medium">{i.name}</p>
                <p className="text-sm text-mute tabular-nums">{inr(i.price)} each</p>
              </div>
              <div className="flex items-center rounded-md border border-line">
                <button className="px-2.5 py-1" onClick={() => setQty(i.id, i.qty - 1)} aria-label={`Fewer ${i.name}`}>
                  −
                </button>
                <span className="w-7 text-center text-sm tabular-nums">{i.qty}</span>
                <button className="px-2.5 py-1" onClick={() => setQty(i.id, Math.min(50, i.qty + 1))} aria-label={`More ${i.name}`}>
                  +
                </button>
              </div>
              <p className="w-24 text-right font-semibold tabular-nums">{inr(i.price * i.qty)}</p>
              <button className="text-sm text-mute underline" onClick={() => remove(i.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={onSubmit} className="panel h-fit space-y-4 p-5">
        <h2 className="font-display text-xl font-bold">Delivery details</h2>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" className="input" required autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="input" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="address">Address</label>
          <textarea id="address" name="address" rows={3} className="input" required autoComplete="street-address" />
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-mute">Total</span>
          <span className="text-2xl font-bold tabular-nums">{inr(total)}</span>
        </div>
        {error && (
          <p role="alert" className="rounded-md bg-brick/10 p-3 text-sm text-brick">
            {error}
          </p>
        )}
        <button className="btn btn-accent w-full" disabled={busy}>
          {busy ? "Placing order…" : "Place order (cash on delivery)"}
        </button>
      </form>
    </div>
  );
}
