"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default  function NewBuyerPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Chandigarh",
    propertyType: "",
    bhk: "",
    purpose: "Buy",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
    source: "",
    notes: "",
    tags: "",
    ownerId: "", //fetch it dynammicaly via session
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setForm(prev => ({ ...prev, ownerId: session.user.id }));


      console.log("--->",session.user.id)
    }
  }, [status, session]);

  // Agar loading hai toh kuch dikha, jaise loading spinner
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Buyer created successfully!");
      } else {
        alert("Error creating buyer");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-white">Add New Buyer</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        
        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
          className="border p-2 rounded text-black"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded text-black"
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          className="border p-2 rounded text-black"
        />

        {/* City */}
        <select
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border p-2 rounded text-black"
        >
          <option>Chandigarh</option>
          <option>Mohali</option>
          <option>Zirakpur</option>
          <option>Panchkula</option>
          <option>Other</option>
        </select>

        {/* Property Type */}
        <select
          value={form.propertyType}
          onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
          className="border p-2 rounded text-black"
        >
          <option>Apartment</option>
          <option>Villa</option>
          <option>Plot</option>
          <option>Office</option>
          <option>Retail</option>
        </select>

        {/* BHK */}
        <input
          type="text"
          placeholder="BHK (e.g. 2, 3, 4)"
          value={form.bhk}
          onChange={(e) => setForm({ ...form, bhk: e.target.value })}
          className="border p-2 rounded text-black"
        />

        {/* Purpose */}
        <select
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          className="border p-2 rounded text-black"
        >
          <option>Buy</option>
          <option>Rent</option>
        </select>

        {/* Budget Min/Max */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Budget Min"
            value={form.budgetMin}
            onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
            className="border p-2 rounded w-1/2 text-black"
          />
          <input
            type="number"
            placeholder="Budget Max"
            value={form.budgetMax}
            onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
            className="border p-2 rounded w-1/2 text-black"
          />
        </div>

        {/* Timeline */}
        <select
          value={form.timeline}
          onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          className="border p-2 rounded text-black"
        >
          <option value="M0_3">0-3m</option>
          <option value="M3_6">3-6m</option>
          <option value="M6Plus">&gt;6m</option>
          <option value="Exploring">Exploring</option>
        </select>

        {/* Source */}
        <select
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="border p-2 rounded text-black"
        >
          <option>Website</option>
          <option>Referral</option>
          <option value="WalkIn">Walk-in</option>
          <option>Call</option>
          <option>Other</option>
        </select>

        {/* Notes */}
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="border p-2 rounded text-black"
        />

        {/* Tags */}
        <input
          type="text"
          placeholder='Tags (JSON: ["hot","priority"])'
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="border p-2 rounded text-black"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
