import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Recipe from "@/lib/models/recipe"
import { authMiddleware } from "@/lib/auth"
import axios from "axios"

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req)
  if (auth instanceof NextResponse) return auth

  const { userId } = auth
  try {
    await connectDB()
    const recipes = await Recipe.find({ userId })
    return NextResponse.json({ success: true, recipes })
  } catch (error) {
    console.error("❌ Get recipes error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log("📡 we are in POST top")
  const auth = await authMiddleware(req)
  if (auth instanceof NextResponse) return auth

  const { userId } = auth

  try {
    const { title, ingredients, steps, tags, imageUrl } = await req.json()

    if (!title || !Array.isArray(ingredients) || ingredients.length === 0 || steps.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields (title, ingredients, steps)" },
        { status: 400 }
      )
    }

    // 🧪 Spoonacular API call with proper form-urlencoded body
    let nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 }

    try {
      const ingredientsList = ingredients.map((ing: any) => `${ing.amount} ${ing.unit} ${ing.name}`).join("\n")
      console.log("📡 Sending to Spoonacular:\n", ingredientsList)

      const response = await axios.post(
        "https://api.spoonacular.com/recipes/parseIngredients",
        `ingredientList=${encodeURIComponent(ingredientsList)}&includeNutrition=true&servings=1`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          params: {
            apiKey: process.env.SPOONACULAR_API_KEY,
          },
        }
      )

      console.log("✅ Spoonacular response received")

      let totalCalories = 0,
        totalProtein = 0,
        totalFat = 0,
        totalCarbs = 0

      response.data.forEach((item: any) => {
        const nutrients = item?.nutrition?.nutrients || []
        totalCalories += nutrients.find((n: any) => n.name === "Calories")?.amount || 0
        totalProtein += nutrients.find((n: any) => n.name === "Protein")?.amount || 0
        totalFat += nutrients.find((n: any) => n.name === "Fat")?.amount || 0
        totalCarbs += nutrients.find((n: any) => n.name === "Carbohydrates")?.amount || 0
      })

      nutrition = {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
        fat: Math.round(totalFat),
        carbs: Math.round(totalCarbs),
      }

      console.log("📊 Calculated Nutrition:", nutrition)
    } catch (error: any) {
      console.error("🧨 Spoonacular API error:", error?.response?.data || error.message || error)
    }

    await connectDB()
    const recipe = await Recipe.create({
      userId,
      title,
      ingredients,
      steps,
      tags: tags || [],
      nutrition,
      imageUrl: imageUrl || "",
    })

    return NextResponse.json({ success: true, recipe }, { status: 201 })
  } catch (error) {
    console.error("❌ Create recipe error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
