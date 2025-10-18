'use client';

import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Option {
  label: string;
  value: string;
  [key: string]: unknown;
}

interface DropdownSelectProps {
  value: string;
  onChange: (newValue: string) => void;
  options: Option[];
  defaultLabel?: string;
}

export default function DropdownSelect({
  value: valueProp,
  onChange,
  options,
  defaultLabel,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(opt => opt.value === valueProp)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 px-3 py-2 w-max bg-white border border-[var(--gray-3)] rounded-md cursor-pointer font-medium"
      >
        <span>{selectedLabel ?? defaultLabel}</span>
        <Image
          src={open ? getAssetPath('/chevron_up.svg') : getAssetPath('/chevron_down.svg')}
          alt="up"
          width={11}
          height={6.5}
        />
      </button>

      {open && (
        <div className="min-w-[93px] w-max absolute left-0 mt-1 bg-[var(--gray-4)] rounded-md z-1002">
          {options.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                onChange(value);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left hover:bg-[var(--gray-3)] ${
                value === valueProp && 'bg-[#e6e6e9]'
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
