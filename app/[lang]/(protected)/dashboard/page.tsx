"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeForm } from "@/components/recipe-form"
import type { Recipe } from "@/types/recipe"
import { dictionaries } from "@/lib/i18n/client-dictionary"

export default function DashboardPage() {
  const { lang } = useParams() as { lang: "en" | "ar" }
  const dict = dictionaries[lang]?.dashboard
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false)
  const [isEditRecipeOpen, setIsEditRecipeOpen] = useState(false)
  const [isDeleteRecipeOpen, setIsDeleteRecipeOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get("/api/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecipes(res.data.recipes)
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: dict.errorLoad })
    } finally {
      setLoading(false)
    }
  }

  const handleAddRecipe = async (data: Partial<Recipe>) => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const res = await axios.post("/api/recipes", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecipes([...recipes, res.data.recipe])
      setIsAddRecipeOpen(false)
      toast({ title: "Success", description: dict.successAdd })
    } catch {
      toast({ variant: "destructive", title: "Error", description: dict.errorAdd })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditRecipe = async (data: Partial<Recipe>) => {
    if (!currentRecipe) return
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const res = await axios.put(`/api/recipes/${currentRecipe._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecipes(recipes.map(r => r._id === currentRecipe._id ? res.data.recipe : r))
      setIsEditRecipeOpen(false)
      toast({ title: "Success", description: dict.successEdit })
    } catch {
      toast({ variant: "destructive", title: "Error", description: dict.errorEdit })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRecipe = async () => {
    if (!currentRecipe) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/api/recipes/${currentRecipe._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecipes(recipes.filter(r => r._id !== currentRecipe._id))
      setIsDeleteRecipeOpen(false)
      toast({ title: "Success", description: dict.successDelete })
    } catch {
      toast({ variant: "destructive", title: "Error", description: dict.errorDelete })
    }
  }

  return (
    <div className="container mx-auto py-6 px-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{dict.title}</h1>
        <Button onClick={() => setIsAddRecipeOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {dict.add}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-4">{dict.noRecipesTitle}</h2>
          <p className="text-gray-500 dark:text-gray-500 mb-6">{dict.noRecipesDesc}</p>
          <Button onClick={() => setIsAddRecipeOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {dict.add}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onEdit={(recipe) => {
                setCurrentRecipe(recipe)
                setIsEditRecipeOpen(true)
              }}
              onDelete={(recipe) => {
                setCurrentRecipe(recipe)
                setIsDeleteRecipeOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {/* Add Recipe Dialog */}
      <Dialog open={isAddRecipeOpen} onOpenChange={setIsAddRecipeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dict.dialogAddTitle}</DialogTitle>
            <DialogDescription>{dict.dialogAddDesc}</DialogDescription>
          </DialogHeader>
          <RecipeForm onSubmit={handleAddRecipe} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>

      {/* Edit Recipe Dialog */}
      <Dialog open={isEditRecipeOpen} onOpenChange={setIsEditRecipeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dict.dialogEditTitle}</DialogTitle>
            <DialogDescription>{dict.dialogEditDesc}</DialogDescription>
          </DialogHeader>
          {currentRecipe && (
            <RecipeForm initialData={currentRecipe} onSubmit={handleEditRecipe} isSubmitting={isSubmitting} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Recipe Confirmation */}
      <AlertDialog open={isDeleteRecipeOpen} onOpenChange={setIsDeleteRecipeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.confirmDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dict.confirmDeleteDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecipe}>{dict.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
