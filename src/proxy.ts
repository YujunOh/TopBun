import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from '@/auth';

const intlMiddleware = createMiddleware(routing);

export default auth((req) => intlMiddleware(req));

export const config = {
  matcher: [
    '/',
    '/(ko|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)' 
  ]
};
