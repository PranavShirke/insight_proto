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
                    primary: '#10b981', // Emerald 500
                    secondary: '#059669', // Emerald 600
                    accent: '#34d399', // Emerald 400 (Lighter accent)
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
