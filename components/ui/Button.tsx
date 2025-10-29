"use client";

import React, {
  forwardRef,
  useEffect,
  useState,
  ReactElement,
  JSXElementConstructor,
  useContext,
  Children,
} from "react";
import {
  cn,
  LoadingSpinnerSVG,
  Plus,
  X,
  Check,
  Danger,
  baseStyles,
  shapeStyles,
  buttonSizeStyles,
  iconSizeStyles,
  iconImageSizeStyles,
  getButtonClasses,
  IconDualSource,
  IconProp,
  ButtonVariant,
  ButtonShape,
  ButtonSize,
  ButtonColor,
  ButtonType,
  OptimizedImageProps,
} from "../config/flextail-utils"

const isIconDualSource = (icon: any): icon is IconDualSource => {
  return (
    typeof icon === "object" &&
    icon !== null &&
    ("light" in icon || "dark" in icon)
  );
};

const isOptimizedImageProps = (source: any): source is OptimizedImageProps => {
  return (
    typeof source === "object" &&
    source !== null &&
    "src" in source &&
    typeof source.src === "string"
  );
};

interface CommonProps {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  loading?: boolean;
  icon?: IconProp;
  iconPosition?: "left" | "right" | "top" | "bottom";
  color?: ButtonColor;
  className?: string;
  children: React.ReactNode;
  iconSize?: ButtonSize;
  alt?: string;
  disabled?: boolean;
  size?: ButtonSize;
  type?: ButtonType;
}

