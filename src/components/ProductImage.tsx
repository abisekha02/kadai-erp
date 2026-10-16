import Image from "next/image";
import ProductArt, { artFor } from "./ProductArt";
import { tileColor } from "@/lib/format";
import { photoSrc } from "@/lib/photos";

/**
 * Image order for a product:
 * 1) the photo URL a staff member set in the admin,
 * 2) a local product photo in /public/photos (product-<type>.webp) if one exists,
 * 3) the built-in illustration.
 */
export default function ProductImage({
  name,
  category,
  imageUrl,
  className = "",
  artClassName = "h-full w-full p-4",
  sizes = "(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw",
}: {
  name: string;
  category: string;
  imageUrl?: string | null;
  className?: string;
  artClassName?: string;
  sizes?: string;
}) {
  const local = photoSrc(`product-${artFor(name, category)}`);
  return (
    <div className={`tile-dots relative overflow-hidden ${className}`} style={{ background: tileColor[category] ?? "#EADFC6" }}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : local ? (
        <Image src={local} alt={name} fill sizes={sizes} quality={78} className="object-cover" />
      ) : (
        <ProductArt name={name} category={category} className={artClassName} />
      )}
    </div>
  );
}
