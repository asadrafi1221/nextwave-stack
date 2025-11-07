"use client";

import React from "react";
import {
  ShadcnTooltip,
  ShadcnTooltipTrigger,
  ShadcnTooltipContent,
  ShadcnTooltipProvider,
} from "@/library/imports/components";

interface ITooltip extends React.ComponentProps<typeof ShadcnTooltip> {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  animation?: "default" | "fast" | "bounce" | "retro";
}

function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  animation = "default",
  ...props
}: ITooltip) {
  const animations: Record<string, string> = {
    default:
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    fast: "animate-in fade-in-0 zoom-in-100 duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-100",
    bounce:
      "animate-in fade-in-0 animate-bounce-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
    retro:
      "animate-in fade-in-0 animate-retro-pop data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
  };

  return (
    <ShadcnTooltipProvider delayDuration={100}>
      <ShadcnTooltip {...props}>
        <ShadcnTooltipTrigger asChild>{children}</ShadcnTooltipTrigger>
        <ShadcnTooltipContent
          side={side}
          align={align}
          className={animations[animation]}
        >
          {content}
        </ShadcnTooltipContent>
      </ShadcnTooltip>
    </ShadcnTooltipProvider>
  );
}

export default Tooltip;
