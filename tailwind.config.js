/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0f0f1a', // Deep charcoal
                    surface: '#1e1e2d', // Lighter charcoal for cards
                    text: '#e2e8f0', // Light gray text
                    muted: '#94a3b8', // Muted text
                },
                brand: {
                    primary: '#06b6d4', // Cyan 500
                    secondary: '#3b82f6', // Blue 500
                    accent: '#f59e0b', // Amber 500 (Contrast)
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
