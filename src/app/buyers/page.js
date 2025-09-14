import BuyerTable from '@/components/BuyerTable'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'


export default async function Buyers({ searchParams }) {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  const page = parseInt(searchParams.page || '1')
  const limit = 10
  const skip = (page - 1) * limit

  const where = {}
  if (searchParams.city) where.city = searchParams.city
  if (searchParams.propertyType) where.propertyType = searchParams.propertyType
  if (searchParams.status) where.status = searchParams.status
  if (searchParams.timeline) where.timeline = searchParams.timeline
  if (searchParams.search) {
    where.OR = [
      { fullName: { contains: searchParams.search, mode: 'insensitive' } },
      { phone: { contains: searchParams.search } },
      { email: { contains: searchParams.search, mode: 'insensitive' } },
      { notes: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.buyer.count({ where }),
  ])

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Buyers</h1>
      <BuyerTable initialData={{ buyers, total, page, limit, filters: searchParams }} session={session} />
    </div>
  )
}