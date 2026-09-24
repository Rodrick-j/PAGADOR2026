/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
            fontSize: {
                '1xs': '0.65rem',
                '2xs': '0.5rem',
            },
            height: {
                '22': '5.5rem',
            }
        }
    },
    plugins: []
};
