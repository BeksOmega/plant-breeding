"use client";

import { ReactNode, forwardRef } from "react";
import clsx from "clsx";

interface SurfaceProps {
  /** Content to display in the surface */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Shadow variant - 'medium' uses CSS variable, 'lg' uses Tailwind shadow-lg */
  shadow?: "medium" | "lg" | "none";
}

/**
 * Get the Surface className string for use with other components
 */
export function getSurfaceClassName({
  shadow = "medium",
  className,
}: {
  shadow?: "medium" | "lg" | "none";
  className?: string;
} = {}) {
  const shadowClass =
    shadow === "medium"
      ? "shadow-[var(--shadow-elevation-medium)]"
      : shadow === "lg"
        ? "shadow-lg"
        : "";

  return clsx("bg-tangerine-50", "border-2 border-tangerine-300", shadowClass, className);
}

/**
 * Surface component - provides a consistent background and border styling
 * used across Toast and ControlPanel components.
 */
const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ children, className, shadow = "medium" }, ref) => {
    return (
      <div ref={ref} className={getSurfaceClassName({ shadow, className })}>
        {children}
      </div>
    );
  }
);

Surface.displayName = "Surface";

export default Surface;

