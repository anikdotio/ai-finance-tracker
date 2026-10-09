import React from "react";
import {
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Repeat,
  Zap,
  Film,
  HeartPulse,
  Briefcase,
  GraduationCap,
  Plane,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Gift,
} from "lucide-react";

export function getCategoryIcon(category = "") {
  const c = category.toLowerCase();
  if (c.includes("grocer")) return ShoppingCart;
  if (c.includes("din") || c.includes("food") || c.includes("restaur")) return Utensils;
  if (c.includes("trans") || c.includes("car") || c.includes("metro")) return Car;
  if (c.includes("hous") || c.includes("rent")) return Home;
  if (c.includes("sub") || c.includes("stream") || c.includes("recur")) return Repeat;
  if (c.includes("util") || c.includes("power") || c.includes("water") || c.includes("electr")) return Zap;
  if (c.includes("entert") || c.includes("cinem") || c.includes("movi")) return Film;
  if (c.includes("health") || c.includes("pharm") || c.includes("med")) return HeartPulse;
  if (c.includes("sal") || c.includes("pay") || c.includes("job")) return Briefcase;
  if (c.includes("edu") || c.includes("school")) return GraduationCap;
  if (c.includes("trav") || c.includes("flight")) return Plane;
  if (c.includes("shop") || c.includes("store")) return ShoppingBag;
  if (c.includes("invest")) return TrendingUp;
  if (c.includes("gift")) return Gift;
  return DollarSign;
}

export function CategoryIcon({ category = "", className = "w-4 h-4 text-[#8E8E93]" }) {
  const IconComponent = getCategoryIcon(category);
  return <IconComponent className={className} />;
}
