import React from 'react';

interface ChecklistItemProps {
  id: string;
  label: string;
  description?: string | string[];
  checked: boolean;
  onChange: (id: string) => void;
  highlight?: boolean;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  highlight = false,
}) => {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(id)}
        className="mt-1 w-4 h-4 flex-shrink-0"
      />
      <div className="flex-1">
        <span
          className={`font-medium ${
            checked ? 'line-through text-[var(--gray-2)]' : ''
          } ${highlight ? 'text-orange-600' : ''}`}
        >
          {label}
        </span>
        {description && (
          <div className="mt-1 space-y-0.5">
            {Array.isArray(description) ? (
              description.map((desc, index) => (
                <p key={index} className="text-xs text-[var(--gray)]">
                  {desc}
                </p>
              ))
            ) : (
              <p className="text-xs text-[var(--gray)]">{description}</p>
            )}
          </div>
        )}
      </div>
    </label>
  );
};

export default ChecklistItem;
