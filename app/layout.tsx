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
          "before:inset-0",
          "before:z-[-1]",
          "before:bg-[url('/dust-texture.svg')]",
          "before:bg-cover",
          "before:bg-center",
          "before:bg-no-repeat",
          "before:opacity-40",
          "before:mix-blend-multiply",
          "before:pointer-events-none"
        )}
      >
        {children}
      </body>
    </html>
  );
}
