import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		coverage: {
			reporter: ['json'],
			include: ['src/**/*.{js,ts,svelte}'],
			exclude: ['**/index.ts']
		},
		// https://github.com/vitest-dev/vitest/issues/3328
		setupFiles: ['./test/setup.js']
	}
});
