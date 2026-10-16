import Link from "next/link";
import Photo from "./Photo";
import type { DishSlot } from "@/lib/photos";

/** Promo banner: a photo with a text overlay. Without a photo it falls back to a calm tinted panel with Tamil lettering. */
export default function PromoCard({
  d,
  eyebrow,
  title,
  cta = "Shop now",
  className = "aspect-[16/9]",
  sizes = "(min-width: 1024px) 380px, 90vw",
}: {
  d: DishSlot;
  eyebrow: string;
  title: string;
  cta?: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={d.href}
      className={`group relative block overflow-hidden rounded-2xl text-white ${className}`}
      style={{ background: d.tint }}
    >
      <Photo
        slot={d.slot}
        alt={d.alt}
        sizes={sizes}
        className="transition duration-500 group-hover:scale-105"
        fallback={
          <div className="tile-lotus absolute inset-0" aria-hidden>
            <span className="absolute right-5 top-4 font-tamil text-4xl font-bold text-white/20 sm:text-5xl" lang="ta">{d.tamil}</span>
          </div>
        }
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" aria-hidden />
      <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand">{eyebrow}</p>
        <h3 className="mt-1 max-w-[16rem] font-display text-2xl font-bold leading-tight">{title}</h3>
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink group-hover:bg-sand">
          {cta} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
