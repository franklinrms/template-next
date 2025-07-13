import { DefaultSession } from 'next-auth'

export type User = {
  id: string
  role: 'user' | 'admin'
} & DefaultSession['user']
