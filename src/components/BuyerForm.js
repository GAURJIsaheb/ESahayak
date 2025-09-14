"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createBuyerSchema, budgetValidator } from '@/lib/validation';

export default function BuyerForm({ isEdit = false, initialData = {} }) {
  const router = useRouter();
  const validTimelineValues = ['0-3m', '3-6m', '>6m', 'Exploring']; // Valid enum values
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    propertyType: "",
    bhk: "",
    purpose: "",
    budgetMin: "",
    budgetMax: "",
    timeline: "0-3m", // Default to valid value
    source: "",
    notes: "",
    tags: [],
    ownerId: "",
    status: '',
    updatedAt: null,
    ...initialData,
    // Sanitize timeline in initialData
    timeline: validTimelineValues.includes(initialData.timeline) ? initialData.timeline : "0-3m",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && initialData.id) {
      fetch(`/api/buyers/${initialData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [],
            budgetMin: data.budgetMin || '',
            budgetMax: data.budgetMax || '',
            notes: data.notes || '',
            timeline: validTimelineValues.includes(data.timeline) ? data.timeline : "0-3m", // Sanitize fetched timeline
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load buyer data');
          setLoading(false);
        });
    }
  }, [isEdit, initialData.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData((prev) => ({
        ...prev,
        tags: value.split(',').map((t) => t.trim()).filter(Boolean),
      }));
    } else if (['budgetMin', 'budgetMax'].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      // Validate budgets
      budgetValidator(formData.budgetMin, formData.budgetMax);
      // Validate schema
      const validated = createBuyerSchema.parse({
        ...formData,
        bhk: ['Apartment', 'Villa'].includes(formData.propertyType) && !formData.bhk ? undefined : formData.bhk,
      });
      const res = await fetch(isEdit ? `/api/buyers/${initialData.id}` : '/api/buyers', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validated, updatedAt: formData.updatedAt }),
      });
      if (res.ok) {
        toast.success(isEdit ? 'Buyer updated' : 'Buyer created');
        router.push('/buyers');
      } else {
        const err = await res.json();
        toast.error(err.error || 'An error occurred');
        setErrors({ general: err.error });
      }
    } catch (err) {
      const fieldErrors = {};
      if (err.errors) {
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
      } else {
        fieldErrors.general = err.message;
      }
      setErrors(fieldErrors);
      toast.error('Validation failed');
    }
  };

  const showBhk = ['Apartment', 'Villa'].includes(formData.propertyType);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4" aria-labelledby="form-title">
      <h1 id="form-title" className="text-2xl font-bold">{isEdit ? 'Edit Buyer' : 'New Buyer'}</h1>
      {errors.general && <p className="text-red-500" role="alert">{errors.general}</p>}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="fullName-error"
        />
        {errors.fullName && <span id="fullName-error" className="text-red-500 text-sm" role="alert">{errors.fullName}</span>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email (optional)</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          aria-describedby="email-error"
        />
        {errors.email && <span id="email-error" className="text-red-500 text-sm" role="alert">{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="phone-error"
        />
        {errors.phone && <span id="phone-error" className="text-red-500 text-sm" role="alert">{errors.phone}</span>}
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium">City</label>
        <select
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="city-error"
        >
          <option value="">Select City</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
        {errors.city && <span id="city-error" className="text-red-500 text-sm" role="alert">{errors.city}</span>}
      </div>
      <div>
        <label htmlFor="propertyType" className="block text-sm font-medium">Property Type</label>
        <select
          id="propertyType"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="propertyType-error"
        >
          <option value="">Select Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        {errors.propertyType && <span id="propertyType-error" className="text-red-500 text-sm" role="alert">{errors.propertyType}</span>}
      </div>
      {showBhk && (
        <div>
          <label htmlFor="bhk" className="block text-sm font-medium">BHK</label>
          <select
            id="bhk"
            name="bhk"
            value={formData.bhk}
            onChange={handleChange}
            className="block w-full p-2 border rounded text-black"
            required
            aria-describedby="bhk-error"
          >
            <option value="">Select BHK</option>
            <option value="Studio">Studio</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          {errors.bhk && <span id="bhk-error" className="text-red-500 text-sm" role="alert">{errors.bhk}</span>}
        </div>
      )}
      <div>
        <label htmlFor="purpose" className="block text-sm font-medium">Purpose</label>
        <select
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="purpose-error"
        >
          <option value="">Select Purpose</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        {errors.purpose && <span id="purpose-error" className="text-red-500 text-sm" role="alert">{errors.purpose}</span>}
      </div>
      <div>
        <label htmlFor="budgetMin" className="block text-sm font-medium">Budget Min</label>
        <input
          id="budgetMin"
          name="budgetMin"
          type="number"
          value={formData.budgetMin}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          aria-describedby="budgetMin-error"
        />
        {errors.budgetMin && <span id="budgetMin-error" className="text-red-500 text-sm" role="alert">{errors.budgetMin}</span>}
      </div>
      <div>
        <label htmlFor="budgetMax" className="block text-sm font-medium">Budget Max</label>
        <input
          id="budgetMax"
          name="budgetMax"
          type="number"
          value={formData.budgetMax}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          aria-describedby="budgetMax-error"
        />
        {errors.budgetMax && <span id="budgetMax-error" className="text-red-500 text-sm" role="alert">{errors.budgetMax}</span>}
      </div>
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium">Timeline</label>
        <select
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="timeline-error"
        >
          <option value="M0_3">0-3m</option>
          <option value="M3_6">3-6m</option>
          <option value="M6Plus">&gt;6m</option>
          <option value="Exploring">Exploring</option>
        </select>
        {errors.timeline && (
          <span id="timeline-error" className="text-red-500 text-sm" role="alert">
            {errors.timeline}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="source" className="block text-sm font-medium">Source</label>
        <select
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="source-error"
        >
          <option value="">Select Source</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Walk-in">Walk-in</option>
          <option value="Call">Call</option>
          <option value="Other">Other</option>
        </select>
        {errors.source && <span id="source-error" className="text-red-500 text-sm" role="alert">{errors.source}</span>}
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium">Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          maxLength={1000}
          aria-describedby="notes-error"
        />
        {errors.notes && <span id="notes-error" className="text-red-500 text-sm" role="alert">{errors.notes}</span>}
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium">Tags (comma-separated)</label>
        <input
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={handleChange}
          className="block w-full p-2 border rounded text-black"
          placeholder="e.g., urgent, luxury"
          aria-describedby="tags-error"
        />
        {errors.tags && <span id="tags-error" className="text-red-500 text-sm" role="alert">{errors.tags}</span>}
      </div>
      {isEdit && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full p-2 border rounded text-black"
            aria-describedby="status-error"
          >
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Contacted">Contacted</option>
            <option value="Visited">Visited</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Converted">Converted</option>
            <option value="Dropped">Dropped</option>
          </select>
          {errors.status && <span id="status-error" className="text-red-500 text-sm" role="alert">{errors.status}</span>}
        </div>
      )}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {isEdit ? 'Update Buyer' : 'Create Buyer'}
      </button>
    </form>
  );
}