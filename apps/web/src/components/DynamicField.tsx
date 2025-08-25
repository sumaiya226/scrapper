import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type Field = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

type Props = {
  field: Field;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
};

export default function DynamicField({ field, register, errors }: Props) {
  const { id, label, type, required, placeholder } = field;
  const error = (errors as any)?.[id]?.message as string | undefined;

  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-black">
        <input type="checkbox" {...register(id)} className="h-4 w-4" />
        <span className="text-sm">{label}</span>
        {error && <span className="text-xs text-red-600 ml-2">{error}</span>}
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-black" htmlFor={id}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={id}
        type={type === "tel" ? "tel" : "text"}
        placeholder={placeholder}
        className="border rounded-lg px-3 py-2 outline-none focus:ring w-full text-black"
        {...register(id)}
        inputMode={type === "tel" ? "numeric" : "text"}
        maxLength={type === "tel" ? (id === "otp" ? 6 : 12) : undefined}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
