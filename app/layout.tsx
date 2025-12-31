import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Plant Breeding",
  description: "A simple Next.js website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          "mars-background",
          "before:absolute",
          "before:bg-bottom",
          "before:inset-0",
          "before:z-[-2]",
          "before:bg-[url('/dust-texture.svg')]",
          "before:bg-repeat",
          "before:opacity-5",
          "before:mix-blend-multiply",
          "before:pointer-events-none",
          "after:absolute",
          "after:inset-0",
          "after:z-[-1]",
          "after:bg-[url('/dust-texture.svg')]",
          "after:bg-bottom-[50%]",
          "after:bg-repeat",
          "after:opacity-5",
          "after:mix-blend-multiply",
          "after:pointer-events-none"
        )}
      >
        {children}
      </body>
    </html>
  );
}
