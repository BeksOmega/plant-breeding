import { ReactNode } from "react";
import clsx from "clsx";

interface ParagraphProps {
  children: ReactNode;
  className?: string;
}

export default function Paragraph({ children, className }: ParagraphProps) {
  return (
    <p className={clsx("font-rajdhani text-base/5 mb-3", className)}>
      {children}
    </p>
  );
}
