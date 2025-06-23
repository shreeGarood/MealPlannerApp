import { type NextRequest, NextResponse } from "next/server"
import { serialize } from "cookie"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"
import { generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      console.log("❌ Missing email or password")
      return NextResponse.json({ success: false, message: "Please provide email and password" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      console.log("🚫 User not found")
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      console.log("🔐 Incorrect password")
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user._id.toString())

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    })

    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    )

    console.log("✅ Login successful — token set 🍪")
    return response
  } catch (error) {
    console.error("🔥 Login error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