interface ButtonAsButtonProps
  extends CommonProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "onClick" | "children" | "disabled" | "color" | "type"
    > {
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface ButtonAsAnchorProps
  extends CommonProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "onClick" | "children" | "color" | "type"
    > {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

interface ButtonGroupContextProps {
  isGrouped: boolean;
  groupPosition: "first" | "middle" | "last" | "single" | null;
}

const ButtonGroupContext = React.createContext<ButtonGroupContextProps>({
  isGrouped: false,
  groupPosition: null,
});

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const buttons = Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (child.type as any) === Button
  );

  if (buttons.length === 0) return null;

  return (
    <div
      className={cn(
        "inline-flex rounded-xl shadow-md overflow-hidden",
        className
      )}
      role="group"
      {...rest}
    >
      {buttons.map((child, index) => {
        let groupPosition: ButtonGroupContextProps["groupPosition"] = "middle";
        if (buttons.length === 1) {
          groupPosition = "single";
        } else if (index === 0) {
          groupPosition = "first";
        } else if (index === buttons.length - 1) {
          groupPosition = "last";
        }

        const contextValue: ButtonGroupContextProps = {
          isGrouped: true,
          groupPosition: groupPosition,
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

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = "primary",
      shape = "squircle",
      loading = false,
      icon,
      iconPosition = "left",
      color = "blue",
      children,
      disabled = false,
      className = "",
      onClick,
      iconSize = "md",
      alt,
      size = "md",
      href,
      type = "default",
      ...rest
    } = props;

    const { isGrouped, groupPosition } = useContext(ButtonGroupContext);

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
      if (typeof document === "undefined") return;

      const checkDarkMode = () => {
        setDarkMode(document.documentElement.classList.contains("dark"));
      };

      checkDarkMode();

      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.attributeName === "class") {
            checkDarkMode();
            return;
          }
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }, []);

    const isDisabled = disabled || loading;

    const variantClass = getButtonClasses(variant, color, type, isDisabled);

    const buttonSizeClass = buttonSizeStyles[size] || buttonSizeStyles.md;

    const isFullyRounded =
      groupPosition === "single" ||
      variant === "ghost" ||
      variant === "link" ||
      !isGrouped;

    let shapeClass = shapeStyles[shape];

    if (isGrouped && !isFullyRounded) {
      let roundedClass = "rounded-none";
      if (groupPosition === "first") {
        roundedClass =
          shape === "circle"
            ? "rounded-l-full"
            : shape === "squircle"
            ? "rounded-l-xl"
            : "rounded-l-lg";
      } else if (groupPosition === "last") {
        roundedClass =
          shape === "circle"
            ? "rounded-r-full"
            : shape === "squircle"
            ? "rounded-r-xl"
            : "rounded-r-lg";
      }

      shapeClass = cn(
        groupPosition !== "last" &&
          "border-r border-white/40 dark:border-black/30",
        roundedClass
      );
    }

    const finalClassName = cn(
      baseStyles,
      variantClass,
      shapeClass,
      className,
      buttonSizeClass
    );

    const renderIcon = (): React.ReactNode => {
      if (loading) {
        const sizeClass = iconSizeStyles[iconSize] || iconSizeStyles.md;
        return <LoadingSpinnerSVG className={sizeClass} />;
      }

      let currentIcon: IconProp = icon;
      let implicitIcon: React.ReactNode = null;

      if (!currentIcon) {
        const sizeClass = iconSizeStyles[iconSize] || iconSizeStyles.md;
        switch (type) {
          case "add":
            implicitIcon = <Plus className={sizeClass} />;
            break;
          case "error":
            implicitIcon = <X className={sizeClass} />;
            break;
          case "accept":
            implicitIcon = <Check className={sizeClass} />;
            break;
          case "danger":
            implicitIcon = <Danger className={sizeClass} />;
            break;
          default:
            return null;
        }
      }

      currentIcon = currentIcon || implicitIcon;

      if (isIconDualSource(currentIcon)) {
        currentIcon = darkMode
          ? currentIcon.dark || currentIcon.light
          : currentIcon.light || currentIcon.dark;
      }

      if (!currentIcon) return null;

      const sizeClass = iconSizeStyles[iconSize] || iconSizeStyles.md;
      const imageSizeClass =
        iconImageSizeStyles[iconSize] || iconImageSizeStyles.md;

      if (
        isOptimizedImageProps(currentIcon) ||
        typeof currentIcon === "string"
      ) {
        const src = isOptimizedImageProps(currentIcon)
          ? currentIcon.src
          : (currentIcon as string);
        return (
          <img
            src={src}
            alt={alt || "Button icon"}
            className={imageSizeClass}
          />
        );
      }

      if (React.isValidElement(currentIcon)) {
        const iconElement = currentIcon as ReactElement<
          { className?: string },
          string | JSXElementConstructor<any>
        >;
        return React.cloneElement(iconElement, {
          className: cn(iconElement.props.className, sizeClass),
        });
      }

      return currentIcon as React.ReactNode;
    };

    const finalIconElement = renderIcon();

    const directionClass =
      iconPosition === "top" || iconPosition === "bottom"
        ? "flex-col"
        : "flex-row";

    const gapClass = finalIconElement && children ? "gap-2" : "";

    const content = (
      <div
        className={cn(
          "flex items-center justify-center",
          directionClass,
          gapClass
        )}
      >
        {finalIconElement &&
          (iconPosition === "left" || iconPosition === "top") &&
          finalIconElement}
        {children}
        {finalIconElement &&
          (iconPosition === "right" || iconPosition === "bottom") &&
          finalIconElement}
      </div>
    );

    const Element = href ? "a" : "button";
    const elementProps = {
      ref: ref,
      className: finalClassName,
      disabled: isDisabled,
      onClick: onClick,
      type: href ? undefined : type, // Only set type for button element
      ...rest,
    };

    if (href) {
      Object.assign(elementProps, {
        href: href,
        target: "_blank",
        rel: "noopener noreferrer",
      });
      delete elementProps.disabled; // Anchor tags don't use the disabled attribute
    } else {
      delete elementProps.href;
      delete elementProps.target;
      delete elementProps.rel;
    }

    return <Element {...(elementProps as any)}>{content}</Element>;
  }
);

Button.displayName = "Button";

export { Button, ButtonGroup };
