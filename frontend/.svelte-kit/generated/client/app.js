export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11')
];

export const server_loads = [0,2];

export const dictionary = {
		"/(main)": [~6,[2]],
		"/(main)/games": [~8,[2]],
		"/(main)/game/[id]": [~7,[2],[,3]],
		"/(api)/login_request/close": [5],
		"/(overlays)/overlays/board": [~11,[4]],
		"/(main)/templates": [9,[2]],
		"/(main)/templates/[id]": [~10,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';