import { type NextRequest, NextResponse } from "next/server"
import { authMiddleware } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req)

  if (auth instanceof NextResponse) {
    return auth
  }

  const { user } = auth

  return NextResponse.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  })
}
