import ProductArt from "./ProductArt";
import { tileColor } from "@/lib/format";

/** Shows the product photo if an image URL is set, otherwise the illustrated artwork. */
export default function ProductImage({
  name,
  category,
  imageUrl,
  className = "",
  artClassName = "h-full w-full p-4",
}: {
  name: string;
  category: string;
  imageUrl?: string | null;
  className?: string;
  artClassName?: string;
}) {
  return (
    <div className={`tile-dots relative overflow-hidden ${className}`} style={{ background: tileColor[category] ?? "#E5E5DC" }}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={name} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <ProductArt name={name} category={category} className={artClassName} />
      )}
    </div>
  );
}
