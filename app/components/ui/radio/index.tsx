import React from "react";
import { twMerge } from "tailwind-merge";

type RadioSize = "sm" | "md" | "lg";
type RadioVariant = "default" | "primary" | "success" | "error";

interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;           
  radioSize?: RadioSize;   
  variant?: RadioVariant;  
  disabled?: boolean;      
}

const sizeClasses: Record<RadioSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const variantClasses: Record<RadioVariant, string> = {
  default: "checked:bg-gray-800 focus:ring-gray-500",
  primary: "checked:bg-blue-600 focus:ring-blue-500",
  success: "checked:bg-green-600 focus:ring-green-500",
  error: "checked:bg-red-600 focus:ring-red-500",
};

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  radioSize = "md",
  variant = "default",
  disabled = false,
  className,
  ...props
}) => {
  const radioClasses = twMerge(
    "form-radio rounded-full border-gray-300 focus:ring-2",
    sizeClasses[radioSize],
    variantClasses[variant],
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    className
  );

  return (
    <label className={twMerge("inline-flex items-center space-x-2 cursor-pointer", disabled && "cursor-not-allowed")}>
      <input type="radio" className={radioClasses} disabled={disabled} {...props} />
      {label && <span className={twMerge(disabled ? "text-gray-400" : "text-gray-900")}>{label}</span>}
    </label>
  );
};

export default RadioButton;
