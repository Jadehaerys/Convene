function BaseIcon({ children, size = 18, strokeWidth = 1.8, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </BaseIcon>
  );
}

export function ArrowRightIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </BaseIcon>
  );
}

export function BookOpenIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M12 7v14" />
      <path d="M3 18a2 2 0 0 1 2-2h7" />
      <path d="M12 16h7a2 2 0 0 1 2 2" />
      <path d="M5 4h7v14H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M19 4h-7v14h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
    </BaseIcon>
  );
}

export function BotIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M10 8h4" />
      <path d="M12 2v2" />
      <rect x="4" y="6" width="16" height="12" rx="4" />
      <path d="M7 18v3" />
      <path d="M17 18v3" />
      <path d="M8 12h.01" />
      <path d="M16 12h.01" />
    </BaseIcon>
  );
}

export function BriefcaseIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </BaseIcon>
  );
}

export function CalendarIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </BaseIcon>
  );
}

export function CheckCircleIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="m9 18 6-6-6-6" />
    </BaseIcon>
  );
}

export function ClipboardIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    </BaseIcon>
  );
}

export function ClockIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </BaseIcon>
  );
}

export function CompassIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-5 5" />
      <path d="m10 14 1.5-4.5L16 8l-1.5 4.5Z" />
    </BaseIcon>
  );
}

export function CopyIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </BaseIcon>
  );
}

export function FileTextIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </BaseIcon>
  );
}

export function FilterIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </BaseIcon>
  );
}

export function GraduationCapIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="m2 10 10-5 10 5-10 5Z" />
      <path d="M6 12v4c0 1.8 2.7 3 6 3s6-1.2 6-3v-4" />
    </BaseIcon>
  );
}

export function HomeIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </BaseIcon>
  );
}

export function LifeBuoyIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M5.6 5.6 9 9" />
      <path d="M15 15l3.4 3.4" />
      <path d="M18.4 5.6 15 9" />
      <path d="M9 15l-3.4 3.4" />
    </BaseIcon>
  );
}

export function LogOutIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </BaseIcon>
  );
}

export function MailIcon(props) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </BaseIcon>
  );
}

export function MapPinIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </BaseIcon>
  );
}

export function MessageSquareIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </BaseIcon>
  );
}

export function PhoneIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72l.4 2.94a2 2 0 0 1-.57 1.68L7.1 10.1a16 16 0 0 0 6.8 6.8l1.76-1.79a2 2 0 0 1 1.68-.57l2.94.4A2 2 0 0 1 22 16.92Z" />
    </BaseIcon>
  );
}

export function SearchIcon(props) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </BaseIcon>
  );
}

export function SendIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </BaseIcon>
  );
}

export function ShieldCheckIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3 5 6v6c0 5 3.4 8 7 9 3.6-1 7-4 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </BaseIcon>
  );
}

export function SparklesIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z" />
      <path d="m5 17 .75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75Z" />
      <path d="m19 14 .75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75Z" />
    </BaseIcon>
  );
}

export function StarIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3 2.8 5.68 6.27.91-4.54 4.43 1.07 6.25L12 17.27 6.4 20.27l1.07-6.25L2.93 9.6l6.27-.91Z" />
    </BaseIcon>
  );
}

export function UsersIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13a4 4 0 0 1 0 7.75" />
    </BaseIcon>
  );
}

export function XIcon(props) {
  return (
    <BaseIcon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </BaseIcon>
  );
}

export function RatingStars({ value = 5, size = 14, className = '' }) {
  const count = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <span className={className}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} size={size} strokeWidth={index < count ? 2 : 1.6} />
      ))}
    </span>
  );
}
