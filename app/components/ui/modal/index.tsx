"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;

  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;

  className?: string;
  overlayClassName?: string;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "w-full h-full max-w-none rounded-none",
};

const Modal = ({
  open,
  onClose,
  children,
  title,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
  overlayClassName,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);


  useEffect(() => {
    if (open) modalRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={twMerge(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        overlayClassName
      )}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className={twMerge(
          "relative w-full rounded-lg bg-white p-6 shadow-lg outline-none",
          sizeClasses[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="mb-4 flex items-center justify-between">
            {title && (
              <h2 className="text-lg font-semibold text-gray-800">
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="max-h-[75vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
