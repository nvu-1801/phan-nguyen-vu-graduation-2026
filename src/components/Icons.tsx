import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/**
 * One stroke family for every interface icon. Kept intentionally plain so the
 * invitation typography stays the loudest thing on the page.
 */
function Icon({ size = 18, children, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{children}</svg>;
}

export function IconPin(props: IconProps) {
  return <Icon {...props}>
    <path d="M12 21c4.1-4.5 6.2-7.8 6.2-10.3a6.2 6.2 0 1 0-12.4 0C5.8 13.2 7.9 16.5 12 21Z" />
    <circle cx="12" cy="10.4" r="2.3" />
  </Icon>;
}

export function IconPhone(props: IconProps) {
  return <Icon {...props}>
    <path d="M6.4 3.5h2.9l1.5 3.9-2.2 1.6a13.4 13.4 0 0 0 6.4 6.4l1.6-2.2 3.9 1.5v2.9c0 1.1-.9 2-2 2C10.4 19.6 4.4 13.6 4.4 5.5c0-1.1.9-2 2-2Z" />
  </Icon>;
}

export function IconCoffee(props: IconProps) {
  return <Icon {...props}>
    <path d="M4.6 8h12v5.4a5.4 5.4 0 0 1-5.4 5.4h-1.2a5.4 5.4 0 0 1-5.4-5.4Z" />
    <path d="M16.6 9.4h1.6a2.4 2.4 0 1 1 0 4.8h-1.6" />
    <path d="M8.2 3.6v2.1M12 3.6v2.1" />
  </Icon>;
}

export function IconNote(props: IconProps) {
  return <Icon {...props}>
    <path d="M9.6 17.6V5.4l8.8-1.7v11.6" />
    <circle cx="6.9" cy="18" r="2.7" />
    <circle cx="15.7" cy="15.9" r="2.7" />
  </Icon>;
}

export function IconClose(props: IconProps) {
  return <Icon {...props}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </Icon>;
}

export function IconChevronLeft(props: IconProps) {
  return <Icon {...props}>
    <path d="m14.5 5.5-6.8 6.5 6.8 6.5" />
  </Icon>;
}

export function IconPlus(props: IconProps) {
  return <Icon {...props}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Icon>;
}

export function IconPen(props: IconProps) {
  return <Icon {...props}>
    <path d="m4.2 19.8 4.1-1 10.3-10.3a2.3 2.3 0 0 0-3.2-3.2L5.1 15.6l-.9 4.2Z" />
    <path d="m13.9 6.8 3.3 3.3" />
  </Icon>;
}

export function IconScroll(props: IconProps) {
  return <Icon {...props}>
    <rect x="7.4" y="3" width="9.2" height="18" rx="4.6" />
    <path d="M12 7.4v3.2" />
  </Icon>;
}

export function IconUp(props: IconProps) {
  return <Icon {...props}>
    <path d="M5 4.5h14" />
    <path d="m7.2 14.2 4.8-4.8 4.8 4.8" />
  </Icon>;
}
