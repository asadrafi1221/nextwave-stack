import React from "react";
import { ShadcnButton } from "@/library/imports/components";
import { cn } from "@/lib/utils";

type ShadcnButtonProps = React.ComponentProps<typeof ShadcnButton>;

interface IButtonProps extends ShadcnButtonProps {
  children: React.ReactNode;
}

function Button({ children, className, ...props }: IButtonProps) {
  return (
    <ShadcnButton
      {...props}
      className={cn("min-w-[150px] py-3 lg:min-w-[170px] lg:py-5", className)}
    >
      {children}
    </ShadcnButton>
  );
}

export default Button;
