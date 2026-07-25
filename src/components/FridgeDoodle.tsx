/**
 * Decorative inline-SVG accent used on empty-state sections.
 * aria-hidden so it is invisible to screen readers.
 * No props — purely presentational.
 */
export default function FridgeDoodle({ size = 80 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', opacity: 0.22, flexShrink: 0 }}
    >
      {/* Fridge body */}
      <rect
        x="14"
        y="6"
        width="52"
        height="68"
        rx="7"
        fill="var(--col-primary)"
      />
      {/* Freezer compartment divider */}
      <line
        x1="14"
        y1="28"
        x2="66"
        y2="28"
        stroke="var(--col-bg)"
        strokeWidth="2"
      />
      {/* Handle top */}
      <rect
        x="56"
        y="10"
        width="5"
        height="14"
        rx="2.5"
        fill="var(--col-bg)"
        opacity="0.7"
      />
      {/* Handle bottom */}
      <rect
        x="56"
        y="32"
        width="5"
        height="18"
        rx="2.5"
        fill="var(--col-bg)"
        opacity="0.7"
      />
      {/* Magnet 1 — tasks colour */}
      <circle cx="28" cy="44" r="5" fill="var(--mag-tasks)" opacity="0.9" />
      {/* Magnet 2 — notices colour */}
      <circle cx="40" cy="56" r="4" fill="var(--mag-notices)" opacity="0.9" />
      {/* Magnet 3 — pantry colour */}
      <circle cx="28" cy="60" r="3" fill="var(--mag-pantry)" opacity="0.9" />
      {/* Note strip pinned by magnet 1 */}
      <rect
        x="32"
        y="38"
        width="18"
        height="12"
        rx="2"
        fill="var(--col-bg)"
        opacity="0.6"
      />
      {/* Note lines */}
      <line
        x1="34"
        y1="42"
        x2="47"
        y2="42"
        stroke="var(--col-border)"
        strokeWidth="1.2"
      />
      <line
        x1="34"
        y1="45"
        x2="44"
        y2="45"
        stroke="var(--col-border)"
        strokeWidth="1.2"
      />
    </svg>
  )
}
