import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// svelte.config.js
import adapter from '@sveltejs/adapter-node';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: 'dist'
		}),
		alias: {
			$components: './src/components',
			$db: './src/db',
			$scss: './src/scss'
		}
	},
	preprocess: [sveltePreprocess(), vitePreprocess({})]
};

export default config;
