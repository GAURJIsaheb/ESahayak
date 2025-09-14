import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2).max(50),
})

export async function getSession() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('sessionId')?.value
  if (!sessionId) return null

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
  })
  if (!user) return null

  return { userId: user.id, email: user.email, role: user.role }
}

export async function login(email, password) {
  // Find user in DB
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.password !== password) {
    throw new Error('Invalid credentials')
  }

  // Set session cookie
  cookies().set('sessionId', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
  return { userId: user.id, role: user.role }
}

export async function signup({ email, password, name }) {
  const validated = signupSchema.parse({ email, password, name })
  
  // Check if email exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('Email already exists')
  }

  // Create user with plain text password (not secure for production)
  const user = await prisma.user.create({
    data: {
      id: `user-${Math.random().toString(36).slice(2)}`,
      email: validated.email,
      name: validated.name,
      role: 'user',
      password: validated.password,  // <-- store password in DB
    },
  })

  // Set session cookie
  cookies().set('sessionId', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
  return { userId: user.id, role: user.role }
}


export async function logout() {
  cookies().delete('sessionId')
}