// --- AlertDialog.tsx  ---

"use client";

import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../utils/flextail-config";
import type { ButtonVariant, ColorKey } from "../utils/flextail-config";
import { Button } from "./Button";
import { X } from "lucide-react";

export interface AlertDialogAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  color?: ColorKey;
  loading?: boolean;
  disabled?: boolean;
  isDefault?: boolean;
  isDestructive?: boolean;
}

export interface AlertDialogProps extends HTMLAttributes<HTMLDivElement> {
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
      if (!isOpen) return;

      triggerElementRef.current = document.activeElement as HTMLElement | null;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        } else if (event.key === "Tab" && dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
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
            color="gray"
            icon={<X className="h-4 w-4" />}
            size="sm"
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          ></Button>

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
                : action.variant || "secondary";
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

export default AlertDialog;
