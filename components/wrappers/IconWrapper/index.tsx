"use client";

import Tooltip from "@/components/global/Tooltip";
import React from "react";

interface IconWrapperProps {
  children: React.ReactNode;
  label?: string | null;
}

function IconWrapper({ children, label }: IconWrapperProps) {
  const icon = (
    <span
      className="text-[var(--primaryColor)]"
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: label ? "help" : "default",
      }}
    >
      {children}
    </span>
  );

  return label ? <Tooltip content={label}>{icon}</Tooltip> : icon;
}

export default IconWrapper;
