import { defineNuxtConfig } from 'nuxt/config';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },
    modules: ['@nuxtjs/tailwindcss'],
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        public: {
            hederaNetwork: process.env.HEDERA_NETWORK,
        },
    },
    app: {
        head: {
            link: [
                {
                    rel: 'preconnect',
                    href: 'https://fonts.googleapis.com',
                },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: '',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200..900&display=swap',
                },
            ],
            meta: [
                {
                    name: 'description',
                    content: 'Safely receive HBAR and USDC on Hedera',
                },
            ],
        },
    },
    nitro: {
        experimental: {
            wasm: true,
        },
    },
    postcss: {
        plugins: {
            'postcss-preset-env': {
                stage: 1,
                features: {
                    'nesting-rules': true,
                },
            },
            autoprefixer: {},
        },
    },
    vite: {
        resolve: {
            alias: {
                // Redirect the broken import to the correct path
                '@reown/appkit/adapters': '@reown/appkit',
                // WcHelpersUtil: '@reown/appkit/dist/esm/utils/WcHelpersUtil',
            },
        },
    },
});
