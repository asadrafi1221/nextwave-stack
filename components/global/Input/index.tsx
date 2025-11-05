import React from "react";
import { ShadcnInput } from "@/library/imports/components";
import { cn } from "@/lib/utils";

function Input({
  className,
  ...props
}: React.ComponentProps<typeof ShadcnInput>) {
  return <ShadcnInput className={cn("p-3 rounded-lg", className)} {...props} />;
}

export default Input;
