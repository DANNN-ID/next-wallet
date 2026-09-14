"use client";

import { useState } from "react";

export default function CurrencyInput({ 
  name, 
  defaultValue = "", 
  placeholder = "0" 
}: { 
  name: string, 
  defaultValue?: string | number, 
  placeholder?: string 
}) {
  const [displayValue, setDisplayValue] = useState(() => {
    if (!defaultValue) return "";
    return Number(defaultValue).toLocaleString("id-ID");
  });
  const [rawValue, setRawValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya ambil angka
    const digits = e.target.value.replace(/\D/g, "");
    
    if (digits === "") {
      setDisplayValue("");
      setRawValue("");
      return;
    }

    const numericValue = parseInt(digits, 10);
    // Format menjadi format ribuan Indonesia
    setDisplayValue(numericValue.toLocaleString("id-ID"));
    setRawValue(numericValue.toString());
  };

  return (
    <>
      {/* Hidden input to hold the actual numeric value for form submission */}
      <input type="hidden" name={name} value={rawValue} />
      {/* Visible input for the user */}
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        required
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 placeholder-slate-400 text-lg font-semibold"
        placeholder={placeholder}
      />
    </>
  );
}
