"use client";

import { ReactNode, forwardRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import Surface from "../Surface";

interface ToastProps {
  /** Content to display in the toast */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Disable animation for the toast */
  disableAnimation?: boolean;
  /** Callback when toast is clicked to close */
  onClose?: () => void;
}

/**
 * Toast component - displays a toast notification that slides in from the left.
 * Styled to match the ControlPanel with light tangerine background and border.
 */
const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ children, className, disableAnimation, onClose }, ref) => {
    const handleClick = () => {
      if (onClose) {
        onClose();
      }
    };

    const surfaceClassName = clsx(
      "border-l-0",
      "px-2 py-1",
      "overflow-hidden",
      "max-w-[90%] sm:max-w-md md:max-w-md lg:max-w-md",
      onClose && "cursor-pointer",
      className
    );

    if (disableAnimation) {
      return (
        <Surface ref={ref} className={surfaceClassName} onClick={handleClick}>
          {children}
        </Surface>
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
        onClick={handleClick}
      >
        <Surface className={surfaceClassName}>{children}</Surface>
      </motion.div>
    );
  }
);

Toast.displayName = "Toast";

export default Toast;
