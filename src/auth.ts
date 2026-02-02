import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
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
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const provider = account.provider;
        const providerId = account.providerAccountId;
        const name = profile?.name ?? token.name ?? null;
        const email = profile?.email ?? token.email ?? null;
        const image = (profile as { picture?: string } | null)?.picture ?? token.picture ?? null;

        const user = await prisma.user.upsert({
          where: { provider_providerId: { provider, providerId } },
          update: { name, email, image },
          create: { name, email, image, provider, providerId },
        });

        token.userId = String(user.id);
        token.provider = provider;
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
