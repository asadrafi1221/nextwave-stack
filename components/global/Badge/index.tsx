"use client";

import React from "react";
import { ShadcnBadge } from "@/library/imports/components";
import { cn } from "@/lib/utils";

interface IBadge {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

function Badge({ children, variant = "default", className }: IBadge) {
  return (
    <ShadcnBadge variant={variant} className={cn("rounded-xl", className)}>
      {children}
    </ShadcnBadge>
  );
}

export default Badge;
