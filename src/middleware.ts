import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = [
  { path: '/', whenAuthenticated: 'next' },
  { path: '/unauthorized', whenAuthenticated: 'next' },
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
] as const

const DEFAULT_REDIRECT = '/'
const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

export default function middleware(req: NextRequest) {
  const { nextUrl } = req

  const publicRoute = publicRoutes.find(({ path }) =>
    path.includes(nextUrl.pathname),
  )

  const authToken = req.cookies.get('next-auth.session-token')

  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = DEFAULT_REDIRECT

    return NextResponse.redirect(redirectUrl)
  }

  if (authToken && !publicRoute) {
    // Checar se o JWT não está EXPIRADO

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
