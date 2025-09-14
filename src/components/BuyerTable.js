'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import CsvImport from './CsvImport'
import { formatDate } from './dateFormatter'

export default function BuyerTable({ initialData, session }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(search, 300)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || '',
    status: searchParams.get('status') || '',
    timeline: searchParams.get('timeline') || '',
  })

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    router.push(`/buyers?${params.toString()}`)
  }, [debouncedSearch])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/buyers?${params.toString()}`)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/buyers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        // Refresh page
        window.location.reload()
      }
    } catch (err) {
      alert('Error updating status')
    }
  }

  const formatBudget = (min, max) => {
    if (!min && !max) return 'N/A'
    if (min && max) return `${min}–${max}`
    return min || max || 'N/A'
  }

  if (initialData.buyers.length === 0) {
    return <p className="text-gray-500">No buyers found.</p>
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, email, notes..."
          className="p-2 border text-black"
          aria-label="Search"
        />
        <CsvImport />
      </div>
      <div className="mb-4 flex text-black space-x-4">
        <select value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} className="p-2 border">
          <option value="">All Cities</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
        {/* Similar selects for propertyType, status, timeline */}
        <select value={filters.propertyType} onChange={(e) => updateFilter('propertyType', e.target.value)} className="p-2 border">
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="p-2 border">
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          {/* ... other statuses */}
        </select>
        <select value={filters.timeline} onChange={(e) => updateFilter('timeline', e.target.value)} className="p-2 border">
          <option value="">All Timelines</option>
          <option value="0-3m">0-3m</option>
          <option value="3-6m">3-6m</option>
          <option value=">6m">&gt;6m</option>
          <option value="Exploring">Exploring</option>
        </select>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">City</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Budget</th>
            <th className="border p-2">Timeline</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Updated</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {initialData.buyers.map((buyer) => (
            <tr key={buyer.id}>
              <td className="border p-2">{buyer.fullName}</td>
              <td className="border p-2">{buyer.phone}</td>
              <td className="border p-2">{buyer.city}</td>
              <td className="border p-2">{buyer.propertyType}</td>
              <td className="border p-2">{formatBudget(buyer.budgetMin, buyer.budgetMax)}</td>
              <td className="border p-2">{buyer.timeline}</td>
              <td className="border p-2">
                <select
                  value={buyer.status}
                  onChange={(e) => updateStatus(buyer.id, e.target.value)}
                  className="p-1 border text-black"
                  aria-label={`Status for ${buyer.fullName}`}
                >
                  {/* Options for statuses */}
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Visited">Visited</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Converted">Converted</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </td>
              <td className="border p-2">{formatDate(buyer.updatedAt)}</td>
              <td className="border p-2">
                <Link href={`/buyers/${buyer.id}`} className="mr-2 text-blue-500">View</Link>
                <Link href={`/buyers/${buyer.id}/edit`} className="text-blue-500">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p>Page {initialData.page} of {Math.ceil(initialData.total / initialData.limit)}</p>
        {/* Pagination links */}
        {initialData.page > 1 && <Link href={`?page=${initialData.page - 1}&${new URLSearchParams(filters).toString()}`}>Prev</Link>}
        {initialData.page < Math.ceil(initialData.total / initialData.limit) && <Link href={`?page=${initialData.page + 1}&${new URLSearchParams(filters).toString()}`}>Next</Link>}
      </div>
      <Link href="/buyers/new" className="block mt-4 p-2 bg-green-500 text-white w-fit">New Buyer</Link>
    </div>
  )
}