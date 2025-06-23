"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { dictionaries } from "@/lib/i18n/client-dictionary";
import type { MealPlan, Recipe } from "@/types/recipe";

const EN_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const EN_MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function MealPlannerPage() {
  const { lang } = useParams() as { lang: "en" | "ar" };
  const dict = dictionaries[lang]?.mealPlanner;
  const days = dict.days;
  const mealTypes = dict.mealTypes;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [isDeleteMealOpen, setIsDeleteMealOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [recipesRes, mealPlansRes] = await Promise.all([
        axios.get("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRecipes(recipesRes.data.recipes);
      setMealPlans(mealPlansRes.data.mealPlans);
    } catch (error) {
      toast({
        variant: "destructive",
        title: dict?.errorTitle || "Error",
        description: dict?.errorDesc || "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!selectedDay || !selectedMealType || !selectedRecipeId) {
      toast({
        variant: "destructive",
        title: dict?.errorTitle || "Error",
        description: dict?.emptyError || "Please select all fields",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/meal-plans",
        {
          day: EN_DAYS[days.indexOf(selectedDay)],
          mealType: EN_MEAL_TYPES[mealTypes.indexOf(selectedMealType)],
          recipeId: selectedRecipeId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const index = mealPlans.findIndex(
        (mp) =>
          mp.day === EN_DAYS[days.indexOf(selectedDay)] &&
          mp.mealType === EN_MEAL_TYPES[mealTypes.indexOf(selectedMealType)]
      );

      const updatedPlans = [...mealPlans];
      if (index !== -1) {
        updatedPlans[index] = response.data.mealPlan;
      } else {
        updatedPlans.push(response.data.mealPlan);
      }

      setMealPlans(updatedPlans);
      setIsAddMealOpen(false);
      resetForm();

      toast({ title: dict?.success || "Meal added to plan" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: dict?.errorTitle || "Error",
        description: dict?.error || "Failed to add meal to plan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeal = async () => {
    if (!currentMealPlan) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/meal-plans/${currentMealPlan._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMealPlans(mealPlans.filter((mp) => mp._id !== currentMealPlan._id));
      setIsDeleteMealOpen(false);

      toast({ title: dict?.successRemove || "Meal removed from plan" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: dict?.errorTitle || "Error",
        description: dict?.errorDelete || "Failed to remove meal from plan",
      });
    }
  };

  const resetForm = () => {
    setSelectedDay("");
    setSelectedMealType("");
    setSelectedRecipeId("");
  };

  const getMealByTypeForDay = (day: string, mealType: string) => {
    const enDay = EN_DAYS[days.indexOf(day)];
    const enMealType = EN_MEAL_TYPES[mealTypes.indexOf(mealType)];
    return mealPlans.find(
      (mp) => mp.day === enDay && mp.mealType === enMealType
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{dict?.title}</h1>
        <Button onClick={() => setIsAddMealOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {dict?.add}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {days.map((day) => (
            <div key={day} className="space-y-4">
              <Skeleton className="h-8 w-full" />
              {mealTypes.map((type) => (
                <Skeleton key={type} className="h-32 w-full" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {days.map((day) => (
            <div key={day} className="space-y-4">
              <h2 className="font-semibold text-center border-b pb-2">{day}</h2>
              {mealTypes.map((type) => {
                const meal = getMealByTypeForDay(day, type);
                return (
                  <Card key={type}>
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      {meal ? (
                        <div className="relative">
                          <div
                            className={`text-sm font-medium ${
                              lang === "ar" ? "pl-6 text-right" : "pr-6"
                            }`}
                          >
                            {meal.recipeId.title}
                          </div>
                          <div
                            className={`text-xs text-muted-foreground mt-1 ${
                              lang === "ar" ? "pl-6 text-right" : "pr-6"
                            }`}
                          >
                            {meal.recipeId.nutrition?.calories || 0} kcal
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute top-0 ${
                              lang === "ar" ? "left-0" : "right-0"
                            } h-6 w-6`}
                            onClick={() => {
                              setCurrentMealPlan(meal);
                              setIsDeleteMealOpen(true);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-full justify-start text-muted-foreground"
                          onClick={() => {
                            setSelectedDay(day);
                            setSelectedMealType(type);
                            setIsAddMealOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {dict?.add}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Add Meal Dialog */}
      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict?.dialogAddTitle}</DialogTitle>
            <DialogDescription>{dict?.dialogAddDesc}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Day Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{dict?.day}</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder={dict?.selectDay} />
                </SelectTrigger>
                <SelectContent>
                  {days.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meal Type Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{dict?.mealType}</label>
              <Select
                value={selectedMealType}
                onValueChange={setSelectedMealType}
              >
                <SelectTrigger>
                  <SelectValue placeholder={dict?.selectMealType} />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recipe Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{dict?.recipe}</label>
              <Select
                value={selectedRecipeId}
                onValueChange={setSelectedRecipeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={dict?.selectRecipe} />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((r) => (
                    <SelectItem key={r._id} value={r._id}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAddMeal} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : dict?.addToPlan}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Meal Dialog */}
      <AlertDialog open={isDeleteMealOpen} onOpenChange={setIsDeleteMealOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict?.confirmDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {dict?.confirmDeleteDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict?.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMeal}>
              {dict?.remove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
