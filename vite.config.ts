import { sveltekit, vitePreprocess } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: [
				searchForWorkspaceRoot(process.cwd()),
				'./media'
			]
		}
	}
});
