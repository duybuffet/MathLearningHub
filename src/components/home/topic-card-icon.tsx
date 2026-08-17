// Maps curriculum icon keys → inline SVG (accent-colored, 48px).
// Keys from curriculum.json: function, curve, matrix, logic, dice, graph, sigma. Fallback for unknown.
import type { ReactElement } from 'react';

interface TopicCardIconProps {
  icon: string;
  className?: string;
}

const icons: Record<string, ReactElement> = {
  function: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 48 Q20 10 32 32 Q44 54 54 16" stroke="var(--accent-orange)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="32" r="3" fill="var(--accent-orange)" />
      <text x="8" y="20" fontFamily="serif" fontSize="13" fill="var(--accent-orange)" opacity="0.7" fontStyle="italic">f(x)</text>
    </svg>
  ),
  curve: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 56 C16 40 24 8 32 16 S48 48 56 32" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="8" y1="56" x2="56" y2="56" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.4" />
      <line x1="8" y1="8" x2="8" y2="56" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.4" />
    </svg>
  ),
  matrix: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="12" y="22" fontFamily="monospace" fontSize="12" fill="var(--accent-purple)" opacity="0.9">a b</text>
      <text x="12" y="38" fontFamily="monospace" fontSize="12" fill="var(--accent-purple)" opacity="0.9">c d</text>
      <path d="M8 10 L8 54" stroke="var(--accent-purple)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 10 L14 10" stroke="var(--accent-purple)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 54 L14 54" stroke="var(--accent-purple)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 10 L56 54" stroke="var(--accent-purple)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 10 L50 10" stroke="var(--accent-purple)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 54 L50 54" stroke="var(--accent-purple)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  logic: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="24" x2="20" y2="24" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="40" x2="20" y2="40" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 16 L20 48 L36 48 Q52 48 52 32 Q52 16 36 16 Z" fill="var(--bg-code,#1e1e2e)" stroke="var(--accent-blue)" strokeWidth="2.5" />
      <line x1="52" y1="32" x2="60" y2="32" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  dice: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="8" stroke="var(--accent-green)" strokeWidth="2.5" fill="var(--bg-code,#1e1e2e)" />
      <circle cx="22" cy="22" r="3.5" fill="var(--accent-green)" />
      <circle cx="42" cy="22" r="3.5" fill="var(--accent-green)" />
      <circle cx="32" cy="32" r="3.5" fill="var(--accent-green)" />
      <circle cx="22" cy="42" r="3.5" fill="var(--accent-green)" />
      <circle cx="42" cy="42" r="3.5" fill="var(--accent-green)" />
    </svg>
  ),
  graph: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="6" fill="var(--accent-blue)" opacity="0.9" />
      <circle cx="12" cy="20" r="5" fill="var(--accent-blue)" opacity="0.6" />
      <circle cx="52" cy="18" r="5" fill="var(--accent-blue)" opacity="0.6" />
      <circle cx="16" cy="50" r="5" fill="var(--accent-blue)" opacity="0.6" />
      <circle cx="50" cy="48" r="5" fill="var(--accent-blue)" opacity="0.6" />
      <line x1="26" y1="28" x2="17" y2="24" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
      <line x1="38" y1="27" x2="47" y2="22" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
      <line x1="27" y1="36" x2="19" y2="46" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
      <line x1="37" y1="36" x2="46" y2="44" stroke="var(--accent-blue)" strokeWidth="1.5" opacity="0.7" />
    </svg>
  ),
  sigma: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="10" y="50" fontFamily="serif" fontSize="48" fill="var(--accent-orange)" opacity="0.85">Σ</text>
    </svg>
  ),
};

const FallbackIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="22" stroke="var(--text-muted)" strokeWidth="2.5" fill="var(--bg-code,#1e1e2e)" />
    <circle cx="32" cy="32" r="8" fill="var(--text-muted)" opacity="0.4" />
  </svg>
);

export function TopicCardIcon({ icon, className = '' }: TopicCardIconProps) {
  const svgEl = icons[icon] ?? <FallbackIcon />;
  return (
    <span className={`block w-12 h-12 flex-shrink-0 ${className}`}>
      {svgEl}
    </span>
  );
}
