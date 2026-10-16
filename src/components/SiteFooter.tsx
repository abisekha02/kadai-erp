import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

const perks = [
  { t: "Freshly packed", s: "Ground and sealed in small batches", d: "M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10zM12 8v6M9 11h6" },
  { t: "Free delivery", s: "On orders above ₹999", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01" },
  { t: "Pay on delivery", s: "No card needed to order", d: "M4 6h16v12H4zM4 10h16M8 15h3" },
  { t: "Easy returns", s: "Not right? We will make it right", d: "M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5" },
];

export default function SiteFooter() {
  return (
    <>
      <section aria-label="Our promises" className="mt-20 border-y border-line bg-cream">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {perks.map((p) => (
            <li key={p.t} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-terracotta/10 text-terracotta">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={p.d} />
                </svg>
              </span>
              <div>
                <p className="font-semibold">{p.t}</p>
                <p className="text-sm text-mute">{p.s}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="bg-ink text-cream/80">
        <div className="temple-border" aria-hidden />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2.5 font-display text-2xl font-bold text-white">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-xl text-ink">K</span>
              Kadai &amp; Co.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Small-batch coffee, spices, grains and kitchenware from Tamil Nadu and Kerala, packed in Madurai and delivered to your door.
            </p>
            <p className="mt-4 font-tamil text-sm text-sand" lang="ta">தென்னிந்திய சுவை</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c}><Link href={`/?cat=${encodeURIComponent(c)}`} className="hover:text-white hover:underline">{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Help</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>Delivery in 2 to 4 days</li>
              <li>Cash on delivery</li>
              <li>Easy returns</li>
              <li><Link href="/cart" className="hover:text-white hover:underline">Your cart</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Store</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>Madurai, Tamil Nadu, India</li>
              <li><Link href="/credits" className="hover:text-white hover:underline">Photo credits</Link></li>
              <li><Link href="/admin" className="hover:text-white hover:underline">Staff sign in</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-cream/60">
          © {new Date().getFullYear()} Kadai &amp; Co. A portfolio project built with Next.js and PostgreSQL. No real payments are taken.
        </div>
      </footer>
    </>
  );
}
