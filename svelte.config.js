import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		paths: {
		  base: '', // Change if deploying under a subdirectory
		},
		prerender: {
		  entries: ['*'], // Prerender all pages
		},
	  }
};

export default config;

