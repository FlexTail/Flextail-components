import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React, { ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonShape = "squircle" | "circle" | "square";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonColor = "blue" | "red" | "green" | "yellow" | "gray";
export type ButtonType =
  | "button"
  | "submit"
  | "reset"
  | "default"
  | "add"
  | "error"
  | "accept"
  | "danger";

export interface OptimizedImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface IconDualSource {
  light?: IconProp;
  dark?: IconProp;
}

export type IconProp =
  | ReactNode
  | string
  | OptimizedImageProps
  | IconDualSource;

export const baseStyles =
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-opacity-50 disabled:opacity-50 disabled:pointer-events-none";

export const shapeStyles: Record<ButtonShape, string> = {
  squircle: "rounded-xl",
  circle: "rounded-full aspect-square",
  square: "rounded-lg",
};

export const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const iconImageSizeStyles: Record<ButtonSize, string> = {
  sm: "h-5 w-5 rounded-md",
  md: "h-6 w-6 rounded-lg",
  lg: "h-7 w-7 rounded-xl",
};

interface ColorMap {
  primaryBg: string;
  hoverPrimaryBg: string;
  secondaryBg: string;
  hoverSecondaryBg: string;
  text: string;
  focusRing: string;
}

export const COLOR_MAPS: Record<ButtonColor, ColorMap> = {
  blue: {
    primaryBg: "bg-blue-600",
    hoverPrimaryBg: "hover:bg-blue-700",
    secondaryBg: "bg-blue-100 dark:bg-blue-900/50",
    hoverSecondaryBg: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
    text: "text-blue-600 dark:text-blue-300",
    focusRing: "focus:ring-blue-500",
  },
  red: {
    primaryBg: "bg-red-600",
    hoverPrimaryBg: "hover:bg-red-700",
    secondaryBg: "bg-red-100 dark:bg-red-900/50",
    hoverSecondaryBg: "hover:bg-red-200 dark:hover:bg-red-800/50",
    text: "text-red-600 dark:text-red-300",
    focusRing: "focus:ring-red-500",
  },
  green: {
    primaryBg: "bg-green-600",
    hoverPrimaryBg: "hover:bg-green-700",
    secondaryBg: "bg-green-100 dark:bg-green-900/50",
    hoverSecondaryBg: "hover:bg-green-200 dark:hover:bg-green-800/50",
    text: "text-green-600 dark:text-green-300",
    focusRing: "focus:ring-green-500",
  },
  yellow: {
    primaryBg: "bg-yellow-600",
    hoverPrimaryBg: "hover:bg-yellow-700",
    secondaryBg: "bg-yellow-100 dark:bg-yellow-900/50",
    hoverSecondaryBg: "hover:bg-yellow-200 dark:hover:bg-yellow-800/50",
    text: "text-yellow-600 dark:text-yellow-300",
    focusRing: "focus:ring-yellow-500",
  },
  gray: {
    primaryBg: "bg-gray-700",
    hoverPrimaryBg: "hover:bg-gray-800",
    secondaryBg: "bg-gray-200 dark:bg-gray-700/50",
    hoverSecondaryBg: "hover:bg-gray-300 dark:hover:bg-gray-600/50",
    text: "text-gray-700 dark:text-gray-200",
    focusRing: "focus:ring-gray-400",
  },
};

export const getButtonClasses = (
  variant: ButtonVariant,
  color: ButtonColor,
  type: ButtonType,
  isDisabled: boolean
): string => {
  if (isDisabled) {
    return "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed shadow-none";
  }

  const colors = COLOR_MAPS[color];

  switch (variant) {
    case "primary":
      return cn(
        colors.primaryBg,
        colors.hoverPrimaryBg,
        "text-white shadow-md shadow-black/10",
        colors.focusRing
      );
    case "secondary":
      return cn(
        colors.secondaryBg,
        colors.hoverSecondaryBg,
        colors.text,
        "border border-transparent",
        colors.focusRing
      );
    case "ghost":
      return cn(
        "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
        colors.text,
        "border border-transparent",
        colors.focusRing
      );
    case "link":
      return cn(
        "bg-transparent",
        colors.text,
        "hover:underline",
        "p-0 shadow-none",
        colors.focusRing
      );
    default:
      return "";
  }
};

const Icon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const LoadingSpinnerSVG: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const Plus: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

export const X: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

export const Check: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

export const Danger: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.859 2.328 1.155 4.68 3.374 4.68h13.597c2.219 0 4.233-2.352 3.374-4.68l-6.8-18.441a1.5 1.5 0 0 0-2.695 0l-6.8 18.441Z"
    />
  </svg>
);
