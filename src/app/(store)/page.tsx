import Link from "next/link";
import { query } from "@/lib/db";
import { CATEGORIES, type Product } from "@/lib/types";
import { inr } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";
import CategoryBlock from "@/components/CategoryBlock";
import PromoCard from "@/components/PromoCard";
import SectionHeading from "@/components/SectionHeading";
import HeroSlider from "@/components/HeroSlider";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { HERO, dish } from "@/lib/photos";

export const dynamic = "force-dynamic";

type Row = Product & { sold: number };
const SORTS: Record<string, string> = { popular: "Popular", "price-asc": "Price: low to high", "price-desc": "Price: high to low" };

export default async function Home({ searchParams }: { searchParams: { q?: string; cat?: string; sort?: string; shop?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const cat = CATEGORIES.includes(searchParams.cat ?? "") ? searchParams.cat! : "";
  const sort = SORTS[searchParams.sort ?? ""] ? searchParams.sort! : "popular";
  const browsing = Boolean(q || cat || searchParams.shop === "all");

  const all = await query<Row>(
    `select p.*, coalesce(s.sold,0)::int as sold
     from products p
     left join (
       select oi.product_id, sum(oi.quantity) as sold
       from order_items oi join orders o on o.id = oi.order_id
       where o.status <> 'cancelled' group by oi.product_id
     ) s on s.product_id = p.id
     where p.active order by p.category, p.name`,
  );

  const byPopularity = (a: Row, b: Row) => b.sold - a.sold || a.name.localeCompare(b.name);
  const bestSellers = [...all].sort(byPopularity).slice(0, 8);
  const inCat = (c: string) => all.filter((p) => p.category === c).sort(byPopularity);
  const from = (c: string) => {
    const list = inCat(c);
    return list.length ? inr(Math.min(...list.map((p) => p.price))) : null;
  };

  /* ---------- Browse / search / filter view ---------- */
  if (browsing) {
    let products = all.filter(
      (p) => (!cat || p.category === cat) && (!q || `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
    else products = [...products].sort(byPopularity);

    const href = (over: { cat?: string; sort?: string }) => {
      const sp = new URLSearchParams();
      const c = over.cat ?? cat;
      if (c) sp.set("cat", c);
      if (q) sp.set("q", q);
      const so = over.sort ?? sort;
      if (so !== "popular") sp.set("sort", so);
      if (!c && !q) sp.set("shop", "all");
      return `/?${sp.toString()}`;
    };
    const chip = (label: string, active: boolean, to: string) => (
      <Link key={label} href={to} aria-current={active ? "true" : undefined}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>
        {label}
      </Link>
    );

    return (
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-mute">
          <Link href="/" className="hover:underline">Home</Link> / <span className="text-ink">{cat || (q ? "Search" : "All products")}</span>
        </nav>
        <section id="shop" aria-label="Products" className="scroll-mt-32">
          <SectionHeading title={q ? `Results for “${q}”` : cat || "All products"} sub={`${products.length} ${products.length === 1 ? "product" : "products"}`} />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {chip("All", !cat, href({ cat: "" }))}
              {CATEGORIES.map((c) => chip(c, cat === c, href({ cat: c })))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Sort products">
              <span className="text-mute">Sort:</span>
              {Object.entries(SORTS).map(([k, label]) => chip(label, sort === k, href({ sort: k })))}
            </div>
          </div>
          {products.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-line bg-white p-10 text-center text-mute">
              Nothing matches your search. Try another word or <Link href="/?shop=all" className="underline">clear the filters</Link>.
            </p>
          ) : (
            <Reveal as="ul" stagger className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </Reveal>
          )}
        </section>
      </div>
    );
  }

  /* ---------- Home ---------- */
  const shell = "grid min-h-[440px] w-full md:grid-cols-[1.1fr_1fr]";
  const textCol = "slide-text flex flex-col justify-center p-7 pb-16 sm:p-10 sm:pb-16 md:pb-10";
  const imgCol = "slide-img relative min-h-[260px] overflow-hidden md:rounded-l-[3rem]";
  const fallback = (word: string) => (
    <div className="tile-lotus flex h-full w-full items-center justify-center bg-terracotta/20" aria-hidden>
      <span className="font-tamil text-6xl font-bold text-clay/40" lang="ta">{word}</span>
    </div>
  );
  const slides = [
    <div key="s1" className={`${shell} bg-gradient-to-br from-[#FFF3D0] via-[#FFE8B5] to-[#FFD592] text-ink`}>
      <div className={textCol}>
        <p className="font-tamil text-base font-semibold text-clay" lang="ta">தென்னிந்திய சுவை</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">South Indian pantry · Madurai</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] sm:text-5xl">The flavours of the South, delivered.</h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink/80">Filter coffee, Guntur chilli, Idukki cardamom and the cast iron to cook it on. Small batches, packed fresh and priced fairly.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/?shop=all" className="btn btn-primary px-5 py-2.5 text-[15px]">Shop the pantry</Link>
          <a href="#bestsellers" className="btn border border-ink/25 bg-white/70 px-5 py-2.5 text-[15px] text-ink hover:bg-white">Best sellers</a>
        </div>
      </div>
      <div className={imgCol}>
        <Photo slot={HERO.slot} alt={HERO.alt} priority sizes="(min-width: 1024px) 400px, 100vw" fallback={fallback("சுவை")} />
      </div>
    </div>,
    <div key="s2" className={`${shell} bg-gradient-to-br from-[#E6F6DD] via-[#D6F0C8] to-[#C2E8B0] text-ink`}>
      <div className={textCol}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-betel">Coffee &amp; tea</p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-5xl">Filter coffee, ground the way you like it</h2>
        <p className="mt-4 max-w-md leading-relaxed text-ink/80">Chicory-blend roast for the South Indian filter, and Nilgiri leaf for a proper cup of tea.</p>
        {from("Coffee & Tea") && <p className="mt-4 text-lg font-bold text-clay">from {from("Coffee & Tea")}</p>}
        <div className="mt-6"><Link href="/?cat=Coffee%20%26%20Tea" className="btn btn-accent px-6 py-3 text-base">Shop coffee &amp; tea</Link></div>
      </div>
      <div className={imgCol}>
        <Photo slot="product-coffee" alt="Roasted coffee beans filling a white cup and saucer on an orange background" sizes="(min-width: 1024px) 400px, 100vw" fallback={fallback("காபி")} />
      </div>
    </div>,
    <div key="s3" className={`${shell} bg-gradient-to-br from-[#FFE6D4] via-[#FFD6BB] to-[#FFC29B] text-ink`}>
      <div className={textCol}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Kitchenware</p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-[1.08] sm:text-5xl">Cast iron and brass, built to last</h2>
        <p className="mt-4 max-w-md leading-relaxed text-ink/80">A dosa tawa that holds its heat, a brass tumbler and dabara, and a stone wet grinder for smooth batter.</p>
        {from("Kitchenware") && <p className="mt-4 text-lg font-bold text-clay">from {from("Kitchenware")}</p>}
        <div className="mt-6"><Link href="/?cat=Kitchenware" className="btn btn-primary px-6 py-3 text-base">Shop kitchenware</Link></div>
      </div>
      <div className={imgCol}>
        <Photo slot="product-tumbler" alt="A brass tumbler and dabara with frothy coffee on a wooden tray among coffee beans" sizes="(min-width: 1024px) 400px, 100vw" fallback={fallback("பாத்திரம்")} />
      </div>
    </div>,
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* 1. Hero slider + two side banners */}
      <section aria-label="Featured" className="grid gap-4 pt-6 lg:grid-cols-[2fr_1fr]">
        <HeroSlider slides={slides} />
        <Reveal stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <PromoCard d={dish("filter-coffee")} eyebrow="Kumbakonam style" title="Filter coffee, made right" className="aspect-[16/9] lg:aspect-auto lg:min-h-[200px]" />
          <PromoCard d={dish("sweets")} eyebrow="Festival favourites" title="Sweets & snacks for every occasion" className="aspect-[16/9] lg:aspect-auto lg:min-h-[200px]" />
        </Reveal>
      </section>

      {/* 2. Best sellers */}
      <section id="bestsellers" aria-label="Best sellers" className="mt-14 scroll-mt-32">
        <Reveal><SectionHeading title="Best sellers" sub="What other kitchens keep reordering." href="/?shop=all" /></Reveal>
        <Reveal as="ul" stagger className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {bestSellers.map((p, k) => <ProductCard key={p.id} p={p} badge={k < 3 && p.sold > 0 ? "Best seller" : undefined} />)}
        </Reveal>
      </section>

      {/* 3. Wide promo */}
      <section aria-label="Cash on delivery" className="mt-14">
        <Reveal>
          <div className="relative isolate flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFE9B8] to-[#FFCF85] px-7 py-8 text-ink sm:px-10">
            <div className="tile-lotus absolute inset-0 -z-10 opacity-40" aria-hidden />
            <h2 className="max-w-xl font-display text-2xl font-bold leading-snug sm:text-3xl">
              <span className="text-clay">Pay when it arrives.</span> Cash on delivery on every order, no card needed.
            </h2>
            <Link href="/?shop=all" className="btn btn-primary px-6 py-3 text-base">Shop now</Link>
          </div>
        </Reveal>
      </section>

      {/* 4. Category block: Spices */}
      <CategoryBlock category="Spices" eyebrow="Spices" title="Ground fresh, packed fresh" blurb="Guntur chilli, Tellicherry pepper and Idukki cardamom." tint="#B8501F" tamil="மசாலா" products={inCat("Spices")} />

      {/* 5. Promo trio */}
      <section aria-label="Cook the South" className="mt-14">
        <Reveal as="ul" stagger className="grid gap-4 md:grid-cols-3">
          <li><PromoCard d={dish("dosa-chutney")} eyebrow="Crisp & golden" title="Dosa night, sorted" cta="Shop dosa" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("idli-sambar")} eyebrow="Soft & steamed" title="Idli rice for fluffy idlis" cta="Shop idli rice" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("parotta-salna")} eyebrow="Layered & flaky" title="Spices for parotta & salna" cta="Shop spices" sizes="(min-width: 768px) 380px, 90vw" /></li>
        </Reveal>
      </section>

      {/* 6. Category block: Kitchenware */}
      <CategoryBlock category="Kitchenware" eyebrow="Kitchenware" title="Built to last a lifetime" blurb="Cast iron, brass and stone, the way kitchens here have always cooked." tint="#2F7D4F" tamil="பாத்திரம்" products={inCat("Kitchenware")} />

      {/* 7. Second promo trio */}
      <section aria-label="From the kitchens of the South" className="mt-14">
        <Reveal as="ul" stagger className="grid gap-4 md:grid-cols-3">
          <li><PromoCard d={dish("biryani")} eyebrow="Biryani night" title="Biryani rice, the proper way" cta="Shop rice" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("chettinad-chicken")} eyebrow="Karaikudi heat" title="Pepper & chilli for Chettinad" cta="Shop spices" sizes="(min-width: 768px) 380px, 90vw" /></li>
          <li><PromoCard d={dish("murukku")} eyebrow="Crunchy spirals" title="Murukku, fried fresh" cta="Shop snacks" sizes="(min-width: 768px) 380px, 90vw" /></li>
        </Reveal>
      </section>

      {/* 8. Shop by category */}
      <section aria-label="Shop by category" className="mt-16">
        <Reveal><SectionHeading title="Shop by category" sub="Everything for a South Indian kitchen." href="/?shop=all" hrefLabel="All products" /></Reveal>
        <Reveal as="ul" stagger className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-5">
          {CATEGORIES.map((c) => (
            <CategoryTile key={c} category={c} count={all.filter((p) => p.category === c).length} rep={all.find((p) => p.category === c)} />
          ))}
        </Reveal>
      </section>
    </div>
  );
}
