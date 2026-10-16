import Link from "next/link";
import CartLink from "./CartLink";
import DropdownNav from "./DropdownNav";
import { CATEGORIES } from "@/lib/types";

const catLinks = CATEGORIES.map((c) => ({ href: `/?cat=${encodeURIComponent(c)}`, label: c }));

export default function SiteHeader() {
  return (
    <>
      <div className="bg-ink text-xs text-cream/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <p>Free delivery on orders above ₹999 · Pay on delivery</p>
          <p className="hidden items-center gap-4 sm:flex">
            <span>Packed fresh in Madurai, Tamil Nadu</span>
            <Link href="/admin" className="underline-offset-4 hover:underline">Staff sign in</Link>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:gap-6">
          <DropdownNav
            label="Open menu"
            iconOnly
            className="md:hidden"
            panelClassName="w-60"
            items={[{ href: "/", label: "Home" }, { href: "/#shop", label: "All products" }, ...catLinks]}
          />
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Kadai & Co. home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-xl font-bold text-sand">K</span>
            <span className="leading-none">
              <span className="block font-display text-xl font-bold tracking-tight sm:text-2xl">Kadai &amp; Co.</span>
              <span className="mt-0.5 hidden text-[11px] font-medium uppercase tracking-[0.16em] text-mute sm:block">South Indian pantry</span>
            </span>
          </Link>

          <form action="/" role="search" className="order-last hidden flex-1 md:order-none md:flex">
            <div className="flex w-full overflow-hidden rounded-full border border-line bg-white focus-within:border-ink">
              <label htmlFor="hdr-cat" className="sr-only">Category</label>
              <select id="hdr-cat" name="cat" defaultValue="" className="max-w-[10rem] border-r border-line bg-chalk py-2.5 pl-4 pr-2 text-sm outline-none">
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <label htmlFor="hdr-q" className="sr-only">Search products</label>
              <input id="hdr-q" name="q" placeholder="Search for coffee, pepper, tawa…" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-mute/70" />
              <button className="bg-ink px-5 text-sm font-semibold text-white hover:bg-forest">Search</button>
            </div>
          </form>

          <div className="ml-auto md:ml-0">
            <CartLink />
          </div>
        </div>

        <form action="/" role="search" className="px-4 pb-3 md:hidden">
          <div className="flex overflow-hidden rounded-full border border-line bg-white focus-within:border-ink">
            <label htmlFor="m-q" className="sr-only">Search products</label>
            <input id="m-q" name="q" placeholder="Search for coffee, pepper, tawa…" className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-mute/70" />
            <button className="bg-ink px-5 text-sm font-semibold text-white">Search</button>
          </div>
        </form>

        <nav aria-label="Main" className="hidden border-t border-line md:block">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
            <DropdownNav label="Browse categories" items={catLinks} />
            <ul className="flex items-center gap-1 text-sm font-medium">
              <li><Link href="/" className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-chalk">Home</Link></li>
              <li><Link href="/#shop" className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-chalk">All products</Link></li>
              {catLinks.map((c) => (
                <li key={c.label} className="hidden lg:block"><Link href={c.href} className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-chalk">{c.label}</Link></li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
