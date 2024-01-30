import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import scrollbarHide from "tailwind-scrollbar-hide";
import type { Config } from "tailwindcss";

import radix from "tailwindcss-radix";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx,mdx}",
	],
	future: {
		hoverOnlyWhenSupported: true,
	},
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				brown: {
					50: "#fdf8f6",
					100: "#f2e8e5",
					200: "#eaddd7",
					300: "#e0cec7",
					400: "#d2bab0",
					500: "#bfa094",
					600: "#a18072",
					700: "#977669",
					800: "#846358",
					900: "#43302b",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				// Modal
				"scale-in": {
					"0%": { transform: "scale(0.95)" },
					"100%": { transform: "scale(1)" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				// Input Select
				"input-select-slide-up": {
					"0%": { transform: "translateY(-342px)" },
					"100%": { transform: "translateY(-350px)" },
				},
				"input-select-slide-down": {
					"0%": { transform: "translateY(0px)" },
					"100%": { transform: "translateY(8px)" },
				},
				// Tooltip
				"slide-up-fade": {
					"0%": { opacity: "0", transform: "translateY(2px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-right-fade": {
					"0%": { opacity: "0", transform: "translateX(-2px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
				"slide-down-fade": {
					"0%": { opacity: "0", transform: "translateY(-2px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-left-fade": {
					"0%": { opacity: "0", transform: "translateX(2px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
				// Navigation menu
				"enter-from-right": {
					"0%": { transform: "translateX(200px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				"enter-from-left": {
					"0%": { transform: "translateX(-200px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				"exit-to-right": {
					"0%": { transform: "translateX(0)", opacity: "1" },
					"100%": { transform: "translateX(200px)", opacity: "0" },
				},
				"exit-to-left": {
					"0%": { transform: "translateX(0)", opacity: "1" },
					"100%": { transform: "translateX(-200px)", opacity: "0" },
				},
				"scale-in-content": {
					"0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: "0" },
					"100%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
				},
				"scale-out-content": {
					"0%": { transform: "rotateX(0deg) scale(1)", opacity: "1" },
					"100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: "0" },
				},

				// Custom wiggle animation
				wiggle: {
					"0%, 100%": {
						transform: "translateX(0%)",
						transformOrigin: "50% 50%",
					},
					"15%": { transform: "translateX(-4px) rotate(-4deg)" },
					"30%": { transform: "translateX(6px) rotate(4deg)" },
					"45%": { transform: "translateX(-6px) rotate(-2.4deg)" },
					"60%": { transform: "translateX(2px) rotate(1.6deg)" },
					"75%": { transform: "translateX(-1px) rotate(-0.8deg)" },
				},
				// Custom spinner animation (for loading-spinner)
				spinner: {
					"0%": {
						opacity: "1",
					},
					"100%": {
						opacity: "0",
					},
				},
				// Custom blink animation (for loading-dots)
				blink: {
					"0%": {
						opacity: "0.2",
					},
					"20%": {
						opacity: "1",
					},
					"100%": {
						opacity: "0.2",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				// Modal
				"scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
				"fade-in": "fade-in 0.3s ease-out forwards",
				// Input Select
				"input-select-slide-up": "input-select-slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
				"input-select-slide-down": "input-select-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
				// Tooltip
				"slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
				"slide-right-fade": "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
				"slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
				"slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
				// Navigation menu
				"enter-from-right": "enter-from-right 0.25s ease",
				"enter-from-left": "enter-from-left 0.25s ease",
				"exit-to-right": "exit-to-right 0.25s ease",
				"exit-to-left": "exit-to-left 0.25s ease",
				"scale-in-content": "scale-in-content 0.2s ease",
				"scale-out-content": "scale-out-content 0.2s ease",
				// Custom wiggle animation
				wiggle: "wiggle 0.75s infinite",
				// Custom spinner animation (for loading-spinner)
				spinner: "spinner 1.2s linear infinite",
				// Custom blink animation (for loading-dots)
				blink: "blink 1.4s infinite both",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), forms, typography, scrollbarHide, radix],
};
// fontFamily: {
// 	display: ["var(--font-satoshi)", "system-ui", "sans-serif"],
// 	default: ["var(--font-inter)", "system-ui", "sans-serif"],
// },
//  {
// 	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
// 	future: {
// 		hoverOnlyWhenSupported: true,
// 	},
// 	theme: {
// 		extend: {
// 			screens: {
// 				xs: "420px",
// 			},
// 			typography: {
// 				DEFAULT: {
// 					css: {
// 						"blockquote p:first-of-type::before": { content: "none" },
// 						"blockquote p:first-of-type::after": { content: "none" },
// 					},
// 				},
// 			},
// 			animation: {
// 				// Modal
// 				"scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
// 				"fade-in": "fade-in 0.3s ease-out forwards",

// 			},
// 			colors: {
// 				brown: {
// 					50: "#fdf8f6",
// 					100: "#f2e8e5",
// 					200: "#eaddd7",
// 					300: "#e0cec7",
// 					400: "#d2bab0",
// 					500: "#bfa094",
// 					600: "#a18072",
// 					700: "#977669",
// 					800: "#846358",
// 					900: "#43302b",
// 				},
// 			},
// 		},
// 	},
// 	plugins: [forms, typography, scrollbarHide, radix],
// };

export default config;
