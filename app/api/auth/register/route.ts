import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"
import { generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: "Please provide all required fields" }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      email,
      passwordHash: password,
      name,
    })

    const token = generateToken(user._id.toString())

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
