import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import type { DefaultSession, NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'

import { User } from '@/types/user'
import { getUser } from '@/utils/actions/get-user'
import { env } from '@/utils/env'

declare module 'next-auth'

interface Session extends DefaultSession {
  user: User
}

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authConfig = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        const user = (await getUser(
          credentials.email as string,
          credentials.password as string,
        )) as User

        return user ?? null
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // Persistir dados do usuário no JWT token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
        },
      } as Session
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Se a URL contém erro, manter na mesma página
      if (url.includes('error=')) {
        return url
      }

      // Se estiver vindo do login, redirecionar para a home
      if (url.includes('/login') || url === baseUrl) {
        return '/dashboard'
      }

      // Se for uma URL relativa válida, usar ela
      if (url.startsWith('/') && !url.startsWith('//')) {
        return `${baseUrl}${url}`
      }

      // Se for uma URL absoluta do mesmo domínio, usar ela
      if (url.startsWith(baseUrl)) {
        return url
      }

      // Caso padrão: voltar para a home
      return baseUrl
    },
  },
  pages: {
    error: '/',
    signIn: '/login',
    signOut: '/',
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === 'development',
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig)
}
