import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: 'naver',
      name: 'Naver',
      type: 'oauth' as const,
      authorization: {
        url: 'https://nid.naver.com/oauth2.0/authorize',
        params: { response_type: 'code' },
      },
      token: 'https://nid.naver.com/oauth2.0/token',
      userinfo: 'https://openapi.naver.com/v1/nid/me',
      clientId: process.env.NAVER_CLIENT_ID ?? '',
      clientSecret: process.env.NAVER_CLIENT_SECRET ?? '',
      profile(profile: { response: { id: string; name: string; email: string; profile_image: string } }) {
        return {
          id: profile.response.id,
          name: profile.response.name,
          email: profile.response.email,
          image: profile.response.profile_image,
        };
      },
    },
    {
      id: 'kakao',
      name: 'Kakao',
      type: 'oauth' as const,
      authorization: {
        url: 'https://kauth.kakao.com/oauth/authorize',
        params: { response_type: 'code' },
      },
      token: 'https://kauth.kakao.com/oauth/token',
      userinfo: 'https://kapi.kakao.com/v2/user/me',
      clientId: process.env.KAKAO_CLIENT_ID ?? '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
      profile(profile: {
        id: number;
        kakao_account?: { profile?: { nickname?: string; profile_image_url?: string }; email?: string };
      }) {
        return {
          id: String(profile.id),
          name: profile.kakao_account?.profile?.nickname ?? null,
          email: profile.kakao_account?.email ?? null,
          image: profile.kakao_account?.profile?.profile_image_url ?? null,
        };
      },
    },
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHub({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        const provider = account.provider;

        if (provider === 'credentials') {
          token.userId = user?.id ?? token.sub;
          token.provider = 'credentials';
        } else {
          const providerId = account.providerAccountId;
          const name = profile?.name ?? token.name ?? null;
          const email = profile?.email ?? token.email ?? null;
          const image = (profile as { picture?: string } | null)?.picture ?? token.picture ?? null;

          const dbUser = await prisma.user.upsert({
            where: { provider_providerId: { provider, providerId } },
            update: { name, email, image },
            create: { name, email, image, provider, providerId },
          });

          token.userId = String(dbUser.id);
          token.provider = provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      const userId = typeof token.userId === 'string' ? token.userId : null;
      const provider = typeof token.provider === 'string' ? token.provider : null;

      return {
        ...session,
        user: session.user ? { ...session.user, id: userId ?? session.user.id } : session.user,
        provider,
      };
    },
  },
});
