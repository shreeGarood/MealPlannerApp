import jwt from "jsonwebtoken"
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "./db"
import User from "./models/user"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  })
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

export const authMiddleware = async (req: NextRequest) => {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(decoded.userId).select("-passwordHash")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return { userId: user._id, user }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
