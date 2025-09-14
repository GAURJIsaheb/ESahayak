"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddBuyerPage() {

  const { data: session } = useSession(); // get current logged-in user
  const userId = session?.user?.id;       // assuming your session stores user.id
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: "",
    purpose: "Buy",
    budgetMin: "",
    budgetMax: "",
    timeline: "0-3 months",
    source: "Website",
    status: "New",
    notes: "",
    tags: "",
  });

  const bhkMap = {
    "Studio": "Studio",
    "1 BHK": "Bhk1",
    "2 BHK": "Bhk2",
    "3 BHK": "Bhk3",
    "4 BHK": "Bhk4"
  };

  const timelineMap = {
    "0-3 months": "ZeroToThreeMonths",
    "3-6 months": "ThreeToSixMonths",
    ">6 months": "MoreThanSixMonths",
    "Exploring": "Exploring"
  };

  const sourceMap = {
    "Website": "Website",
    "Referral": "Referral",
    "Walk-in": "WalkIn",
    "Call": "Call",
    "Other": "Other"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      bhk: form.bhk ? bhkMap[form.bhk] : null,
      timeline: timelineMap[form.timeline],
      source: sourceMap[form.source],
      budgetMin: form.budgetMin ? parseInt(form.budgetMin) : null,
      budgetMax: form.budgetMax ? parseInt(form.budgetMax) : null,
      tags: form.tags.split(",").map((t) => t.trim()),
      ownerId: userId
    };

    const res = await fetch("/api/buyers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      toast.success("Buyers Created Succesfully !")
      setForm({
        fullName: "",
        email: "",
        phone: "",
        city: "Chandigarh",
        propertyType: "Apartment",
        bhk: "",
        purpose: "Buy",
        budgetMin: "",
        budgetMax: "",
        timeline: "0-3 months",
        source: "Website",
        status: "New",
        notes: "",
        tags: ""
      });
    } else {
      toast.error("Error adding buyer");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">Add New Buyer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 text-black"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
          />
        </div>

        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 text-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            >
              <option>Chandigarh</option>
              <option>Mohali</option>
              <option>Zirakpur</option>
              <option>Panchkula</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Property Type</label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            >
              <option>Apartment</option>
              <option>Villa</option>
              <option>Plot</option>
              <option>Office</option>
              <option>Retail</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">BHK</label>
            <select
              name="bhk"
              value={form.bhk}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            >
              <option value="">Select</option>
              <option>Studio</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4 BHK</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Purpose</label>
            <select
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            >
              <option>Buy</option>
              <option>Rent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Budget Min</label>
            <input
              type="number"
              name="budgetMin"
              value={form.budgetMin}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            />
          </div>

          <div>
            <label className="block font-medium">Budget Max</label>
            <input
              type="number"
              name="budgetMax"
              value={form.budgetMax}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Timeline</label>
            <select
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            >
              <option>0-3 months</option>
              <option>3-6 months</option>
              <option>&gt;6 months</option>
              <option>Exploring</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Source</label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            >
              <option>Website</option>
              <option>Referral</option>
              <option>Walk-in</option>
              <option>Call</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
          >
            <option>New</option>
            <option>Qualified</option>
            <option>Contacted</option>
            <option>Visited</option>
            <option>Negotiation</option>
            <option>Converted</option>
            <option>Dropped</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
          />
        </div>

        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Buyer
        </button>
      </form>
    </div>
  );
}
