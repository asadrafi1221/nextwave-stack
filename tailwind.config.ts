import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "hsl(var(--primaryBg))",
        primaryColor: "hsl(var(--primaryColor))",
        secondaryBg: "hsl(var(--secondaryBg))",
        secondaryColor: "hsl(var(--secondaryColor))",
        layoutBg: "hsl(var(--layoutBg))",
        layoutColor: "hsl(var(--layoutColor))",
      },
      fontFamily: {
        title: "var(--title)",
        desc: "var(--desc)",
        button: "var(--button)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
