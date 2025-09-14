"use client";
import { useState } from "react";

function mapBhk(val) {
  if (!val) return null;
  val = val.trim();
  if (val === "Studio") return "Studio";
  if (val === "1") return "Bhk1";
  if (val === "2") return "Bhk2";
  if (val === "3") return "Bhk3";
  if (val === "4") return "Bhk4";
  return null;
}
function mapSource(val) {
  if (!val) return null;
  val = val.trim().toLowerCase();
  switch(val) {
    case "website": return "Website";
    case "referral": return "Referral";
    case "walk-in":
    case "walkin":
      return "WalkIn";
    case "call": return "Call";
    default: return "Other"; // fallback
  }
}

function mapTimeline(val) {
  if (!val) return null;
  val = val.trim();
  switch (val) {
    case "0-3m": return "ZeroToThreeMonths";
    case "3-6m": return "ThreeToSixMonths";
    case ">6m": return "MoreThanSixMonths";
    case "Exploring": return "Exploring";
    default: return null;
  }
}

function cleanValue(val) {
  if (!val) return null;
  return val.toString().trim().replace(/^"+|"+$/g, "").replace(/\r/g, "");
}

export default function ImportCSV() {
  const [file, setFile] = useState(null);

  async function handleUpload() {
    if (!file) return;

    const text = await file.text();
    const rows = text.split("\n").slice(1);

    const jsonRows = rows
      .map((row) => {
        const values = row.split(",");
        return {
          fullName: cleanValue(values[0]),
          email: cleanValue(values[1]),
          phone: cleanValue(values[2]),
          city: cleanValue(values[3]),
          propertyType: cleanValue(values[4]),
          bhk: mapBhk(cleanValue(values[5])),
          purpose: cleanValue(values[6]),
          budgetMin: parseInt(cleanValue(values[7])) || null,
          budgetMax: parseInt(cleanValue(values[8])) || null,
          timeline: mapTimeline(values[9]),
          source: mapSource(values[10]),
          notes: cleanValue(values[11]),
          tags: cleanValue(values[12])
            ? cleanValue(values[12]).split(";").map(t => t.trim())
            : [],
          status: cleanValue(values[13]) || "New",
        };
      })
      .filter((row) => row.fullName); // ignore empty rows

    const res = await fetch("/api/buyers/import", {
      method: "POST",
      body: JSON.stringify(jsonRows),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("Import Response:", data);
  }

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
      >
        Import CSV
      </button>
    </div>
  );
}
