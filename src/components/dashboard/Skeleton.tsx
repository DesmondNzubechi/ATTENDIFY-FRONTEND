// components/ui/skeleton.tsx
import React from "react";
import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
};
