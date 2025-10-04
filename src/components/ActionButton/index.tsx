import React from "react";
import Image from "next/image";
import { getAssetPath } from "@/lib/utils";

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  href,
  className = "",
  icon = "/nav.svg",
  iconPosition = "right",
  variant = "primary",
}) => {
  const buttonClasses = `
    h-[36px] py-2 px-3
    min-w-[80px]
    text-sm
    ${
      variant === "primary"
        ? "bg-[#009688] text-white"
        : "bg-[#E9FFFD] text-[#009688]"
    }
    rounded-lg
    cursor-pointer
    flex items-center justify-center gap-1
    whitespace-nowrap
    ${className}
  `;

  const iconElement = (
    <Image
      src={getAssetPath(icon)}
      alt=""
      width={20}
      height={20}
      className={variant === "primary" ? "invert" : ""}
      style={
        variant === "secondary"
          ? {
              filter:
                "invert(37%) sepia(76%) saturate(1200%) hue-rotate(140deg)",
            }
          : undefined
      }
    />
  );

  const content = (
    <>
      {iconPosition === "left" && iconElement}
      {children}
      {iconPosition === "right" && iconElement}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {content}
    </button>
  );
};

export default ActionButton;
