import { json } from '@sveltejs/kit';
import { authUserStore } from '$lib/stores/authUserStore';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('auth_token', {
    path: '/',
    httpOnly: true,
    secure: true
  });
  authUserStore.reset();
  return json({ success: true });
};