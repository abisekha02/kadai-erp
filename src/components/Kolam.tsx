/** A small kolam-inspired divider. Decorative only. */
export default function Kolam({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-turmeric ${className}`} aria-hidden>
      <span className="h-px w-16 bg-current opacity-50 sm:w-32" />
      <svg viewBox="0 0 60 24" className="h-6 w-14" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="30" cy="12" r="2.2" fill="currentColor" stroke="none" />
        <ellipse cx="30" cy="12" rx="9" ry="4.5" />
        <ellipse cx="30" cy="12" rx="4.5" ry="9" />
        <circle cx="9" cy="12" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="51" cy="12" r="1.8" fill="currentColor" stroke="none" />
        <path d="M14 12h6M40 12h6" />
      </svg>
      <span className="h-px w-16 bg-current opacity-50 sm:w-32" />
    </div>
  );
}
