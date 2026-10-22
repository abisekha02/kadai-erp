import Link from "next/link";
import Newsletter from "./Newsletter";

const perks = [
  { t: "Freshly packed", s: "Ground and sealed in small batches", d: "M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10zM12 8v6M9 11h6" },
  { t: "Free delivery", s: "On orders above ₹999", d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01" },
  { t: "Pay on delivery", s: "No card needed to order", d: "M4 6h16v12H4zM4 10h16M8 15h3" },
  { t: "Fair prices", s: "Straight from small producers", d: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.3 6.8 19l1-5.8L3.5 9.2l5.9-.9z" },
];

const cols = [
  { title: "Coffee & Tea", links: [["Filter coffee", "/?q=coffee"], ["Tea", "/?q=tea"], ["All coffee & tea", "/?cat=Coffee%20%26%20Tea"]] },
  { title: "Spices", links: [["Chilli powder", "/?q=chilli"], ["Black pepper", "/?q=pepper"], ["Cardamom", "/?q=cardamom"], ["All spices", "/?cat=Spices"]] },
  { title: "Rice & Grains", links: [["Ponni rice", "/?q=ponni"], ["Idli rice", "/?q=idli"], ["All rice & grains", "/?cat=Rice%20%26%20Grains"]] },
  { title: "Snacks", links: [["Murukku", "/?q=murukku"], ["Cashew", "/?q=cashew"], ["All snacks", "/?cat=Snacks"]] },
  { title: "Kitchenware", links: [["Dosa tawa", "/?q=tawa"], ["Brass tumbler", "/?q=tumbler"], ["Wet grinder", "/?q=grinder"], ["All kitchenware", "/?cat=Kitchenware"]] },
];

export default function SiteFooter() {
  return (
    <>
      <Newsletter />

      <section aria-label="Our promises" className="mt-12 border-y border-line bg-cream">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {perks.map((p) => (
            <li key={p.t} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-terracotta/10 text-terracotta">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={p.d} /></svg>
              </span>
              <div>
                <p className="font-semibold">{p.t}</p>
                <p className="text-sm text-mute">{p.s}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 lg:grid-cols-6">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-sm font-bold uppercase tracking-wide">{c.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-mute">
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-ink hover:underline">{label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="text-sm font-bold uppercase tracking-wide">Help</p>
            <ul className="mt-4 space-y-2.5 text-sm text-mute">
              <li><Link href="/track" className="hover:text-ink hover:underline">Order tracking</Link></li>
              <li><Link href="/wishlist" className="hover:text-ink hover:underline">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-ink hover:underline">Your cart</Link></li>
              <li><Link href="/credits" className="hover:text-ink hover:underline">Photo credits</Link></li>
              <li><Link href="/admin" className="hover:text-ink hover:underline">Staff sign in</Link></li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-mute">Madurai, Tamil Nadu, India<br />Delivery in 2 to 4 days</p>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-mute">
            <p>© {new Date().getFullYear()} Kadai &amp; Co. A portfolio project built with Next.js and PostgreSQL. No real payments are taken.</p>
            <p className="rounded-full border border-line px-3 py-1 font-semibold text-ink">Cash on delivery</p>
          </div>
        </div>
      </footer>
    </>
  );
}
