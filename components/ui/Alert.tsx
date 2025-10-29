"use client";

import React, { forwardRef, ReactElement, JSXElementConstructor } from "react";
import {
  cn,
  AlertVariant,
  AlertColor,
  AlertSize,
  AlertIconPosition,
  getVariantClasses,
  LoadingSpinnerSVG,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
  DangerIcon,
  COLOR_MAPS,
  iconSizeStyles,
} from "../config/flextail-utils";

type CustomShape = "rounded-full" | "default";

type IconProp = React.ReactNode;

const DEFAULT_ICON_MAP: Record<AlertColor, React.FC<{ className?: string }>> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  danger: DangerIcon,
  brand: InfoIcon,
};

interface BaseProps {
  variant?: AlertVariant;
  color?: AlertColor;
  size?: AlertSize;
  iconPosition?: AlertIconPosition;

  shape?: CustomShape;

  loading?: boolean;
  icon?: IconProp;
  className?: string;
  children: React.ReactNode;
  alt?: string;
  disabled?: boolean;

  as?: "button" | "a" | "div";
}

interface AlertAsButtonProps
  extends BaseProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "children" | "disabled" | "color"
    > {
  as?: "button";
}

interface AlertAsAnchorProps
  extends BaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "color"> {
  as: "a";
}

interface AlertAsDivProps
  extends BaseProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "color"> {
  as: "div";
}

export type AlertProps =
  | AlertAsButtonProps
  | AlertAsAnchorProps
  | AlertAsDivProps;

const baseStyles =
  "inline-flex items-center transition-all duration-200 font-medium w-full text-left";
const disabledStyles = "opacity-50 pointer-events-none";

const Alert = forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLDivElement,
  AlertProps
>((props, ref) => {
  const {
    variant = "default",
    color = "brand",
    size = "md",
    iconPosition,
    loading = false,
    icon,
    children,
    disabled = false,
    className = "",
    shape = "default",
    as = "div",
    ...rest
  } = props;

  const iconSizeClass = iconSizeStyles[size] || iconSizeStyles.md;
  const isDisabled = disabled || loading;

  const variantClasses = getVariantClasses(
    variant,
    color,
    size,
    as === "button" || as === "a"
  );

  const shapeClass = shape === "rounded-full" ? "rounded-full" : "";

  const RootElement = as;

  const finalClassName = cn(
    baseStyles,
    variantClasses,
    shapeClass,
    className,
    isDisabled && disabledStyles
  );

  const renderIcon = (): React.ReactNode => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      const iconElement = icon as ReactElement<
        { className?: string },
        string | JSXElementConstructor<any>
      >;
      return React.cloneElement(iconElement, {
        className: cn(iconElement.props.className, iconSizeClass),
      });
    }

    return null;
  };

  const renderContent = () => {
    if (loading) {
      const spinnerColor = COLOR_MAPS[color]?.text;
      return <LoadingSpinnerSVG className={cn(iconSizeClass, spinnerColor)} />;
    }

    const explicitIconElement = renderIcon();

    let implicitIcon: React.ReactNode = null;

    if (!explicitIconElement) {
      const DefaultIcon = DEFAULT_ICON_MAP[color];
      const iconColor = COLOR_MAPS[color]?.text;
      if (DefaultIcon) {
        implicitIcon = (
          <DefaultIcon className={cn(iconSizeClass, "shrink-0", iconColor)} />
        );
      }
    }

    const finalIconElement = explicitIconElement || implicitIcon;

    if (!finalIconElement) {
      return <div className="w-full h-full">{children}</div>;
    }

    return (
      <div className="flex w-full h-full items-start">
        <div className="flex-shrink-0 pr-3 pt-0.5">{finalIconElement}</div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    );
  };

  const elementProps = {
    ref: ref as React.Ref<any>,
    className: finalClassName,
    disabled: as === "button" ? isDisabled : undefined,
    ...rest,
  };

  return <RootElement {...elementProps}>{renderContent()}</RootElement>;
});

Alert.displayName = "Alert";

export { Alert };
