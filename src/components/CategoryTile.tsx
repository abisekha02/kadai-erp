import Link from "next/link";
import ProductImage from "./ProductImage";
import { photoKey } from "@/lib/photokey";
import { photoSrc } from "@/lib/photos";
import { tileColor } from "@/lib/format";
import type { Product } from "@/lib/types";

const TAMIL: Record<string, string> = {
  "Coffee & Tea": "காபி",
  Spices: "மசாலா",
  "Rice & Grains": "அரிசி",
  Snacks: "பலகாரம்",
  Kitchenware: "பாத்திரம்",
};

/** Round category tile. Uses a real product photo when one exists, otherwise Tamil lettering on a calm tint. */
export default function CategoryTile({ category, count, rep }: { category: string; count: number; rep?: Product }) {
  const hasPhoto = rep && (rep.image_url || photoSrc(`product-${photoKey(rep.name, rep.category)}`));
  return (
    <li>
      <Link href={`/?cat=${encodeURIComponent(category)}`} className="group flex flex-col items-center text-center">
        {hasPhoto && rep ? (
          <ProductImage
            name={rep.name}
            category={category}
            imageUrl={rep.image_url}
            compact
            sizes="(min-width: 640px) 150px, 30vw"
            className="aspect-square w-full max-w-[150px] rounded-full ring-2 ring-transparent transition group-hover:ring-terracotta"
          />
        ) : (
          <div
            aria-hidden
            className="tile-dots grid aspect-square w-full max-w-[150px] place-items-center rounded-full ring-2 ring-transparent transition group-hover:ring-terracotta"
            style={{ background: tileColor[category] ?? "#EFE6D2" }}
          >
            <span className="font-tamil text-[clamp(1.1rem,3.4vw,1.6rem)] font-bold text-ink" lang="ta">
              {TAMIL[category] ?? category[0]}
            </span>
          </div>
        )}
        <span className="mt-3 text-sm font-semibold leading-tight group-hover:underline">{category}</span>
        <span className="text-xs text-mute">{count} {count === 1 ? "item" : "items"}</span>
      </Link>
    </li>
  );
}
