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

// Get basePath from environment (same logic as next.config.js)
const basePath = process.env.GITHUB_PAGES === "true" ? "/plant-breeding" : "";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx(rajdhani.variable, teko.variable)}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --dust-texture-url: url("${basePath}/dust-texture.svg"); }`,
          }}
        />
      </head>
      <body className="mars-background">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
