import Link from "next/link";
import CartLink from "@/components/CartLink";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            Kadai <span className="text-betel">&amp;</span> Co.
          </Link>
          <form action="/" className="order-3 flex w-full gap-2 sm:order-none sm:ml-6 sm:w-auto sm:flex-1 sm:max-w-md">
            <input name="q" className="input" placeholder="Search coffee, pepper, tawa…" aria-label="Search products" />
            <button className="btn btn-ghost">Search</button>
          </form>
          <div className="ml-auto">
            <CartLink />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="mt-12 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-mute">
          <span>Kadai &amp; Co. is a portfolio project. No real payments are taken.</span>
          <Link href="/admin" className="underline underline-offset-4 hover:text-ink">
            Staff sign in
          </Link>
        </div>
      </footer>
    </>
  );
}
