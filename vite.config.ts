import { sveltekit, vitePreprocess } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
	plugins: [sveltekit(),
	topLevelAwait({
		// The export name of top-level await promise for each chunk module
		promiseExportName: "__tla",
		// The function to generate import names of top-level await promise in each chunk module
		promiseImportName: i => `__tla_${i}`
	})
	],
	server: {
		fs: {
			allow: [
				searchForWorkspaceRoot(process.cwd()),
				'./media'
			]
		}
	},
});
