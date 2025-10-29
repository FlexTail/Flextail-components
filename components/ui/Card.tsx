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

// --- START: UTILITIES & CORE TYPES (Simulating Import from flextail-config.ts) ---

type ClassValue =
  | string
  | number
  | ClassValue[]
  | { [key: string]: boolean }
  | null
  | undefined;
function clsx(...inputs: ClassValue[]) {
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
  return clsx(inputs);
}
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

type CardColor =
  | "orange"
  | "red"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "default";

const colorShades = {
  default: {
    primary: 600,
    primaryDark: 500,
    secondary: 200,
    secondaryDark: 700,
  },
  orange: {
    primary: 600,
    primaryDark: 700,
    secondary: 200,
    secondaryDark: 800,
  },
  red: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  amber: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  yellow: {
    primary: 500,
    primaryDark: 600,
    secondary: 200,
    secondaryDark: 700,
  },
  lime: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  green: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  emerald: {
    primary: 600,
    primaryDark: 700,
    secondary: 200,
    secondaryDark: 800,
  },
  teal: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  cyan: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  sky: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  blue: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  indigo: {
    primary: 600,
    primaryDark: 700,
    secondary: 200,
    secondaryDark: 800,
  },
  violet: {
    primary: 600,
    primaryDark: 700,
    secondary: 200,
    secondaryDark: 800,
  },
  purple: {
    primary: 600,
    primaryDark: 700,
    secondary: 200,
    secondaryDark: 800,
  },
  fuchsia: {
    primary: 600,
    primaryDark: 700,
    secondary: 200,
    secondaryDark: 800,
  },
  pink: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  rose: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  slate: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  gray: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  zinc: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
  neutral: {
    primary: 600,
    primaryDark: 700,
    secondary: 200,
    secondaryDark: 800,
  },
  stone: { primary: 600, primaryDark: 700, secondary: 200, secondaryDark: 800 },
};

const getBgClasses = (
  colorName: CardColor,
  isDark: boolean,
  isPrimary: boolean
): string => {
  const shades = colorShades[colorName];
  if (!shades) return "";

  type ShadeKey = "primary" | "primaryDark" | "secondary" | "secondaryDark";
  const shadeKey = isPrimary ? "primary" : "secondary";
  const finalShadeKey = (isDark ? `${shadeKey}Dark` : shadeKey) as ShadeKey;
  const shade = shades[finalShadeKey];
  const textColorClass = colorName === "yellow" ? "text-black" : "text-white";
  const darkTextColorClass =
    colorName === "yellow" ? "dark:text-black" : "dark:text-white";

  const bgClass = `${isDark ? "dark:" : ""}bg-${colorName}-${shade}`;
  const textColor = isDark ? darkTextColorClass : textColorClass;

  return cn(bgClass, textColor);
};

// --- END: UTILITIES & CORE TYPES ---

// --- START: ICONS ---
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
// --- END: ICONS ---

// --- START: BUTTON COMPONENT (Reused from previous, un-commented) ---
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
    red: {
      primary:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      secondary:
        "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700",
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
// --- END: BUTTON COMPONENT ---

// --- START: ALERT DIALOG COMPONENT (Reused from previous, un-commented) ---
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
            (
              forwardedRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
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
// --- END: ALERT DIALOG COMPONENT ---

// --- START: CARD COMPONENTS (Refactored) ---

type CardLayout = "vertical" | "horizontal";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  variant?: "primary" | "secondary" | "transparent" | "blurred" | "default";
  color?: CardColor;
  layout?: CardLayout;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      children,
      variant = "default",
      color,
      layout = "vertical",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "p-4 sm:p-6 lg:p-8 w-full h-fit transition-all duration-300 shadow-md sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden";

    const getVariantClasses = (): string => {
      if (variant === "primary" || variant === "secondary") {
        const selectedColor = color || "default";
        return cn(
          getBgClasses(selectedColor, false, variant === "primary"),
          getBgClasses(selectedColor, true, variant === "primary"),
          "shadow-lg"
        );
      }

      switch (variant) {
        case "transparent":
          return "bg-transparent border border-gray-200 dark:border-gray-800";
        case "blurred":
          return "backdrop-filter backdrop-blur-xl bg-black/20 text-white";
        default:
          return "border bg-white text-gray-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white";
      }
    };

    const getLayoutClasses = (): string => {
      if (layout === "horizontal") {
        return "flex flex-col md:flex-row justify-center items-center";
      }
      return "flex flex-col justify-center items-center";
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          getVariantClasses(),
          getLayoutClasses(),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

type ObjectFit = "fill" | "contain" | "cover" | "none" | "scale-down";

const objectFitMap: Record<ObjectFit, string> = {
  fill: "object-fill",
  contain: "object-contain",
  cover: "object-cover",
  none: "object-none",
  "scale-down": "object-scale-down",
};

interface CardImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  objectFit?: ObjectFit;
}
const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, src, alt, objectFit = "cover", ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn(
        "w-full transition-transform duration-300 hover:scale-105 sm:rounded-xl md:rounded-2xl lg:rounded-3xl",
        objectFitMap[objectFit],
        className
      )}
      {...props}
    />
  )
);
CardImage.displayName = "CardImage";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-4 sm:pt-6 lg:pt-8 space-y-2 w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  linesToShow?: 1 | 2 | 3 | 4 | 5;
  dialogVariant?: "colored" | "simple";
}

const lineClampClasses = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
};

const CardDescription = forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({
    className,
    children,
    linesToShow = 3,
    dialogVariant = "simple",
    ...props
  }) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const [isFullDescriptionOpen, setIsFullDescriptionOpen] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    const checkTruncation = useCallback(() => {
      if (!textRef.current) {
        return;
      }

      const timeout = setTimeout(() => {
        setIsTruncated(
          textRef.current!.scrollHeight > textRef.current!.clientHeight
        );
      }, 50);

      return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
      checkTruncation();
      window.addEventListener("resize", checkTruncation);

      const observer = new MutationObserver(checkTruncation);
      if (textRef.current) {
        observer.observe(textRef.current, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }

      return () => {
        window.removeEventListener("resize", checkTruncation);
        observer.disconnect();
      };
    }, [checkTruncation, children]);

    const getButtonProps = useMemo(() => {
      if (dialogVariant === "colored") {
        return {
          title: "Full Description",
          description: children,
          actions: [
            {
              label: "Close",
              onClick: () => setIsFullDescriptionOpen(false),
              variant: "primary",
              color: "blue",
            },
          ],
        };
      }
      return {
        title: "Full Description",
        description: children,
        actions: [
          {
            label: "Close",
            onClick: () => setIsFullDescriptionOpen(false),
            variant: "outline",
            color: "gray",
          },
        ],
      };
    }, [dialogVariant, children]);

    return (
      <div className="w-full">
        <p
          ref={textRef}
          className={cn(
            "text-sm text-gray-900/60 dark:text-gray-100/60",
            lineClampClasses[linesToShow],
            className
          )}
          {...props}
        >
          {children}
        </p>
        {isTruncated && (
          <Button
            onClick={() => setIsFullDescriptionOpen(true)}
            variant="link"
            className="w-fit h-8 items-center"
          >
            Show More
          </Button>
        )}
        <AlertDialog
          isOpen={isFullDescriptionOpen}
          onClose={() => setIsFullDescriptionOpen(false)}
          {...getButtonProps}
        />
      </div>
    );
  }
);
CardDescription.displayName = "CardDescription";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex gap-3 items-center pt-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardImage,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};
