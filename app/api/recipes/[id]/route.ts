import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Recipe from "@/lib/models/recipe"
import { authMiddleware } from "@/lib/auth"
import axios from "axios"


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authMiddleware(req)
  if (auth instanceof NextResponse) return auth
  const { userId } = auth
  const { id } = params

  try {
    await connectDB()
    const recipe = await Recipe.findOne({ _id: id, userId })
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, recipe })
  } catch (error) {
    console.error("❌ Get recipe error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const auth = await authMiddleware(req)
  if (auth instanceof NextResponse) return auth
  const { userId } = auth
  const { id } = context.params
  try {
    const { title, ingredients, steps, tags, imageUrl } = await req.json()

    if (!title || !Array.isArray(ingredients) || ingredients.length === 0 || steps.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields (title, ingredients, steps)" },
        { status: 400 }
      )
    }

    await connectDB()

    const recipe = await Recipe.findOne({ _id: id, userId })
    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }

    // 🧪 Recalculate nutrition with Spoonacular
    let nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 }

    try {
      const ingredientsList = ingredients.map((ing: any) => `${ing.amount} ${ing.unit} ${ing.name}`).join("\n")
      console.log("📡 Updating via Spoonacular:", ingredientsList)

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
      
      

      console.log("✅ Spoonacular update response:", response.data)
      console.log("✅ Spoonacular raw response:", JSON.stringify(response.data, null, 2))


      response.data.forEach((item: any) => {
        if (item.nutrition) {
          nutrition.calories += item.nutrition.nutrients.find((n: any) => n.name === "Calories")?.amount || 0
          nutrition.protein += item.nutrition.nutrients.find((n: any) => n.name === "Protein")?.amount || 0
          nutrition.fat += item.nutrition.nutrients.find((n: any) => n.name === "Fat")?.amount || 0
          nutrition.carbs += item.nutrition.nutrients.find((n: any) => n.name === "Carbohydrates")?.amount || 0
        }
      })

      nutrition = {
        calories: Math.round(nutrition.calories),
        protein: Math.round(nutrition.protein),
        fat: Math.round(nutrition.fat),
        carbs: Math.round(nutrition.carbs),
      }
    } catch (error: any) {
      console.error("🧨 Spoonacular update error:", error?.response?.data || error.message || error)
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        ingredients,
        steps,
        tags,
        imageUrl,
        nutrition, // ← 🔥 Save the recalculated values
      },
      { new: true }
    )

    return NextResponse.json({ success: true, recipe: updatedRecipe })
  } catch (error) {
    console.error("❌ Update recipe error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authMiddleware(req)

  if (auth instanceof NextResponse) {
    return auth
  }

  const { userId } = auth
  const { id } = params

  try {
    await connectDB()
    const recipe = await Recipe.findOne({ _id: id, userId })

    if (!recipe) {
      return NextResponse.json({ success: false, message: "Recipe not found" }, { status: 404 })
    }

    await Recipe.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: "Recipe deleted" })
  } catch (error) {
    console.error("Delete recipe error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

