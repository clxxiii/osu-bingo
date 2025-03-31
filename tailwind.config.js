/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,ts,svelte}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
				display: ['Poiret One', 'display', 'sans-serif'],
				rounded: ['Comfortaa', 'sans-serif'],
				square: ['Geo', 'sans-serif'],
				mono: ['CutiveMono', 'monospace']
			},
			animation: {
				warning: 'warning 1s ease infinite'
			},
			keyframes: {
				warning: {
					'0%, 100%': { color: '#d5c9df' },
					'50%': { color: '#923622' }
				}
			},
			backgroundImage: {
				pattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233f3f46' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
			},
			colors: {
				base: {
					50: '#f6f5f5',
					100: '#e7e6e6',
					200: '#d1d0d0',
					300: '#b1afb0',
					400: '#898788',
					500: '#6e6c6d',
					600: '#5e5c5d',
					700: '#504e4e',
					800: '#464444',
					900: '#3d3c3c',
					950: '#313030'
				},
				highlight: {
					50: '#f0fdfc',
					100: '#cafdf8',
					200: '#96f9f1',
					300: '#59efe8',
					400: '#27dad8',
					500: '#0eb8b9',
					600: '#089599',
					700: '#0b767a',
					800: '#0e5d61',
					900: '#114d50',
					950: '#032c30'
				},
				pink: {
					50: '#fcf3f8',
					100: '#fae9f3',
					200: '#f8d2e8',
					300: '#f3aed3',
					400: '#ee92c2',
					500: '#e05499',
					600: '#ce3478',
					700: '#b2245f',
					800: '#93214f',
					900: '#7b2045',
					950: '#4b0c25'
				},
				amber: {
					50: '#fdf5f3',
					100: '#fde8e3',
					200: '#fbd5cd',
					300: '#f7b8aa',
					400: '#f18e78',
					500: '#e6694d',
					600: '#d5573b',
					700: '#b13e24',
					800: '#923622',
					900: '#7a3222',
					950: '#42170d'
				},
				purple: {
					50: '#f9f7fb',
					100: '#f4f1f6',
					200: '#e9e5ef',
					300: '#d5c9df',
					400: '#c5b4d1',
					500: '#af94be',
					600: '#9e7bac',
					700: '#8b6998',
					800: '#755780',
					900: '#604969',
					950: '#3f2f46'
				},
				blue: {
					50: '#eef3ff',
					100: '#dfe8ff',
					200: '#c6d4ff',
					300: '#a3b7fe',
					400: '#7f90fa',
					500: '#7079f5',
					600: '#4443e8',
					700: '#3935cd',
					800: '#2f2ea5',
					900: '#2c2d83',
					950: '#1b1a4c'
				}
			}
		}
	},
	plugins: []
};
