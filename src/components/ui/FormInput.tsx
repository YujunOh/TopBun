"use client";

import { type ChangeEvent } from "react";

type InputType = "text" | "email" | "password" | "number" | "textarea" | "select";

interface FormInputProps {
  label?: string;
  type?: InputType;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
}

export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  options = [],
  className = "",
}: FormInputProps) {
  const baseInputStyles = "w-full rounded-xl px-4 py-3 text-[var(--color-text)] bg-[var(--color-surface)] transition-all duration-200";
  const borderStyles = error
    ? "border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
    : "border border-white/10 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/50";
  const disabledStyles = disabled ? "opacity-60 cursor-not-allowed" : "";
  const focusStyles = "focus:outline-none";

  const inputClassName = `${baseInputStyles} ${borderStyles} ${focusStyles} ${disabledStyles} ${className}`.trim();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block font-medium text-sm text-[var(--color-text)] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${inputClassName} min-h-32 resize-vertical`}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClassName}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClassName}
        />
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export { FormInput };
