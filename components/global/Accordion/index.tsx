import { cn } from "@/lib/utils";
import {
  ShadcnAccordion,
  ShadcnAccordionContent,
  ShadcnAccordionItem,
  ShadcnAccordionTrigger,
} from "@/library/imports/components";
import React from "react";

interface IAccordion {
  type: "single" | "multiple";
  collapsable?: boolean;
  className?: string;
  options: {
    title: string;
    content: React.ReactNode;
    className?: string;
  }[];
}
function Accordion({ type, options, className, ...props }: IAccordion) {
  return (
    <ShadcnAccordion
      type={type}
      {...props}
      className={cn(
        "bg-[hsl(var(--primaryBg))] rounded-xl px-3 overflow-hidden text-[hsl(var(--primaryColor))]",
        className
      )}
    >
      {options.map((option, index) => (
        <ShadcnAccordionItem
          key={index}
          value={option.title}
          className={cn("", option.className)}
        >
          <ShadcnAccordionTrigger>{option.title}</ShadcnAccordionTrigger>
          <ShadcnAccordionContent>{option.content}</ShadcnAccordionContent>
        </ShadcnAccordionItem>
      ))}
    </ShadcnAccordion>
  );
}

export default Accordion;
