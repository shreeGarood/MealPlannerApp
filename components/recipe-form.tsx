"use client"

import type React from "react"

import { useState } from "react"
import type { Recipe, Ingredient } from "@/types/recipe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RecipeFormProps {
  initialData?: Recipe
  onSubmit: (data: Partial<Recipe>) => void
  isSubmitting: boolean
}

export function RecipeForm({ initialData, onSubmit, isSubmitting }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialData?.ingredients || [])
  const [newIngredient, setNewIngredient] = useState({ name: "", amount: 1, unit: "g" })
  const [steps, setSteps] = useState<string[]>(initialData?.steps || [""])
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      setIngredients([...ingredients, { ...newIngredient }])
      setNewIngredient({ name: "", amount: 1, unit: "g" })
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleAddStep = () => {
    setSteps([...steps, ""])
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty steps
    const filteredSteps = steps.filter((step) => step.trim() !== "")

    onSubmit({
      title,
      ingredients,
      steps: filteredSteps,
      tags,
      imageUrl,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Recipe Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter recipe title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Ingredients</Label>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={ingredient.amount}
                onChange={(e) => {
                  const newIngredients = [...ingredients]
                  newIngredients[index].amount = Number.parseFloat(e.target.value) || 0
                  setIngredients(newIngredients)
                }}
                type="number"
                min="0"
                step="0.1"
                className="w-20"
              />
              <Input
                value={ingredient.unit}
                onChange={(e) => {
                  const newIngredients = [...ingredients]
                  newIngredients[index].unit = e.target.value
                  setIngredients(newIngredients)
                }}
                placeholder="unit"
                className="w-20"
              />
              <Input
                value={ingredient.name}
                onChange={(e) => {
                  const newIngredients = [...ingredients]
                  newIngredients[index].name = e.target.value
                  setIngredients(newIngredients)
                }}
                placeholder="Ingredient name"
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newIngredient.amount}
              onChange={(e) => setNewIngredient({ ...newIngredient, amount: Number.parseFloat(e.target.value) || 0 })}
              type="number"
              min="0"
              step="0.1"
              placeholder="Amt"
              className="w-20"
            />
            <Input
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
              placeholder="Unit"
              className="w-20"
            />
            <Input
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              placeholder="Add new ingredient"
              className="flex-1"
            />
            <Button type="button" variant="outline" size="icon" onClick={handleAddIngredient}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Steps</Label>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="mt-2 text-sm font-medium text-muted-foreground w-6">{index + 1}.</div>
              <Textarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1 min-h-[80px]"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveStep(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAddStep} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : initialData ? "Update Recipe" : "Create Recipe"}
      </Button>
    </form>
  )
}
