/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1", // Keep for now or map to brand? Let's add new ones first.
                brand: "#111827", // Deep navy
                accent: "#C2410C", // Burnt orange
                success: "#059669", // Emerald
                "bg-main": "#FDFCFB", // Off-white
            },
            boxShadow: {
                premium: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'scroll': 'scroll 30s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(1deg)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                }
            }
        },
    },
    plugins: [],
}
