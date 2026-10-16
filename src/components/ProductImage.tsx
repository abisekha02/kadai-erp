import Image from "next/image";
import { photoKey } from "@/lib/photokey";
import { tileColor } from "@/lib/format";
import { photoSrc } from "@/lib/photos";

/**
 * Image order for a product:
 * 1) the photo URL staff set in the admin,
 * 2) a local photo in /public/photos (product-<type>.webp) if one exists,
 * 3) a calm monogram tile (never a broken image, never clip art).
 */
export default function ProductImage({
  name,
  category,
  imageUrl,
  className = "",
  sizes = "(min-width: 1024px) 260px, (min-width: 640px) 30vw, 46vw",
  priority = false,
  compact = false,
}: {
  name: string;
  category: string;
  imageUrl?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Small thumbnails (cart, admin): the fallback shows a monogram instead of a label. */
  compact?: boolean;
}) {
  const local = photoSrc(`product-${photoKey(name, category)}`);
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: tileColor[category] ?? "#EFE6D2" }}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : local ? (
        <Image src={local} alt={name} fill sizes={sizes} priority={priority} quality={78} className="object-cover" />
      ) : (
        <div role="img" aria-label={name} className="tile-dots flex h-full w-full items-center justify-center">
          {compact ? (
            <span aria-hidden className="font-display text-lg font-bold tracking-wide text-ink/40">{initials}</span>
          ) : (
            <div aria-hidden className="m-[7%] flex h-[86%] w-[86%] flex-col items-center justify-between rounded-lg border border-ink/20 px-3 py-4 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-terracotta">{category}</span>
              <span className="line-clamp-4 font-display text-lg font-bold leading-tight text-ink sm:text-xl">{name}</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-mute">Kadai &amp; Co.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
