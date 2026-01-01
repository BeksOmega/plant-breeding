import type { Preview } from "@storybook/react";
import "../app/globals.css";

// Load Google Fonts for Storybook
if (typeof document !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600&family=Teko:wght@300;400;500;600;700&display=swap";
  if (!document.querySelector(`link[href="${link.href}"]`)) {
    document.head.appendChild(link);
  }

  // Set CSS variables for fonts
  document.documentElement.style.setProperty(
    "--font-rajdhani",
    "Rajdhani, sans-serif"
  );
  document.documentElement.style.setProperty("--font-teko", "Teko, sans-serif");
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: "Light", value: "#ffffff" },
        dark: { name: "Dark", value: "#333333" },
        "mars-red": { name: "Mars Red", value: "#da7359" },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "light" },
  },
};

export default preview;
