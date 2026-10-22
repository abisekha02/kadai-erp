"use client";

import { useState } from "react";
import { trackOrder, type TrackResult } from "@/app/actions";
import { inr, invoiceNo } from "@/lib/format";

const STEPS = ["placed", "packed", "shipped", "delivered"];

export default function TrackForm() {
  const [res, setRes] = useState<TrackResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setRes(await trackOrder(String(f.get("order") ?? ""), String(f.get("email") ?? "")));
    setBusy(false);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="order">Order number</label>
            <input id="order" name="order" className="input" placeholder="For example INV-00032 or 32" required inputMode="numeric" />
          </div>
          <div>
            <label className="label" htmlFor="track-email">Email used at checkout</label>
            <input id="track-email" name="email" type="email" className="input" required autoComplete="email" />
          </div>
        </div>
        <button className="btn btn-primary mt-5" disabled={busy}>{busy ? "Checking…" : "Track order"}</button>
      </form>

      {res && !res.ok && (
        <p role="alert" className="mt-5 rounded-xl bg-brick/10 p-4 text-sm text-brick">{res.error}</p>
      )}

      {res && res.ok && (
        <div className="mt-5 rounded-2xl border border-line bg-white p-5 sm:p-6" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-bold">{invoiceNo(res.order.id)}</h2>
            <p className="text-sm text-mute">Placed {new Date(res.order.created).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          {res.order.status === "cancelled" ? (
            <p className="mt-4 rounded-lg bg-brick/10 p-3 text-sm font-semibold text-brick">This order was cancelled.</p>
          ) : (
            <ol className="mt-5 grid grid-cols-4 gap-2 text-center text-xs sm:text-sm" aria-label="Order progress">
              {STEPS.map((s, k) => {
                const done = STEPS.indexOf(res.order.status) >= k;
                return (
                  <li key={s}>
                    <span className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${done ? "bg-betel text-white" : "bg-chalk text-mute ring-1 ring-line"}`} aria-hidden>{done ? "✓" : k + 1}</span>
                    <span className={`mt-2 block capitalize ${done ? "font-semibold text-ink" : "text-mute"}`}>{s}<span className="sr-only">{done ? " (done)" : " (pending)"}</span></span>
                  </li>
                );
              })}
            </ol>
          )}
          <ul className="mt-5 divide-y divide-line border-t border-line text-sm">
            {res.items.map((i, k) => (
              <li key={k} className="flex justify-between gap-4 py-2.5">
                <span>{i.name} <span className="text-mute">× {i.qty}</span></span>
                <span className="tabular-nums">{inr(i.price * i.qty)}</span>
              </li>
            ))}
            <li className="flex justify-between py-3 font-bold"><span>Total</span><span className="tabular-nums">{inr(res.order.total)}</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}
