import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#14243A",
        accent: "#2F6FED",
        canvas: "#F5F7FB",
        borderline: "#E1E7EF",
        muted: "#58677A",
        success: "#0F9F6E",
        danger: "#DC2626"
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(20, 36, 58, 0.04)"
      },
      borderRadius: {
        card: "12px"
      }
    }
  },
  plugins: [forms]
};

export default config;
