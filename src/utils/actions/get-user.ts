'use server'

import { User } from '@/types/user'

export async function getUser(email: string, password: string): Promise<User> {
  console.log('🚀 ~ getUser ~ password:', password)
  return {
    id: '4c8db753',
    name: 'test user',
    email: email,
    role: 'admin',
  }
}
