import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createBuyerSchema } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rateLimiter'

export async function PATCH(request, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const buyer = await prisma.buyer.findUnique({ where: { id: params.id } })
  if (!buyer || (session.role !== 'admin' && buyer.ownerId !== session.userId)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
  try {
    checkRateLimit(ip, 'update')
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 429 })
  }

  try {
    const data = createBuyerSchema.parse(await request.json())
    // Concurrency: check updatedAt
    if (data.updatedAt && data.updatedAt !== buyer.updatedAt) {
      return NextResponse.json({ error: 'Stale data, please refresh' }, { status: 409 })
    }

    const oldData = { ...buyer }
    const updatedBuyer = await prisma.buyer.update({
      where: { id: params.id },
      data,
    })

    // History
    const diff = {}
    Object.keys(data).forEach(key => {
      if (oldData[key] !== data[key]) {
        diff[key] = { old: oldData[key], new: data[key] }
      }
    })
    await prisma.buyerHistory.create({
      data: {
        buyerId: params.id,
        changedBy: session.userId,
        diff,
      },
    })

    return NextResponse.json(updatedBuyer)
  } catch (err) {
    return NextResponse.json({ error: err.errors || err.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  // Similar ownership check
  const session = await getSession()
  const buyer = await prisma.buyer.findUnique({ where: { id: params.id } })
  if (!buyer || (session.role !== 'admin' && buyer.ownerId !== session.userId)) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  await prisma.buyer.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

export async function GET(request, { params }) {
  const buyer = await prisma.buyer.findUnique({ 
    where: { id: params.id },
    include: { history: { take: 5 } }
  })
  return NextResponse.json(buyer)
}