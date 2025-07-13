import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (session && session?.user.role !== 'admin') {
    redirect('/unauthorized')
  }
  return <div>{children}</div>
}
