import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();

    const buyer = await prisma.buyer.create({
      data: {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone,
        city: data.city,
        propertyType: data.propertyType,
        bhk: data.bhk || null,
        purpose: data.purpose,
        budgetMin: data.budgetMin ? parseInt(data.budgetMin) : null,
        budgetMax: data.budgetMax ? parseInt(data.budgetMax) : null,
        timeline: data.timeline,
        source: data.source,
        notes: data.notes || null,
        tags: (() => {
          if (!data.tags) return [];
          try {
            return JSON.parse(data.tags); // valid JSON array
          } catch {
            return data.tags.split(",").map((t) => t.trim()); // fallback
          }
        })(),
        ownerId: data.ownerId, // pass from logged-in user
      },
    });

    return NextResponse.json(buyer, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create buyer" }, { status: 500 });
  }
}
