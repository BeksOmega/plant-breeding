"use client";

import { ReactNode, forwardRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import Surface, { getSurfaceClassName } from "../Surface";

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
const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ children, className, disableAnimation }, ref) => {
    const baseClassName = clsx(
      getSurfaceClassName(),
      "border-l-0",
      "px-2 py-1",
      "overflow-hidden",
      "max-w-[90%] sm:max-w-md md:max-w-md lg:max-w-md",
      className
    );

    if (disableAnimation) {
      return (
        <div ref={ref} className={baseClassName}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
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
);

Toast.displayName = "Toast";

export default Toast;
