import Link from "next/link";
import Photo from "./Photo";
import type { DishSlot } from "@/lib/photos";

export default function DishCard({ d }: { d: DishSlot }) {
  return (
    <li>
      <Link href={d.href} className="group block overflow-hidden rounded-2xl border border-line bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_-12px_rgba(43,27,18,0.3)]">
        <div className="relative aspect-[4/3] overflow-hidden" style={{ background: d.tint }}>
          <Photo
            slot={d.slot}
            alt={d.alt}
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            className="transition duration-500 group-hover:scale-105"
            fallback={
              <div className="tile-lotus flex h-full w-full flex-col items-center justify-center gap-1 text-cream">
                <span className="max-w-full px-3 text-center font-tamil text-4xl font-bold leading-tight sm:text-[2.6rem]" lang="ta">{d.tamil}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/80">{d.tag}</span>
              </div>
            }
          />
          <span className="absolute inset-x-0 bottom-0 h-1.5 temple-border temple-border-thin" aria-hidden />
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-bold leading-snug">{d.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-mute">{d.blurb}</p>
          <p className="mt-3 text-sm font-semibold text-betel group-hover:underline">{d.cta} →</p>
        </div>
      </Link>
    </li>
  );
}
