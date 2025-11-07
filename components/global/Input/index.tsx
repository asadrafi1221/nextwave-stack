import React from "react";
import { ShadcnInput } from "@/library/imports/components";
import { cn } from "@/lib/utils";

interface IInput extends React.ComponentProps<typeof ShadcnInput> {
  className?: string;
}
function Input({ className, ...props }: IInput) {
  return <ShadcnInput className={cn("p-3 rounded-lg", className)} {...props} />;
}

export default Input;
