import React from "react";
import { twMerge } from "tailwind-merge";
type BadgeVariant = "default" | "success" | "error" | "warning" | "info";
type BadgeSize = "sm" | "md" | "lg";
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  children: React.ReactNode;
}
const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200",
  error: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200",
};
const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};
const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  rounded = true,
  children,
  className,
  ...props
}) => {
  const baseClasses = twMerge(
    "inline-flex items-center font-medium",
    variantClasses[variant],
    sizeClasses[size],
    rounded ? "rounded-full" : "rounded",
    className
  );
  return (
    <span className={baseClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;
