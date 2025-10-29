import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
} from "react";
import { twMerge } from "tailwind-merge";

type ClassValue =
  | string
  | number
  | ClassValue[]
  | { [key: string]: boolean }
  | null
  | undefined;
type ButtonVariant =
  | "primary"
  | "secondary"
  | "subtle"
  | "outline"
  | "ghost"
  | "link";
type ButtonShape = "square" | "rounded" | "squircle" | "circle";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "gray"
  | "indigo"
  | "pink"
  | "purple"
  | "cyan";

function cn(...inputs: ClassValue[]) {
  const clsx = (input: ClassValue): string => {
    if (typeof input === "string") return input;
    if (Array.isArray(input)) {
      return input.map(clsx).filter(Boolean).join(" ");
    }
    if (typeof input === "object" && input !== null) {
      return Object.entries(input)
        .filter(([, value]) => !!value)
        .map(([key]) => key)
        .join(" ");
    }
    return "";
  };
  return twMerge(clsx(inputs));
}

const LoadingSpinnerSVG = ({
  className = "h-5 w-5",
}: {
  className?: string;
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
const X = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactElement;
  iconPosition?: "left" | "right";
}

const getButtonClasses = ({
  variant = "primary",
  size = "md",
  color = "blue",
  shape = "rounded",
  loading,
  disabled,
}: Omit<ButtonProps, "children">): string => {
  const base =
    "font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2";

  const sizeClasses = {
    xs: "h-6 px-2 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    xl: "h-14 px-8 text-lg",
  };

  const shapeClasses = {
    square: "rounded-lg",
    rounded: "rounded-full",
    squircle: "rounded-xl",
    circle: "rounded-full aspect-square p-0",
  };

  const colorMap = {
    blue: {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
      secondary:
        "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    },
  };

  const variantMap = {
    primary: colorMap[color]?.primary || colorMap.blue.primary,
    secondary: colorMap[color]?.secondary || colorMap.blue.secondary,
    subtle:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700",
    ghost:
      "bg-transparent text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
    link: "bg-transparent text-blue-600 hover:text-blue-700 underline dark:text-blue-400 dark:hover:text-blue-300",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const finalVariantClass = variantMap[variant] || variantMap.primary;

  return cn(
    base,
    sizeClasses[size],
    shapeClasses[shape],
    finalVariantClass,
    disabledClasses,
    loading ? "pointer-events-none" : ""
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      color = "blue",
      shape = "rounded",
      loading,
      disabled,
      icon,
      iconPosition = "left",
      onClick,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const finalClassName = cn(
      getButtonClasses({
        variant,
        size,
        color,
        shape,
        loading,
        disabled: isDisabled,
      }),
      className,
      "flex items-center justify-center"
    );

    const renderIcon = () => {
      if (loading) {
        const spinnerClass = cn(
          "h-4 w-4",
          variant === "primary" || color === "red"
            ? "text-white"
            : "text-current"
        );
        return <LoadingSpinnerSVG className={spinnerClass} />;
      }
      return icon;
    };

    const iconElement = renderIcon();

    return (
      <button
        ref={ref}
        className={finalClassName}
        disabled={isDisabled}
        onClick={onClick}
        {...rest}
      >
        <div className={cn("flex items-center gap-2")}>
          {iconElement && iconPosition === "left" && iconElement}
          {children && <span>{children}</span>}
          {iconElement && iconPosition === "right" && iconElement}
        </div>
      </button>
    );
  }
);
Button.displayName = "Button";

interface AlertDialogAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  color?: ButtonColor;
  loading?: boolean;
  disabled?: boolean;
  isDefault?: boolean;
  isDestructive?: boolean;
}

interface AlertDialogProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description: ReactNode;
  actions: AlertDialogAction[];
}

const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(
  (
    { isOpen, onClose, title, description, actions, ...props },
    forwardedRef
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          dialogRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }
      },
      [forwardedRef]
    );

    const triggerElementRef = useRef<HTMLElement | null>(null);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      triggerElementRef.current = document.activeElement as HTMLElement | null;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        } else if (event.key === "Tab" && dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;

          if (focusableElements.length === 0) return;

          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      requestAnimationFrame(() => {
        if (dialogRef.current) {
          const defaultButton = dialogRef.current.querySelector(
            '[data-default="true"]'
          ) as HTMLButtonElement;
          const focusable = dialogRef.current.querySelector(
            "button, [href], input, select, textarea"
          ) as HTMLElement;

          if (defaultButton) {
            defaultButton.focus();
          } else if (focusable) {
            focusable.focus();
          } else {
            dialogRef.current.focus();
          }
        }
      });

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (triggerElementRef.current) {
          triggerElementRef.current.focus();
        }
      };
    }, [isOpen, handleClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    };

    if (!isOpen) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 dark:bg-black/80 transition-opacity duration-300"
        onClick={handleBackdropClick}
      >
        <div
          ref={combinedRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className={cn(
            "relative w-full max-w-sm sm:max-w-md",
            "rounded-2xl shadow-2xl transition-all duration-300",
            "bg-white dark:bg-slate-800",
            "border border-gray-100 dark:border-slate-700",
            "p-6 sm:p-8"
          )}
          tabIndex={-1}
          {...props}
        >
          <Button
            variant="ghost"
            shape="circle"
            size="sm"
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="h-4 w-4" />
          </Button>

          <h2
            id="alert-dialog-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-snug"
          >
            {title}
          </h2>

          <p
            id="alert-dialog-description"
            className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6"
          >
            {description}
          </p>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4">
            {actions.map((action, index) => {
              const buttonVariant = action.isDestructive
                ? "primary"
                : action.variant || "outline";
              const buttonColor = action.isDestructive
                ? "red"
                : action.color || "gray";

              const isDefaultButton =
                action.isDefault || index === actions.length - 1;

              return (
                <Button
                  key={action.label}
                  onClick={action.onClick}
                  variant={buttonVariant}
                  color={buttonColor}
                  loading={action.loading}
                  disabled={action.disabled}
                  size="md"
                  className="w-full sm:w-auto"
                  data-default={isDefaultButton ? "true" : undefined}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

AlertDialog.displayName = "AlertDialog";
