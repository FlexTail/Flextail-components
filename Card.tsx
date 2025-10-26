import {
  forwardRef,
  type HTMLAttributes,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Button } from "./Button";
import { AlertDialog } from "./AlertDialog";

const cn = (
  ...classes: (string | number | boolean | undefined | null | object)[]
): string => {
  return classes
    .filter(Boolean)
    .map((c) => {
      if (typeof c === "object" && c !== null) {
        return Object.keys(c)
          .filter((key) => c[key as keyof object])
          .join(" ");
      }
      return c;
    })
    .join(" ");
};
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

  return `${bgClass} ${textColor}`;
};

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

    const getButtonProps = () => {
      if (dialogVariant === "colored") {
        return { variant: "primary", color: "red" };
      }
      return { variant: "simple" };
    };

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
        {isFullDescriptionOpen && (
          <AlertDialog
            onClose={() => setIsFullDescriptionOpen(false)}
            alertContent={children}
            {...getButtonProps()}
          >
            Close
          </AlertDialog>
        )}
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
