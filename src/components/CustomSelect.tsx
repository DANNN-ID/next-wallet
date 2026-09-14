"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export type Option = {
  value: string;
  label: string;
  icon?: React.ReactNode | string;
  description?: string;
};

export default function CustomSelect({
  name,
  options,
  placeholder = "Pilih salah satu...",
  defaultValue = "",
  required = false
}: {
  name: string;
  options: Option[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Hidden input for standard HTML form submission */}
      <input type="hidden" name={name} value={selectedValue} required={required} />

      {/* Select trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 rounded-xl bg-white border-none shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none flex items-center justify-between transition-all"
      >
        <div className="flex items-center gap-3 overflow-hidden text-left">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <div className="truncate">
                <p className="font-semibold text-slate-900">{selectedOption.label}</p>
                {selectedOption.description && (
                  <p className="text-xs text-slate-500 font-normal">{selectedOption.description}</p>
                )}
              </div>
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-2 space-y-1">
            {options.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">Tidak ada pilihan tersedia</div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelectedValue(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    selectedValue === opt.value
                      ? "bg-pink-50 text-pink-600"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <div className="truncate">
                      <p className={`font-medium ${selectedValue === opt.value ? 'text-pink-600' : 'text-slate-900'}`}>{opt.label}</p>
                      {opt.description && (
                        <p className={`text-xs ${selectedValue === opt.value ? 'text-pink-500/80' : 'text-slate-500'}`}>{opt.description}</p>
                      )}
                    </div>
                  </div>
                  {selectedValue === opt.value && <Check className="w-4 h-4 shrink-0 text-pink-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
