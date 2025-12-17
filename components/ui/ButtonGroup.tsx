// ButtonGroup.tsx
"use client";

import React, { createContext, useContext } from "react";
import {
  type TailwindColor,
  ROUNDED_VALUES,
  cn,
} from "../utils/FlexTail-config";

type GroupDirection = "vertical" | "horizontal";
type GroupPosition = "first" | "middle" | "last" | "none";

interface ButtonGroupContextProps {
  isGrouped: boolean;
  groupDirection: GroupDirection;
  groupRadius: keyof typeof ROUNDED_VALUES | string;
  groupPosition: GroupPosition;
  groupColor?: TailwindColor | string;
  groupVariant?: string;
  groupActiveColor?: TailwindColor | string;
}

// Default values for context, mainly used for components rendered outside a group
const defaultContext: ButtonGroupContextProps = {
  isGrouped: false,
  groupDirection: "horizontal",
  groupRadius: "md",
  groupPosition: "none",
};

export const ButtonGroupContext =
  createContext<ButtonGroupContextProps>(defaultContext);

// --- Button Group Component ---

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: GroupDirection;
  radius?: keyof typeof ROUNDED_VALUES | string;
  color?: TailwindColor | string;
  variant?: string;
  activeColor?: TailwindColor | string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  direction = "horizontal",
  radius = "md",
  color,
  variant,
  activeColor,
  className,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children).filter(
    React.isValidElement
  );

  const containerClasses = cn(
    "flex",
    direction === "vertical" ? "flex-col" : "flex-row",
    className
  );

  return (
    <div className={containerClasses} role="group" {...props}>
      {childrenArray.map((child, index) => {
        // Determine the position of the current button within the group
        let position: GroupPosition = "middle";
        if (index === 0) {
          position = "first";
        } else if (index === childrenArray.length - 1) {
          position = "last";
        }

        const contextValue: ButtonGroupContextProps = {
          isGrouped: true,
          groupDirection: direction,
          groupRadius: radius,
          groupPosition: position,
          groupColor: color,
          groupVariant: variant,
          groupActiveColor: activeColor,
        };

        // Inject the context into each Button child
        return (
          <ButtonGroupContext.Provider key={index} value={contextValue}>
            {child}
          </ButtonGroupContext.Provider>
        );
      })}
    </div>
  );
};

ButtonGroup.displayName = "ButtonGroup";
