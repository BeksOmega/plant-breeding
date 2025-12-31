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
    <Component
      className={clsx(
        "font-teko uppercase",
        {
          "tracking-wide":
            Component === "h1" ||
            Component === "h2" ||
            Component === "h3" ||
            Component === "h4",
          "tracking-wider": Component === "h5" || Component === "h6",
        },
        {
          "text-4xl": Component === "h1" || Component === "h2",
          "text-3xl": Component === "h3",
          "text-2xl": Component === "h4",
          "text-xl": Component === "h5" || Component === "h6",
        },
        {
          "font-normal":
            Component === "h1" ||
            Component === "h3" ||
            Component === "h4" ||
            Component === "h5",
          "font-light": Component === "h2" || Component === "h6",
        },
        "mb-0",
        className
      )}
    >
      {children}
    </Component>
  );
}
