import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BuyerForm from '@/components/BuyerForm' // Rename to component

// Similar to view, fetch buyer, pass to <BuyerForm isEdit={true} initialData={buyer} />
export default async function EditBuyer({ params }) {
  const session = await getSession()
  const buyer = await prisma.buyer.findUnique({ where: { id: params.id } })
  if (!buyer || (session.role !== 'admin' && buyer.ownerId !== session.userId)) {
    redirect('/buyers')
  }
  return <BuyerForm isEdit={true} initialData={buyer} />
}