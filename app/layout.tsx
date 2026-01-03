import type { Metadata } from "next";
import "./globals.css";
import clsx from "clsx";
import { Rajdhani, Teko } from "next/font/google";
import { ToastProvider } from "./components/toast/ToastContainer";

const rajdhani = Rajdhani({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const teko = Teko({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-teko",
});

// Asimovian is loaded via CSS import in globals.css since it may not be available via next/font/google

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
    <html lang="en" className={clsx(rajdhani.variable, teko.variable)}>
      <body
        className={clsx(
          "mars-background",
          "before:absolute",
          "before:content-['']",
          "before:bg-bottom",
          "before:inset-0",
          "before:z-[-2]",
          "before:bg-[url('/dust-texture.svg')]",
          "before:bg-repeat",
          "before:opacity-5",
          "before:mix-blend-multiply",
          "before:pointer-events-none",
          "after:absolute",
          "after:content-['']",
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
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
