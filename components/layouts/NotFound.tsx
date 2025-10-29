import React, {
  forwardRef,
  type HTMLAttributes,
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

interface ButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactElement;
  iconPosition?: "left" | "right";
  href?: string;
}

const getButtonClasses = ({
  variant = "primary",
  size = "md",
  color = "blue",
  shape = "rounded",
  loading,
  disabled,
}: Omit<ButtonProps, "children" | "href">): string => {
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
        "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus-visible:ring-blue-500",
      outline:
        "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-slate-700",
    },
    gray: {
      primary:
        "bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 focus-visible:ring-gray-500",
      outline:
        "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700",
    },
  };

  const variantMap = {
    primary: colorMap[color]?.primary || colorMap.blue.primary,
    outline: colorMap[color]?.outline || colorMap.blue.outline,
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    subtle:
      "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700",
    ghost:
      "bg-transparent text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
    link: "bg-transparent text-blue-600 hover:text-blue-700 underline dark:text-blue-400 dark:hover:text-blue-300",
  };

  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";

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

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
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
      href,
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

    const renderContent = () => (
      <div className={cn("flex items-center gap-2")}>
        {iconElement && iconPosition === "left" && iconElement}
        {children && <span>{children}</span>}
        {iconElement && iconPosition === "right" && iconElement}
      </div>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={finalClassName}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {renderContent()}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={finalClassName}
        disabled={isDisabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {renderContent()}
      </button>
    );
  }
);
Button.displayName = "Button";

const NotFound: React.FC = () => (
  <div
    className={cn(
      "min-h-screen flex flex-col justify-center items-center p-4",
      "bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    )}
  >
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-8"
    >
      <circle
        cx="60"
        cy="60"
        r="60"
        fill="currentColor"
        className="text-gray-200 dark:text-gray-800"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="48"
        fontWeight="bold"
        fill="currentColor"
        className="text-gray-500 dark:text-gray-400"
      >
        404
      </text>
    </svg>

    <h1
      className={cn(
        "text-4xl md:text-5xl font-extrabold mb-4",
        "text-slate-800 dark:text-slate-100"
      )}
    >
      Page Not Found
    </h1>

    <p
      className={cn(
        "text-lg mb-10 text-center max-w-md",
        "text-slate-500 dark:text-slate-400"
      )}
    >
      Sorry, the page you are looking for doesn't exist or has been moved.
    </p>

    <Button
      href="/"
      variant="primary"
      color="blue"
      size="lg"
      shape="rounded"
      className="shadow-lg hover:shadow-xl"
    >
      Go Home
    </Button>
  </div>
);

export default NotFound;
