"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

interface ToastProps {
  /** Content to display in the toast */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Disable animation for the toast */
  disableAnimation?: boolean;
}

/**
 * Toast component - displays a toast notification that slides in from the left.
 * Styled to match the ControlPanel with light tangerine background and border.
 */
export default function Toast({
  children,
  className,
  disableAnimation,
}: ToastProps) {
  const baseClassName = clsx(
    "bg-tangerine-50 border-2 border-l-0 border-tangerine-300",
    "p-3",
    "shadow-[var(--shadow-elevation-medium)]",
    "overflow-hidden",
    className
  );

  if (disableAnimation) {
    return <div className={baseClassName}>{children}</div>;
  }

  return (
    <motion.div
      layout
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{
        x: "-100%",
        height: 0,
        transition: {
          x: { duration: 0.15, ease: "easeOut" },
          height: { duration: 0.1, ease: "easeIn", delay: 0.15 },
        },
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={baseClassName}
    >
      {children}
    </motion.div>
  );
}
