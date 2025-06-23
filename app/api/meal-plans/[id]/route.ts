import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import MealPlan from "@/lib/models/mealplan"
import { authMiddleware } from "@/lib/auth"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authMiddleware(req)

  if (auth instanceof NextResponse) {
    return auth
  }

  const { userId } = auth
  const { id } = params

  try {
    await connectDB()
    const mealPlan = await MealPlan.findOne({ _id: id, userId })

    if (!mealPlan) {
      return NextResponse.json({ success: false, message: "Meal plan not found" }, { status: 404 })
    }

    await MealPlan.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: "Meal plan deleted" })
  } catch (error) {
    console.error("Delete meal plan error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
