import React from "react";
import { twMerge } from "tailwind-merge";

type SelectSize = "sm" | "md" | "lg";
type SelectVariant = "default" | "primary" | "success" | "error";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: Option[];
  placeholder?: string;
  selectSize?: SelectSize;  
  variant?: SelectVariant;
  disabled?: boolean;
  label?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: "text-sm px-2 py-1",
  md: "text-base px-3 py-2",
  lg: "text-lg px-4 py-3",
};

const variantClasses: Record<SelectVariant, string> = {
  default: "border-gray-300 focus:ring-gray-500 focus:border-gray-500",
  primary: "border-blue-300 focus:ring-blue-500 focus:border-blue-500",
  success: "border-green-300 focus:ring-green-500 focus:border-green-500",
  error: "border-red-300 focus:ring-red-500 focus:border-red-500",
};

const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  selectSize = "md",
  variant = "default",
  disabled = false,
  label,
  className,
  ...props
}) => {
  const selectClasses = twMerge(
    "form-select block w-full rounded-md shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
    sizeClasses[selectSize],
    variantClasses[variant],
    className
  );

  return (
    <div className="flex flex-col">
      {label && <label className={twMerge("mb-1 font-medium", disabled && "text-gray-400")}>{label}</label>}
      <select className={selectClasses} disabled={disabled} {...props}>
        {placeholder && (
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
