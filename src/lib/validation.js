import { z } from 'zod'

export const createBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']),
  propertyType: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']),
  bhk: z.enum(['Studio', '1', '2', '3', '4']).optional(),
  purpose: z.enum(['Buy', 'Rent']),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  timeline: z.enum(['0-3m', '3-6m', '>6m', 'Exploring']),
  source: z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']).optional().default('New'),
})

export const budgetValidator = (min, max) => {
  if (min && max && max < min) {
    throw new Error('Budget max must be >= min')
  }
}

export const csvBuyerSchema = createBuyerSchema.omit({ status: true }).extend({
  status: z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']).optional(),
})