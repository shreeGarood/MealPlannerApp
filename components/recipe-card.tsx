"use client"

import type { Recipe } from "@/types/recipe"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface RecipeCardProps {
  recipe: Recipe
  onEdit: (recipe: Recipe) => void
  onDelete: (recipe: Recipe) => void
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Calories</span>
            <span className="font-medium">{recipe.nutrition?.calories || 0} kcal</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Protein</span>
            <span className="font-medium">{recipe.nutrition?.protein || 0}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Carbs</span>
            <span className="font-medium">{recipe.nutrition?.carbs || 0}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Fat</span>
            <span className="font-medium">{recipe.nutrition?.fat || 0}g</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Ingredients</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.ingredients.map((i) => i.name).join(", ")}
          </p>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(recipe)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(recipe)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
