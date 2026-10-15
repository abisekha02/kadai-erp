import Link from "next/link";
import CartLink from "@/components/CartLink";
import { CATEGORIES } from "@/lib/types";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-turmeric text-center text-xs font-semibold text-ink">
        <p className="px-4 py-2">Free delivery on orders above ₹999 · Pay on delivery · Packed fresh in Madurai</p>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-xl font-bold text-turmeric">K</span>
            <span className="font-display text-2xl font-bold tracking-tight">
              Kadai <span className="text-betel">&amp;</span> Co.
            </span>
          </Link>

          <form action="/" className="order-3 flex w-full gap-2 sm:order-none sm:flex-1 sm:max-w-md">
            <input name="q" className="input rounded-full px-4" placeholder="Search coffee, pepper, tawa…" aria-label="Search products" />
            <button className="btn btn-primary rounded-full px-5">Search</button>
          </form>

          <div className="ml-auto">
            <CartLink />
          </div>
        </div>
        <nav className="border-t border-line/70">
          <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-1.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/?cat=${encodeURIComponent(c)}#shop`} className="block whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-chalk hover:underline">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="mt-20 bg-ink text-white/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-bold text-white">
              Kadai <span className="text-turmeric">&amp;</span> Co.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              Small-batch coffee, spices, grains and kitchenware from across Tamil Nadu and Kerala, packed in Madurai and sent to your door.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link href={`/?cat=${encodeURIComponent(c)}#shop`} className="hover:text-white hover:underline">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Help</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Delivery in 2–4 days</li>
              <li>Cash on delivery</li>
              <li>Easy returns</li>
              <li>
                <Link href="/admin" className="hover:text-white hover:underline">
                  Staff sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60">
          Kadai &amp; Co. is a portfolio project built with Next.js and PostgreSQL. No real payments are taken.
        </div>
      </footer>
    </>
  );
}
