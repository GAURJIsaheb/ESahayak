import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BuyerView({ params }) {
  const session = await getSession()
  if (!session) redirect('/auth/login')

  const buyer = await prisma.buyer.findUnique({
    where: { id: params.id },
    include: { history: { take: 5, orderBy: { changedAt: 'desc' } } },
  })

  if (!buyer) {
    return <p>Buyer not found.</p>
  }

  // Check ownership
  const canEdit = session.role === 'admin' || buyer.ownerId === session.userId
  if (!canEdit) {
    return <p>You can only edit your own buyers.</p>
  }

  return (
    <div className="p-4">
      <Link href="/buyers" className="mb-4 inline-block text-blue-500">&larr; Back</Link>
      <h1 className="text-2xl mb-4">{buyer.fullName}</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p><strong>Email:</strong> {buyer.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {buyer.phone}</p>
        <p><strong>City:</strong> {buyer.city}</p>
        <p><strong>Property Type:</strong> {buyer.propertyType}</p>
        {buyer.bhk && <p><strong>BHK:</strong> {buyer.bhk}</p>}
        <p><strong>Purpose:</strong> {buyer.purpose}</p>
        <p><strong>Budget:</strong> {buyer.budgetMin ? `${buyer.budgetMin}-${buyer.budgetMax || ''}` : 'N/A'}</p>
        <p><strong>Timeline:</strong> {buyer.timeline}</p>
        <p><strong>Source:</strong> {buyer.source}</p>
        <p><strong>Status:</strong> {buyer.status}</p>
        <p><strong>Notes:</strong> {buyer.notes || 'N/A'}</p>
        <p><strong>Tags:</strong> {buyer.tags.join(', ') || 'N/A'}</p>
        <p><strong>Updated:</strong> {new Date(buyer.updatedAt).toLocaleString()}</p>
      </div>
      <h2 className="text-xl mb-2">Recent Changes</h2>
      <ul>
        {buyer.history.map((h) => (
          <li key={h.id} className="mb-2 p-2 border">
            <p>{JSON.stringify(h.diff)}</p>
            <p>{new Date(h.changedAt).toLocaleString()} by {h.changedBy}</p>
          </li>
        ))}
      </ul>
      {canEdit && <Link href={`/buyers/${buyer.id}/edit`} className="block mt-4 p-2 bg-green-500 text-white w-fit">Edit</Link>}
    </div>
  )
}