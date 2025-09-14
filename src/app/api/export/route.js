import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const where = {} // Build from params as before

  const buyers = await prisma.buyer.findMany({ where })

  const csv = buyers.map(b => ({
    fullName: b.fullName,
    email: b.email,
    phone: b.phone,
    city: b.city,
    propertyType: b.propertyType,
    bhk: b.bhk,
    purpose: b.purpose,
    budgetMin: b.budgetMin,
    budgetMax: b.budgetMax,
    timeline: b.timeline,
    source: b.source,
    notes: b.notes,
    tags: b.tags.join(','),
    status: b.status,
  }))

  // Use Papa unparse or simple string
  const headers = Object.keys(csv[0])
  let csvContent = headers.join(',') + '\n'
  csv.forEach(row => {
    csvContent += headers.map(h => `"${row[h] || ''}"`).join(',') + '\n'
  })

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="buyers.csv"',
    },
  })
}