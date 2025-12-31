import { ReactNode } from "react";
import clsx from "clsx";

interface GeneProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
}

export default function Gene({
  children,
  className,
  as: Component = "span",
}: GeneProps) {
  return (
    <Component className={clsx("font-asimovian", className)}>
      {children}
    </Component>
  );
}

