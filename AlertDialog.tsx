import React, {
  forwardRef,
  type HTMLAttributes,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Button, type ButtonProps } from "./Button"

interface ButtonStylingProps
  extends Pick<ButtonProps, "variant" | "color" | "disabled" | "loading"> {}

interface AlertDialogProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  alertContent: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonText?: string;
  children: React.ReactNode;
  buttonProps?: ButtonStylingProps;
}

const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(
  ({
    onClose,
    alertContent,
    showCloseButton = true,
    closeButtonText = "Close",
    children,
    buttonProps,
    ...props
  }) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const triggerElementRef = useRef<HTMLElement | null>(null);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    useEffect(() => {
      triggerElementRef.current = document.activeElement as HTMLElement | null;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        }
      };

      if (dialogRef.current) {
        dialogRef.current.focus();
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (triggerElementRef.current) {
          triggerElementRef.current.focus();
        }
      };
    }, [handleClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20"
        onClick={handleBackdropClick}
      >
        <div
          ref={dialogRef}
          role="alertdialog"
          aria-modal="true"
          className="relative flex flex-col justify-center items-center w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-10 shadow-xl dark:bg-slate-900"
          tabIndex={-1}
          {...props}
        >
          <div className="flex flex-col gap-3 justify-end">
            <div className="prose dark:prose-invert">{alertContent}</div>
            {showCloseButton && (
              <div className="sticky bottom-0 mt-4 flex justify-end gap-2">
                <Button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  {...buttonProps}
                >
                  {closeButtonText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AlertDialog.displayName = "AlertDialog";

export { AlertDialog };
