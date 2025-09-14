import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    const session = await login(email, password)
    const res = NextResponse.json({ success: true })
    res.cookies.set('sessionId', session.userId, { httpOnly: true })
    return res
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}