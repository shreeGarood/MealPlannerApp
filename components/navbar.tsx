"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChefHat, Calendar, ShoppingCart, LogOut } from "lucide-react";
import type { RootState } from "@/lib/redux/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dictionaries } from "@/lib/i18n/client-dictionary";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Globe } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { lang } = useParams() as { lang: "en" | "ar" };
  const dict = dictionaries[lang];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    dispatch(clearCredentials());
    router.push(`/${lang}/login`);
  };

  const routes = [
    {
      name: dict.dashboard.title,
      path: `/${lang}/dashboard`,
      icon: <ChefHat className="h-5 w-5 mr-2" />,
    },
    {
      name: dict.mealPlanner.title,
      path: `/${lang}/meal-planner`,
      icon: <Calendar className="h-5 w-5 mr-2" />,
    },
    {
      name: dict.grocery.title,
      path: `/${lang}/grocery-list`,
      icon: <ShoppingCart className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href={`/${lang}/dashboard`} className="flex items-center">
            <ChefHat className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mr-2" />
            <span className="font-bold text-xl">MealPlanner</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`flex items-center text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                pathname === route.path
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-emerald-100 text-emerald-800">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
               
                <DropdownMenuItem className="px-2 py-1 hover:bg-transparent cursor-default">
                  <div className="w-full">
                    <div className="flex items-center gap-2 text-sm font-medium ">
                      <Globe className="h-4 w-4" />
                      <span>{dict.layout.language || "Language"}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {lang === "en" ? "🇬🇧 English" : "🇸🇦 العربية"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full">
                        <DropdownMenuItem
                          onClick={() => {
                            if (lang !== "en") {
                              const segments = pathname.split("/");
                              segments[1] = "en";
                              router.push(segments.join("/"));
                            }
                          }}
                        >
                          🇬🇧 English
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            if (lang !== "ar") {
                              const segments = pathname.split("/");
                              segments[1] = "ar";
                              router.push(segments.join("/"));
                            }
                          }}
                        >
                          🇸🇦 العربية
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{dict.layout.logout}</span>{" "}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${lang}/dashboard`}
                    className="flex items-center"
                    onClick={() => setOpen(false)}
                  >
                    <ChefHat className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mr-2" />
                    <span className="font-bold text-xl">MealPlanner</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`flex items-center py-2 text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                        pathname === route.path
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {route.icon}
                      {route.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {dict.layout.logout}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
