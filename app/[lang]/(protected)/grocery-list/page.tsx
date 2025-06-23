"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GroceryItem } from "@/types/recipe"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, FileDown, RefreshCw } from "lucide-react"
import { useParams } from "next/navigation"
import { dictionaries } from "@/lib/i18n/client-dictionary"

export default function GroceryListPage() {
  const { lang } = useParams() as { lang: "en" | "ar" }
  const dict = dictionaries[lang]?.grocery

  const [groceryList, setGroceryList] = useState<GroceryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const { toast } = useToast()

  useEffect(() => {
    fetchGroceryList()
  }, [])

  const fetchGroceryList = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await axios.get("/api/grocery-list", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setGroceryList(response.data.groceryList)
      setCheckedItems({})
    } catch (error) {
      console.error("Error fetching grocery list:", error)
      toast({
        variant: "destructive",
        title: dict?.errorTitle || "Error",
        description: dict?.errorLoad || "Failed to load grocery list",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleItem = (itemName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }))
  }

  const copyToClipboard = () => {
    const text = groceryList.map((item) => `${item.name}: ${item.amount} ${item.unit}`).join("\n")

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: dict?.clipboard || "Copied to clipboard",
          description: dict?.successCopy || "Grocery list copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        toast({
          variant: "destructive",
          title: dict?.errorTitle || "Error",
          description: dict?.errorCopy || "Failed to copy to clipboard",
        })
      })
  }

  const exportAsPDF = () => {
    toast({
      title: dict?.comingSoon || "Coming soon",
      description: "PDF export will be available in a future update",
    })
  }

  const groupedItems = groceryList.reduce<Record<string, GroceryItem[]>>((acc, item) => {
    const firstLetter = item.name.charAt(0).toUpperCase()
    if (!acc[firstLetter]) acc[firstLetter] = []
    acc[firstLetter].push(item)
    return acc
  }, {})

  const sortedGroups = Object.keys(groupedItems).sort()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{dict?.title || "Grocery List"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchGroceryList}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {dict?.refresh || "Refresh"}
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            {dict?.copy || "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={exportAsPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            {dict?.export || "Export"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dict?.listTitle || "Shopping List"}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <div className="pl-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : groceryList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{dict?.empty}</p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full" defaultValue={sortedGroups}>
              {sortedGroups.map((letter) => (
                <AccordionItem key={letter} value={letter}>
                  <AccordionTrigger className="text-lg font-semibold">{letter}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-1">
                      {groupedItems[letter].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox
                            id={`${item.name}-${index}`}
                            checked={checkedItems[item.name] || false}
                            onCheckedChange={() => handleToggleItem(item.name)}
                          />
                          <label
                            htmlFor={`${item.name}-${index}`}
                            className={`text-sm flex-1 ${
                              checkedItems[item.name] ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {item.name}
                          </label>
                          <span className="text-sm text-muted-foreground">
                            {item.amount} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
