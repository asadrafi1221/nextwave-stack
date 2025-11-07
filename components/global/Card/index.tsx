import React from "react";
import {
  ShadcnCard,
  ShadcnCardHeader,
  ShadcnCardContent,
  ShadcnCardFooter,
} from "@/library/imports/components";
import { cn } from "@/lib/utils";

interface ICard extends React.ComponentProps<typeof ShadcnCard> {
  children: React.ReactNode;
}

function Card({ children, className, ...props }: ICard) {
  return (
    <ShadcnCard className={cn(``,className)} {...props}>
      {children}
    </ShadcnCard>
  );
}

const Header = ({ children }: { children: React.ReactNode }) => (
  <ShadcnCardHeader>{children}</ShadcnCardHeader>
);

const Content = ({ children }: { children: React.ReactNode }) => (
  <ShadcnCardContent>{children}</ShadcnCardContent>
);

const Footer = ({ children }: { children: React.ReactNode }) => (
  <ShadcnCardFooter>{children}</ShadcnCardFooter>
);

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;

export default Card;
