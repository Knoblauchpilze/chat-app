import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_API_BASE_URL: {
		public: true,
		static: true
	},
	PUBLIC_TCP_API_HOST: {
		public: true,
		static: true
	},
	PUBLIC_TCP_API_PORT: {
		public: true,
		static: true
	}
});
