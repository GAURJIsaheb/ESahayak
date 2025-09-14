import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const buyers = data.map(b => ({
      ...b,
      ownerId: session.user.id,
      bhk: b.bhk || null,
      timeline: b.timeline || "Exploring",
      status: b.status || "New",
    }));

    const result = await prisma.buyer.createMany({
      data: buyers,
      skipDuplicates: true,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
