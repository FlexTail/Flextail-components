"use client";

import React, { createContext, useContext, forwardRef } from "react";
import { Check, X, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import {
  type TailwindColor,
  ROUNDED_VALUES,
  getColorClass,
  cn,
} from "../utils/FlexTail-config";

// --- Group Context Types and Setup ---

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

// --- Button Types and Presets ---

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "link"
  | "grayscale"
  | "binary";
type PresetType = "submit" | "cancel" | "delete" | "next" | "loading";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: TailwindColor | string;
  variant?: ButtonVariant;
  disabled?: boolean;
  radius?: keyof typeof ROUNDED_VALUES | string;
  active?: boolean;
  activeColor?: TailwindColor | string;
  href?: string;
  icon?: React.ReactNode | React.ElementType;
  iconPosition?: "top" | "bottom" | "left" | "right";
  iconSize?: string;
  alt?: string;
  preset?: PresetType;
  children?: React.ReactNode;
}

const PRESETS: Record<string, Partial<ButtonProps>> = {
  submit: {
    children: "Submit",
    icon: <Check />,
    color: "emerald",
    variant: "primary",
  },
  cancel: { children: "Cancel", icon: <X />, color: "slate", variant: "ghost" },
  delete: {
    children: "Delete",
    icon: <AlertTriangle />,
    color: "rose",
    variant: "primary",
  },
  next: {
    children: "Next",
    icon: <ArrowRight />,
    iconPosition: "right",
    color: "blue",
    variant: "secondary",
  },
  loading: {
    children: "Processing...",
    icon: <Loader2 />,
    color: "indigo",
    variant: "secondary",
    disabled: true,
  },
};

// --- Button Component ---

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      color = "indigo",
      variant = "primary",
      disabled = false,
      radius = "md",
      active = false,
      activeColor,
      href,
      icon: IconProp,
      iconPosition = "left",
      iconSize,
      alt,
      preset,
      className,
      children,
      style,
      type: htmlType = "button",
      ...props
    },
    ref
  ) => {
    const groupContext = useContext(ButtonGroupContext);
    const {
      isGrouped,
      groupPosition,
      groupDirection,
      groupRadius,
      groupColor,
      groupVariant,
      groupActiveColor,
    } = groupContext;

    const presetConfig = preset ? PRESETS[preset] : {};

    const baseColor = presetConfig.color || groupColor || color;
    const baseVariant = presetConfig.variant || groupVariant || variant;
    const baseActiveColor = groupActiveColor || activeColor;

    const activeConfig = {
      color: baseColor,
      variant: baseVariant,
      children: presetConfig.children || children,
      icon: presetConfig.icon || IconProp,
      iconPosition: presetConfig.iconPosition || iconPosition,
    };

    const isActiveState = active && isGrouped;

    let finalColor = activeConfig.color;
    let finalVariant = activeConfig.variant;

    if (isActiveState) {
      if (baseActiveColor) finalColor = baseActiveColor;
      if (finalVariant !== "binary" && finalVariant !== "grayscale") {
        finalVariant = "primary";
      }
    }

    const finalChildren = activeConfig.children;
    const FinalIcon = activeConfig.icon;
    const finalIconPos = activeConfig.iconPosition;

    const { className: colorClasses, style: colorStyles } = getColorClass(
      finalColor as string,
      finalVariant
    );

    const isVertical = groupDirection === "vertical";

    const effectiveRadius = isGrouped ? groupRadius : radius;

    const baseRadiusClass =
      ROUNDED_VALUES[effectiveRadius as keyof typeof ROUNDED_VALUES] ||
      `rounded-[${effectiveRadius}]`;

    const radiusClass = (() => {
      if (!isGrouped) return baseRadiusClass;

      const baseReset = "rounded-none";
      const radiusSuffix = baseRadiusClass.replace("rounded-", "");

      if (groupPosition === "middle") return baseReset;

      if (groupPosition === "first") {
        return isVertical
          ? `${baseReset} rounded-t-${radiusSuffix}`
          : `${baseReset} rounded-l-${radiusSuffix}`;
      }

      if (groupPosition === "last") {
        return isVertical
          ? `${baseReset} rounded-b-${radiusSuffix}`
          : `${baseReset} rounded-r-${radiusSuffix}`;
      }

      return baseReset;
    })();

    const groupSpacing = (() => {
      if (!isGrouped) return "";

      if (groupPosition === "middle")
        return isVertical ? "-mt-[1px]" : "-ml-[1px]";

      if (groupPosition === "first")
        return isVertical ? "mb-0 border-b-0" : "mr-0 border-r-0";

      return "";
    })();

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none relative";

    const responsiveSizeClasses =
      "px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base lg:px-6 lg:py-3.5 lg:text-lg";

    const iconSizeStyle = iconSize || "1.25rem";
    const gapSize = "gap-1.5 sm:gap-2";

    const flexDirection =
      finalIconPos === "top"
        ? "flex-col"
        : finalIconPos === "bottom"
        ? "flex-col-reverse"
        : finalIconPos === "right"
        ? "flex-row-reverse"
        : "flex-row";

    const computedClassName = cn(
      baseStyles,
      responsiveSizeClasses,
      radiusClass,
      disabled
        ? "bg-neutral-200 text-neutral-400 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-600 dark:border-neutral-800 shadow-none"
        : colorClasses,
      groupSpacing,
      flexDirection,
      gapSize,
      isActiveState
        ? "z-10 relative ring-2 ring-offset-1 ring-transparent"
        : isGrouped
        ? "z-0"
        : "",
      className
    );

    const mergedStyles = { ...colorStyles, ...style };

    const renderIcon = () => {
      if (!FinalIcon) return null;

      const iconClass = preset === "loading" ? "animate-spin" : "";
      const commonStyles = {
        width: iconSizeStyle,
        height: iconSizeStyle,
        animation: preset === "loading" ? "spin 1s linear infinite" : "none",
      };

      if (React.isValidElement(FinalIcon)) {
        return React.cloneElement(FinalIcon as React.ReactElement<any>, {
          style: { ...commonStyles, ...(FinalIcon.props as any).style },
          className: cn(iconClass, (FinalIcon.props as any).className),
          "aria-hidden": "true",
        });
      }

      if (typeof FinalIcon === "function") {
        const IconComp = FinalIcon as React.ElementType;
        return (
          <IconComp
            style={commonStyles}
            className={iconClass}
            aria-hidden="true"
          />
        );
      }

      return (
        <img
          src={FinalIcon as string}
          alt=""
          style={{ ...commonStyles, objectFit: "contain" }}
          className={iconClass}
          aria-hidden="true"
        />
      );
    };

    if (finalVariant === "link" && href && !disabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={computedClassName}
          style={mergedStyles}
          aria-label={
            alt || (typeof finalChildren === "string" ? finalChildren : "Link")
          }
          role="link"
        >
          {renderIcon()}
          {finalChildren && <span>{finalChildren}</span>}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={htmlType}
        disabled={disabled}
        className={computedClassName}
        style={mergedStyles}
        aria-label={
          typeof finalChildren === "string" ? finalChildren : "Button"
        }
        {...props}
      >
        {renderIcon()}
        {finalChildren && <span>{finalChildren}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
