import Link from "next/link";
import { presentPhotos, HERO_CREDIT } from "@/lib/photos";

export const metadata = { title: "Photo credits | Kadai & Co." };

export default function Credits() {
  const photos = presentPhotos();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Photo credits</h1>
      <p className="mt-3 text-mute">
        Thank you to the photographers whose work appears on this site, used under the licenses shown.
      </p>

      {photos.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-white p-6 text-mute">
          This site currently uses its own illustrations and does not display any third-party photographs.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
          {photos.map((p) => {
            const c = p.credit ?? (p.slot === "hero-banana-leaf" ? HERO_CREDIT : undefined);
            return (
              <li key={p.slot} className="p-5">
                <p className="font-semibold">{p.label}</p>
                {c ? (
                  <p className="mt-1 text-sm text-mute">
                    Photo by {c.author} · {c.license} ·{" "}
                    <a href={c.source} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                      Source
                    </a>
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-brick">Credit details have not been added yet.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/" className="btn btn-primary mt-8">Back to the store</Link>
    </div>
  );
}
