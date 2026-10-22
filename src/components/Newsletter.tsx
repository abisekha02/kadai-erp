"use client";

import { useState } from "react";
import { subscribe } from "@/app/actions";

export default function Newsletter() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("busy");
    setError("");
    const res = await subscribe(String(f.get("email") ?? ""), String(f.get("website") ?? ""));
    if (res.ok) setState("done");
    else {
      setError(res.error);
      setState("idle");
    }
  }

  return (
    <section aria-labelledby="nl-title" className="mx-auto mt-16 max-w-6xl px-4">
      <div className="hero-green relative overflow-hidden rounded-2xl px-6 py-10 text-white sm:px-12 sm:py-12">
        <span className="pointer-events-none absolute -right-4 -top-4 font-tamil text-[7rem] font-bold leading-none text-white/10" lang="ta" aria-hidden>வணக்கம்</span>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Stay in the loop</p>
        <h2 id="nl-title" className="mt-2 max-w-lg font-display text-3xl font-bold leading-tight sm:text-4xl">Join our newsletter for new arrivals and festival offers</h2>
        <p className="mt-2 max-w-md text-cream/80">One short email when something new lands in the pantry. Unsubscribe any time.</p>
        {state === "done" ? (
          <p role="status" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink">Thank you, you are on the list.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex max-w-lg flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="Your email address" className="min-w-0 flex-1 rounded-full border-0 bg-white px-5 py-3 text-sm text-ink placeholder:text-mute/70" />
            {/* Honeypot: real visitors never see or fill this field. */}
            <div className="absolute -left-[9999px]" aria-hidden>
              <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <button disabled={state === "busy"} className="btn btn-accent px-7 py-3 text-sm">{state === "busy" ? "Subscribing…" : "Subscribe"}</button>
          </form>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-sand">{error}</p>}
      </div>
    </section>
  );
}
