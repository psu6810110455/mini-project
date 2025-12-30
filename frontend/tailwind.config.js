/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-teal': '#0d9488',    // Teal 600 - Calming / Professional
                'primary-teal-dark': '#0f766e',
                'soft-bg': '#f0fdfa',         // Teal 50 - Very soft background
                'text-main': '#1f2937',       // Gray 800 - High contrast text
                'text-muted': '#4b5563',      // Gray 600
                'success': '#059669',         // Emerald 600
                'error': '#dc2626',           // Red 600
                'disabled': '#e5e7eb',        // Gray 200
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'], // Easy to read
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'floating': '0 10px 30px -5px rgba(13, 148, 136, 0.15)',
            }
        },
    },
    plugins: [],
}
