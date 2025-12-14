import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  rows?: number;        
  width?: string;        
  maxWords?: number; 
  error?: string;         
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  rows = 4,
  width = "w-full",
  maxWords,
  error,
  disabled = false,
  className,
  ...props
}) => {
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxWords) {
      const words = e.target.value.trim().split(/\s+/);
      if (words.length > maxWords) {
        e.target.value = words.slice(0, maxWords).join(" ");
      }
      setWordCount(Math.min(words.length, maxWords));
    } else {
      setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
    }

    if (props.onChange) props.onChange(e);
  };

  const textareaClasses = twMerge(
    "rounded-md border shadow-sm focus:ring-2 focus:outline-none",
    "resize-none",
    disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
    width,
    className
  );

  return (
    <div className="flex flex-col">
      {label && (
        <label className={twMerge("mb-1 font-medium", disabled && "text-gray-400")}>{label}</label>
      )}
      <textarea
        className={textareaClasses}
        rows={rows}
        disabled={disabled}
        onChange={handleChange}
        {...props}
      />
      {maxWords && (
        <span className="text-sm text-gray-500 mt-1">
          {wordCount}/{maxWords} words
        </span>
      )}
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default TextArea;
