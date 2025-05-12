import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://accounts.google.com https://*.cloudinary.com https://api.cloudinary.com wss://chat.stream-io-api.com https://chat.stream-io-api.com https://*.stream-io-api.com",
  "img-src 'self' data: blob: https://*.cloudinary.com https://res.cloudinary.com",
  "media-src 'self' https://*.cloudinary.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://accounts.google.com"
].join('; ');

const PROTECTED_ROUTES = {
  owner: [
    '/dashboard',
    '/dashboard/account',
    '/dashboard/acessCode',
    '/dashboard/infoCard',
    '/dashboard/Messages',
    '/dashboard/property',
    '/dashboard/ShopManage',
    '/api/dashboard',
    '/api/properties',
    '/api/stayInfo',
	'/api/access-codes',
    '/api/users',
    '/api/shop',
    '/api/stream',
  ],
  user: [
    '/homePage',
    '/user',
    '/api/stays/user',
    '/api/users/profile',
    '/api/shop',
    '/api/stream',
  ],
} as const;

const PUBLIC_ROUTES = [
  '/login',
  '/registration',
  '/api/auth',
  '/home',
  '/_next',
  '/favicon.ico',
  '/images',
  '/public',
  '/logo.png',
  '/photo1.jpg',
  '/api/auth/callback',
  '/api/auth/signin',
  '/api/auth/session',
  '/_next/static',
  '/generate_204',
  '/verify-email',
  '/verify-email-notice',
  '/api/auth/validationEmail',
  '/api/auth/verify-email',
  '/conditions-utilisation',
  '/aide-connexion',
];


//----- MIDDLEWARE -----//
// Middleware pour vérifier les autorisations et les tokens //
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Appliquer la CSP à toutes les réponses
  response.headers.set('Content-Security-Policy', CSP_HEADER);

  // Si c'est une route publique, retourner directement
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return response;
  }

  // Vérifier si la requête est pour l'API send-access-code
  if (pathname.startsWith('/api/send-access-code')) {
    return NextResponse.next();
  }

  // 2. Vérifier l'authentification avec NextAuth
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log("🔍 Vérification du token NextAuth:", token);


  // 3. Vérifier les autorisations
  const userRole = token.account_type as keyof typeof PROTECTED_ROUTES;
  const isAuthorized = PROTECTED_ROUTES[userRole]?.some(route =>
    pathname.startsWith(route)
  );

  if (!isAuthorized) {
    const defaultPath = userRole === 'owner' ? '/dashboard' : '/homePage';
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  return response;
}




//----- CONFIGURATION -----//
// Configuration pour le middleware //
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/send-access-code (notre nouvelle API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/send-access-code|_next/static|_next/image|favicon.ico).*)',
  ],
};
