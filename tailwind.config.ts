import type { Config } from 'tailwindcss';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            scale: {
                '102': '1.02',
            },
            borderWidth: {
                '3': '3px',
            }
        },
    },
    plugins: [],
} satisfies Config 