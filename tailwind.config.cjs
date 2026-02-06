/** @type {import('tailwindcss').Config} */
module.exports = {
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
                    primary: '#6366f1', // Indigo
                    secondary: '#a855f7', // Purple
                    accent: '#ec4899', // Pink
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
