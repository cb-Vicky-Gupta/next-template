import React from "react";
import { twMerge } from "tailwind-merge";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  iconRight?: true;
  iconLeft?: true;
  isDisable?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "danger"
    | "warning"
    | "disabled"
    | "ghost"
    | "outlineDanger"
    | "outlinePrimary"
    | "outlineSecondary"
    | "outlineSuccess"
    | "outlineWarning"
    | "active"
    | "disabledButton";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = ({
  type,
  icon,
  text,
  className,
  onClick,
  isDisable,
  variant = "primary",
  iconRight,
  iconLeft,
  ...props
}: ButtonProps) => {
  const variantStyles = {
    primary: "bg-green-500 text-white hover:bg-green-700",
    secondary: "bg-blue-500 text-white hover:bg-blue-700",
    danger: "bg-red-500 text-white hover:bg-red-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-700",
    outline: "border border-black text-black hover:bg-gray-100",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
    ghost: " text-black hover:bg-blue-200",
    outlineDanger: "border border-red-500 text-red-500 hover:bg-red-100",
    outlinePrimary: "border border-green-500 text-green-500 hover:bg-green-100",
    outlineSecondary: "border border-blue-500 text-blue-500 hover:bg-blue-100",
    outlineSuccess: "border border-green-500 text-green-500 hover:bg-green-100",
    outlineWarning:
      "border border-yellow-500 text-yellow-500 hover:bg-yellow-100",
    active: "  bg-[#D9EBFF] text-[#0053AE] hover:bg-blue-300",
    disabledButton: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  const selectedVariantStyle = variantStyles[variant] || variantStyles.primary;

  const buttonStyle = twMerge(
    selectedVariantStyle,
    "inline-flex items-center justify-center gap-2 px-2 py-1 text-sm leading-none rounded ease-in-out duration-300",
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyle}
      disabled={isDisable}
      {...props}
    >
      {icon && iconLeft && <span className="icon">{icon}</span>}
      {text}
      {icon && iconRight && <span className="icon">{icon}</span>}
    </button>
  );
};

export default Button;
