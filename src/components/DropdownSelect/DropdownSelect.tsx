"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
  [key: string]: unknown;
}

interface DropdownSelectProps {
  value: string;
  onChange: (newValue: string) => void;
  options: Option[];
}

export default function DropdownSelect({
  value: valueProp,
  onChange,
  options,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((opt) => opt.value === valueProp)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="dropdown-select">
      <button
        onClick={() => setOpen(!open)}
        className="dropdown-select-button"
      >
        <span>{selectedLabel}</span>
        <Image
          src={
            open
              ? getAssetPath("/chevron_up.svg")
              : getAssetPath("/chevron_down.svg")
          }
          alt="up"
          width={11}
          height={6.5}
        />
      </button>

      {open && (
        <div className="dropdown-select-options">
          {options.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                onChange(value);
                setOpen(false);
              }}
              className={`dropdown-select-option ${
                value === valueProp && "bg-[#e6e6e9]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
