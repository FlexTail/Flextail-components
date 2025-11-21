"use client";

import React from "react";
import { Check, X, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import {
  type TailwindColor,
  BUTTON_SIZES,
  ROUNDED_VALUES,
  getColorClass,
  ICON_SIZES,
  cn,
} from "../utils/FlexTail-config";

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
  size?: keyof typeof BUTTON_SIZES;
  radius?: keyof typeof ROUNDED_VALUES | string;
  groupPosition?: "left" | "right" | "middle";
  groupDirection?: "vertical" | "horizontal";
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

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      color = "indigo",
      variant = "primary",
      disabled = false,
      size = "md",
      radius = "md",
      groupPosition,
      groupDirection = "horizontal",
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
    const activeConfig = preset
      ? { ...PRESETS[preset] }
      : { color, variant, children, icon: IconProp, iconPosition };

    // Active State Management
    const isGrouped = !!groupPosition;
    const isActiveState = active && isGrouped;

    let finalColor = activeConfig.color || color;
    let finalVariant = activeConfig.variant || variant;

    if (isActiveState) {
      if (activeColor) finalColor = activeColor;
      if (finalVariant !== "binary" && finalVariant !== "grayscale") {
        finalVariant = "primary";
      }
    }

    const finalChildren = activeConfig.children || children;
    const FinalIcon = activeConfig.icon || IconProp;
    const finalIconPos = activeConfig.iconPosition || iconPosition;

    const { className: colorClasses, style: colorStyles } = getColorClass(
      finalColor as string,
      finalVariant
    );

    const isVertical = groupDirection === "vertical";

    const radiusClass = (() => {
      if (groupPosition === "middle") return "rounded-none";
      const baseRadius =
        ROUNDED_VALUES[radius as keyof typeof ROUNDED_VALUES] ||
        `rounded-[${radius}]`;
      if (groupPosition === "left")
        return isVertical ? "rounded-b-none" : "rounded-r-none";
      if (groupPosition === "right")
        return isVertical ? "rounded-t-none" : "rounded-l-none";
      return baseRadius;
    })();

    const groupSpacing = (() => {
      if (!groupPosition) return "";
      if (groupPosition === "middle")
        return isVertical ? "border-y-0 my-0" : "border-x-0 mx-0";
      if (groupPosition === "left")
        return isVertical ? "mb-0 border-b-0" : "mr-0 border-r-0";
      if (groupPosition === "right")
        return isVertical ? "mt-0 border-t-0" : "ml-0 border-l-0";
      return "";
    })();

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";
    const sizeClasses =
      BUTTON_SIZES[size as keyof typeof BUTTON_SIZES] || "p-3";
    const iconSizeStyle =
      iconSize || ICON_SIZES[size as keyof typeof ICON_SIZES] || "1rem";
    const flexDirection =
      finalIconPos === "top"
        ? "flex-col"
        : finalIconPos === "bottom"
        ? "flex-col-reverse"
        : finalIconPos === "right"
        ? "flex-row-reverse"
        : "flex-row";
    const gapSize = size === "xs" ? "gap-1.5" : "gap-2";

    const computedClassName = cn(
      baseStyles,
      sizeClasses,
      radiusClass,
      disabled
        ? "bg-neutral-200 text-neutral-400 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-600 dark:border-neutral-800 shadow-none"
        : colorClasses,
      groupSpacing,
      flexDirection,
      gapSize,
      isActiveState
        ? "z-10 relative ring-2 ring-offset-1 ring-transparent"
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

      // 1. React Element (e.g., <Star />)
      if (React.isValidElement(FinalIcon)) {
        return React.cloneElement(FinalIcon as React.ReactElement<any>, {
          style: { ...commonStyles, ...(FinalIcon.props as any).style },
          className: cn(iconClass, (FinalIcon.props as any).className),
          "aria-hidden": "true",
        });
      }

      // 2. Component Function (e.g., Star)
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

      // 3. Image URL (String)
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
