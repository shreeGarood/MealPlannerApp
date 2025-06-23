export interface Ingredient {
  name: string
  amount: number
  unit: string
}

export interface Nutrition {
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface Recipe {
  _id: string
  userId: string
  title: string
  ingredients: Ingredient[]
  steps: string[]
  tags: string[]
  nutrition: Nutrition
  imageUrl?: string
  createdAt: string
}

export interface MealPlan {
  _id: string
  userId: string
  day: string
  mealType: string
  recipeId: Recipe
  createdAt: string
}

export interface GroceryItem {
  name: string
  amount: number
  unit: string
}
