import { defineNuxtRouteMiddleware, useFetch, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async (to: any) => {
    const publicPages = ['/', '/login', '/register', '/create', '/pro', '/api/auth/me'];

    if (publicPages.includes(to.path)) return;

    if (to.path.startsWith('/pay/')) {
        return;
    }

    try {
        const { data } = await useFetch('/api/auth/me', {
            credentials: 'include',
            server: true,
        });

        if (!data.value?.user) {
            return navigateTo('/login');
        }
    } catch {
        console.error('Failed to fetch user');
        return navigateTo('/login');
    }
});
