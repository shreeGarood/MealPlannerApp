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

    // Get all meal plans for the user
    const mealPlans = await MealPlan.find({ userId }).populate("recipeId")

    // Extract all ingredients from the recipes
    const allIngredients: any[] = []

    mealPlans.forEach((plan) => {
      if (plan.recipeId && plan.recipeId.ingredients) {
        plan.recipeId.ingredients.forEach((ingredient: any) => {
          allIngredients.push({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          })
        })
      }
    })

    // Aggregate ingredients
    const aggregatedIngredients: Record<string, { amount: number; unit: string }> = {}

    allIngredients.forEach((ingredient) => {
      const key = ingredient.name.toLowerCase()

      if (aggregatedIngredients[key]) {
        // If the ingredient already exists, add the amount
        if (aggregatedIngredients[key].unit === ingredient.unit) {
          aggregatedIngredients[key].amount += ingredient.amount
        } else {
          // If units are different, keep them separate
          const newKey = `${key} (${ingredient.unit})`
          if (aggregatedIngredients[newKey]) {
            aggregatedIngredients[newKey].amount += ingredient.amount
          } else {
            aggregatedIngredients[newKey] = {
              amount: ingredient.amount,
              unit: ingredient.unit,
            }
          }
        }
      } else {
        // If the ingredient doesn't exist, add it
        aggregatedIngredients[key] = {
          amount: ingredient.amount,
          unit: ingredient.unit,
        }
      }
    })

    // Convert to array for easier handling in frontend
    const groceryList = Object.entries(aggregatedIngredients).map(([name, details]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      amount: details.amount,
      unit: details.unit,
    }))

    return NextResponse.json({ success: true, groceryList })
  } catch (error) {
    console.error("Get grocery list error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
