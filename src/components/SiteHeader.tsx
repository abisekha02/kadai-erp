import Link from "next/link";
import HeaderLinks from "./HeaderLinks";
import DropdownNav from "./DropdownNav";
import { CATEGORIES } from "@/lib/types";

const catLinks = CATEGORIES.map((c) => ({ href: `/?cat=${encodeURIComponent(c)}`, label: c }));
const allLinks = [{ href: "/?shop=all", label: "All products" }, ...catLinks];

export default function SiteHeader() {
  return (
    <>
      {/* Top bar */}
      <div className="border-b border-line bg-white text-xs text-mute">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <p className="truncate">Free delivery on orders above ₹999 · Ships within 2 days from Madurai · Pay on delivery</p>
          <ul className="hidden shrink-0 items-center gap-5 whitespace-nowrap sm:flex">
            <li><Link href="/wishlist" className="hover:text-ink hover:underline">Wishlist</Link></li>
            <li><Link href="/track" className="hover:text-ink hover:underline">Order tracking</Link></li>
            <li><Link href="/admin" className="hover:text-ink hover:underline">Staff sign in</Link></li>
          </ul>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
        {/* Main row */}
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:gap-5">
          <DropdownNav label="Open menu" iconOnly className="md:hidden" panelClassName="w-60" items={[{ href: "/", label: "Home" }, ...allLinks, { href: "/track", label: "Order tracking" }, { href: "/wishlist", label: "Wishlist" }]} />
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Kadai & Co. home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-xl font-bold text-sand">K</span>
            <span className="leading-none">
              <span className="block font-display text-xl font-bold tracking-tight sm:text-2xl">Kadai &amp; Co.</span>
              <span className="mt-0.5 hidden text-[11px] font-medium uppercase tracking-[0.16em] text-mute sm:block">Online pantry store</span>
            </span>
          </Link>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-2 pr-4 xl:flex" aria-label="Ships from Madurai">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-chalk text-terracotta">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-mute">Ships from</span>
              <span className="block text-sm font-semibold">Madurai, TN</span>
            </span>
          </div>

          <form action="/" role="search" className="order-last hidden flex-1 md:order-none md:flex">
            <div className="flex w-full overflow-hidden rounded-full border border-line bg-white focus-within:border-ink">
              <label htmlFor="hdr-q" className="sr-only">Search products</label>
              <input id="hdr-q" name="q" placeholder="Search for products…" className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-sm outline-none placeholder:text-mute/70" />
              <label htmlFor="hdr-cat" className="sr-only">Category</label>
              <select id="hdr-cat" name="cat" defaultValue="" className="hidden max-w-[10rem] border-l border-line bg-chalk py-2.5 pl-4 pr-2 text-sm outline-none lg:block">
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button className="bg-ink px-5 text-sm font-semibold text-white hover:bg-forest">Search</button>
            </div>
          </form>

          <div className="ml-auto md:ml-0"><HeaderLinks /></div>
        </div>

        {/* Mobile search */}
        <form action="/" role="search" className="px-4 pb-3 md:hidden">
          <div className="flex overflow-hidden rounded-full border border-line bg-white focus-within:border-ink">
            <label htmlFor="m-q" className="sr-only">Search products</label>
            <input id="m-q" name="q" placeholder="Search for products…" className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-mute/70" />
            <button className="bg-ink px-5 text-sm font-semibold text-white">Search</button>
          </div>
        </form>

        {/* Nav row */}
        <nav aria-label="Main" className="hidden border-t border-line bg-white md:block">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
            <DropdownNav label="All categories" items={allLinks} panelClassName="w-72" />
            <ul className="flex items-center gap-1 text-sm font-semibold">
              <li><Link href="/" className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-chalk">Home</Link></li>
              <li><Link href="/?shop=all" className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-chalk">Shop</Link></li>
              {catLinks.map((c) => (
                <li key={c.label} className="hidden xl:block"><Link href={c.href} className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-chalk">{c.label}</Link></li>
              ))}
              <li><Link href="/track" className="whitespace-nowrap rounded-full px-3 py-2 hover:bg-chalk">Track order</Link></li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
