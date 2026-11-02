/**
 * HaqSaathi mark: the letter H whose crossbar is a tick, on a navy tile.
 * H for HaqSaathi, the tick for "you qualify / it's done". Works from 16px (favicon) upwards.
 */
export default function Logo({ size = 36, tone = "navy" }: { size?: number; tone?: "navy" | "marigold" }) {
  const bg = tone === "navy" ? "#10214a" : "#f2b544";
  const bars = tone === "navy" ? "#ffffff" : "#10214a";
  const tick = tone === "navy" ? "#f2b544" : "#ffffff";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <rect width="40" height="40" rx="11" fill={bg} />
      <path d="M12.5 10.5v19M27.5 10.5v19" stroke={bars} strokeWidth="4" strokeLinecap="round" />
      <path d="M12.5 20.5l4.8 4.8 10.2-10.2" stroke={tick} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** "HaqSaathi" name. `onDark` for navy backgrounds. */
export function Wordmark({ onDark = false, className = "text-xl" }: { onDark?: boolean; className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${onDark ? "text-white" : "text-fg"} ${className}`}>
      Haq<span className="text-accent-500 dark:text-accent-400">Saathi</span>
    </span>
  );
}

/** Logo and name together, as used in the header and footer. */
export function Brand({ onDark = false, size = 36 }: { onDark?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo size={size} />
      <Wordmark onDark={onDark} />
    </span>
  );
}
