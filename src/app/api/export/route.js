import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const buyers = await prisma.buyer.findMany();

  // Header row
  let csv = "fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status\n";

  // Data rows
  buyers.forEach((b) => {
    csv += `${b.fullName},${b.email},${b.phone},${b.city},${b.propertyType},${b.bhk || ""},${b.purpose},${b.budgetMin},${b.budgetMax},${b.timeline},${b.source},${b.notes || ""},${b.tags || ""},${b.status}\n`;
  });

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=buyers.csv",
    },
  });
}
