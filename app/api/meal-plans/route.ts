import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import MealPlan from "@/lib/models/mealplan"
import { authMiddleware } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req)

  if (auth instanceof NextResponse) {
    return auth
  }

  const { userId } = auth

  try {
    await connectDB()
    const mealPlans = await MealPlan.find({ userId }).populate("recipeId")
    return NextResponse.json({ success: true, mealPlans })
  } catch (error) {
    console.error("Get meal plans error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req)

  if (auth instanceof NextResponse) {
    return auth
  }

  const { userId } = auth

  try {
    const { day, mealType, recipeId } = await req.json()

    if (!day || !mealType || !recipeId) {
      return NextResponse.json({ success: false, message: "Please provide all required fields" }, { status: 400 })
    }

    await connectDB()

    // Check if meal plan already exists for this day and meal type
    const existingMealPlan = await MealPlan.findOne({
      userId,
      day,
      mealType,
    })

    if (existingMealPlan) {
      // Update existing meal plan
      existingMealPlan.recipeId = recipeId
      await existingMealPlan.save()

      const populatedMealPlan = await MealPlan.findById(existingMealPlan._id).populate("recipeId")
      return NextResponse.json({ success: true, mealPlan: populatedMealPlan })
    }

    // Create new meal plan
    const mealPlan = await MealPlan.create({
      userId,
      day,
      mealType,
      recipeId,
    })

    const populatedMealPlan = await MealPlan.findById(mealPlan._id).populate("recipeId")
    return NextResponse.json({ success: true, mealPlan: populatedMealPlan }, { status: 201 })
  } catch (error) {
    console.error("Create meal plan error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
