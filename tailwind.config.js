module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Ensure dark mode is enabled
  theme: {
    extend: {
      // Add custom utility for hiding scrollbars
      scrollbarHide: {
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none", // For Internet Explorer and Edge
        "scrollbar-width": "none", // For Firefox
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
