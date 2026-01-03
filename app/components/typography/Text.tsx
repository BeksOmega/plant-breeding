import { ReactNode } from "react";
import clsx from "clsx";

interface TextProps {
  children: ReactNode;
  className?: string;
}

export default function Text({ children, className }: TextProps) {
  return (
    <p className={clsx("font-rajdhani text-base/5", className)}>
      {children}
    </p>
  );
}

