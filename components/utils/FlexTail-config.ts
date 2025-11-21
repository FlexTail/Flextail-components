import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BUTTON_SIZES = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-base",
  lg: "px-6 py-3.5 text-lg",
  xl: "px-8 py-4 text-xl",
} as const;

export const ICON_SIZES = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "1.75rem",
} as const;

export const ROUNDED_VALUES = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

export const TAILWIND_COLORS = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
] as const;

export type TailwindColor = (typeof TAILWIND_COLORS)[number];

export const getColorClass = (
  color: TailwindColor | string,
  variant: string,
  isDark: boolean = false
) => {
  const isTailwind = TAILWIND_COLORS.includes(color as TailwindColor);

  if (!isTailwind) {
    return {
      style: { "--btn-color": color } as React.CSSProperties,
      className:
        variant === "outline"
          ? "border-[var(--btn-color)] text-[var(--btn-color)]"
          : variant === "ghost"
          ? "text-[var(--btn-color)] hover:bg-[var(--btn-color)]/10"
          : variant === "link"
          ? "text-[var(--btn-color)] decoration-[var(--btn-color)]"
          : "bg-[var(--btn-color)] text-white",
    };
  }

  const c = color as TailwindColor;

  const variants: Record<string, string> = {
    primary: `bg-${c}-600 text-white hover:bg-${c}-700 dark:bg-${c}-500 dark:hover:bg-${c}-400 shadow-sm`,
    secondary: `bg-${c}-100 text-${c}-900 hover:bg-${c}-200 dark:bg-${c}-900/40 dark:text-${c}-100 dark:hover:bg-${c}-900/60`,
    tertiary: `bg-${c}-50 text-${c}-700 hover:bg-${c}-100 dark:bg-${c}-900/20 dark:text-${c}-200`,
    outline: `border-2 border-${c}-500 text-${c}-600 hover:bg-${c}-50 dark:border-${c}-400 dark:text-${c}-400 dark:hover:bg-${c}-950`,
    ghost: `text-${c}-600 hover:bg-${c}-50 dark:text-${c}-400 dark:hover:bg-${c}-900/50`,
    link: `text-${c}-600 underline-offset-4 hover:underline decoration-${c}-600 p-0 h-auto dark:text-${c}-400`,
    grayscale: `bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700`,
    binary: `bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200`,
  };

  return { style: {}, className: variants[variant] || variants.primary };
};
