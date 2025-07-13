'use server'

import { User } from '@/types/user'

export async function getUser(email: string, password: string): Promise<User> {
  return {
    id: '4c8db753',
    name: 'test user',
    email: email,
    role: 'admin',
  }
}
