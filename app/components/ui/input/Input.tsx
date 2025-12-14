import React, { forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "primary" | "secondary" | "outline";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}
const baseStyles =
  "w-full rounded-md px-3 py-2 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles = {
  primary:
    "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
  secondary:
    "border border-gray-200 bg-gray-100 focus:border-gray-400 focus:ring-2 focus:ring-gray-300",
  outline:
    "border border-transparent ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "primary",
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    const inputId = id || props.name;

    return (
      <div className={twMerge("flex flex-col gap-1", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-invalid={!!error}
            className={twMerge(
              baseStyles,
              variantStyles[variant],
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : (
            rightIcon && (
              <span className="absolute right-3 text-gray-400">
                {rightIcon}
              </span>
            )
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : (
          helperText && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
