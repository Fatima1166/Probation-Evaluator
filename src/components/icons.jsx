const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export function ShieldIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3 4.5 6.5v5.2c0 4.3 3.2 8.3 7.5 9.3 4.3-1 7.5-5 7.5-9.3V6.5L12 3z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

export function AlertIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M10.3 4.2 2.9 17a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3L16 9.5" />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7 7 19a1.5 1.5 0 0 0 1.5 1.4h7A1.5 1.5 0 0 0 17 19l.5-12" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

export function PrintIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <path d="M7 8V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V8" />
      <path d="M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M7 14h10v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6z" />
    </svg>
  );
}

export function RefreshIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5" />
      <path d="M4 4.5v4h4" />
      <path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.5" />
      <path d="M20 19.5v-4h-4" />
    </svg>
  );
}

export function SparkIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m5.6 5.6 2.1 2.1" />
      <path d="m16.3 16.3 2.1 2.1" />
      <path d="m18.4 5.6-2.1 2.1" />
      <path d="m7.7 16.3-2.1 2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BulbIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5A2.8 2.8 0 0 1 15.6 14 6 6 0 0 0 12 3z" />
    </svg>
  );
}

export function ChartIcon({ className = "h-5 w-5" }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20h16" />
      <path d="M6.5 20v-7" />
      <path d="M12 20V6" />
      <path d="M17.5 20v-10" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ClipboardIcon({ className = "h-6 w-6" }) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5V3.8A1.8 1.8 0 0 1 10.8 2h2.4A1.8 1.8 0 0 1 15 3.8v.7" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

export function InfoIcon({ className = "h-4 w-4" }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function SpinnerIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={`animate-spin ${className}`} {...base}>
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </svg>
  );
}
