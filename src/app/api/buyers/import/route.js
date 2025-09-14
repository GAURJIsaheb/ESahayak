import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { csvBuyerSchema } from '@/lib/validation'

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await request.json()

  try {
    await prisma.$transaction(async (tx) => {
      for (const row of rows) {
        const data = csvBuyerSchema.parse(row)
        await tx.buyer.create({
          data: {
            ...data,
            ownerId: session.userId,
          },
        })
      }
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}