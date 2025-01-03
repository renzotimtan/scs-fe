/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      "sidebar-dark": "#112D4E",
      "sidebar-light": "#DBE2EF",
      "sidebar-white": "#F9F7F7",
      "button-primary": "#0B6BCB",
      "button-soft-primary": "#E3EFFB",
      "button-neutral": "#555E68",
      "button-warning": "#C41C1C",
      "delete-red": "#F7C5C5",
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
