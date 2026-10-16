import Link from "next/link";

export default function SectionHeading({
  title,
  sub,
  href,
  hrefLabel = "View all",
}: {
  title: string;
  sub?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-mute">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold hover:border-ink">
          {hrefLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
