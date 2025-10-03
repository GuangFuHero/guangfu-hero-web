import React from "react";

interface TabProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const Tab: React.FC<TabProps> = ({
  children,
  active = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3
        font-medium
        cursor-pointer
        transition-colors
        border-b-4
        ${
          active
            ? "border-[#C96319] text-[#C96319]"
            : "border-transparent text-[#1E1E1E]"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Tab;
