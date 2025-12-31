import { ReactNode } from "react";
import clsx from "clsx";

interface HeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export default function Heading({
  children,
  as: Component = "h1",
  className,
}: HeadingProps) {
  return (
    <Component className={clsx("font-teko", className)}>
      {children}
    </Component>
  );
}

