














import { z } from 'zod'

// Base schema for creating a buyer
export const createBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']),
  propertyType: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']),
  bhk: z.enum(['Studio', '1', '2', '3', '4']).optional().nullable(),
  purpose: z.enum(['Buy', 'Rent']),
  budgetMin: z.number().int().min(0).optional().nullable(),
  budgetMax: z.number().int().min(0).optional().nullable(),
  timeline: z.enum(['0-3m', '3-6m', '>6m', 'Exploring']),
  source: z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']),
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']).optional().default('New'),
  ownerId: z.string().uuid(),
  updatedAt: z.string().optional(), // For CSV timestamp
})

// Validator for budget consistency
export const budgetValidator = (min, max) => {
  if (min != null && max != null && max < min) {
    throw new Error('Budget max must be >= min')
  }
}

// CSV-specific schema
// CSV-specific schema
export const csvBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']),
  propertyType: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']),
  bhk: z.enum(['Studio', '1', '2', '3', '4']).optional().nullable(),
  purpose: z.enum(['Buy', 'Rent']),
  budgetMin: z.number().int().min(0).optional().nullable(),
  budgetMax: z.number().int().min(0).optional().nullable(),
  timeline: z.enum(['0-3m', '3-6m', '>6m', 'Exploring']),
  source: z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']),
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']).optional(),
  updatedAt: z.string().optional(), // CSV timestamp
})

