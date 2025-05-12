import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { verifyToken } from "./lib/api/auth";
import { authUserStore } from "$lib/stores/authUserStore";

export const handle: Handle = async ({ event, resolve }) => {
    
    const PUBLIC_ROUTES = ['/login'];
    const token = event.cookies.get('auth_token');
    const isPublicRoute = PUBLIC_ROUTES.some(route => event.url.pathname.startsWith(route));

    if (!token && !isPublicRoute) {
        throw redirect(302, '/login');
    }

    if (token && !isPublicRoute) {
        try {
            const isValid = await verifyToken(token);
            if (!isValid) {
                event.cookies.delete('auth_token', { path: '/' });
                authUserStore.reset();
                throw redirect(302, '/login');
            }
        } catch (error) {
            console.error('Token verification failed:', error);
        }
    }

    return await resolve(event);
};