import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      )
    }


    const user = await prisma.user.create({
      data: {
        email,
        password, 
        name,
        role: "user", 
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
