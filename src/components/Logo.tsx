/** HaqSaathi mark: a check inside a rounded square (navy + marigold). */
export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden>
      <rect width="34" height="34" rx="9" fill="#10214a" />
      <path d="M10 18l4.5 4.5L24.5 12" stroke="#f2b544" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`text-xl font-extrabold tracking-tight ${dark ? "text-white" : "text-brand-900"}`}>
      Haq<span className="text-accent-500">Saathi</span>
    </span>
  );
}
