"use client";

import { useState } from "react";
import CloseButton from "./CloseButton";
import MenuItem from "./MenuItem";
import SubMenuItemProps from "./SubMenuItem";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIDEBAR_ITEM = [
  { name: "地圖列表", href: "/map" },
  {
    name: "志工資訊",
    subItems: [
      { name: "行前必讀", href: "/volunteer/preparation" },
      { name: "交通資訊", href: "/volunteer/transportation" },
      { name: "住宿資訊", href: "/map?view=list&category=accommodations" },
    ],
  },
  {
    name: "居民協助",
    subItems: [
      { name: "庇護所", href: "/victim/shelter" },
      { name: "醫療站", href: "/victim/medical" },
      { name: "心理資源", href: "/victim/mental-health" },
    ],
  },
  { name: "物資媒合", href: "/resources" },
  { name: "志工媒合", href: "/volunteer-register" },
  { name: "關於我們", href: "/volunteer/about-us" },
  { name: "隱私權政策", href: "/privacy" },
  { name: "服務條款", href: "/terms" },
  { name: "網站回報問題", href: "https://docs.google.com/forms/d/1Ky8O4LHk8uXUZKIYs2JZWHxzQty-7KwNyysNj41XO_M/edit" },
  { name: "物資媒合/志工媒合回報", href: "https://docs.google.com/forms/d/17VyOi9B43ouZ3_s5MdS1fs80fVR-lNvsV7Q4eG-2o68/viewform?edit_requested=true" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#3A3937] text-white z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <CloseButton onClose={onClose} />
        <nav className="flex flex-col">
          {SIDEBAR_ITEM.map((item, index) => {
            if ("subItems" in item && item.subItems) {
              return (
                <SubMenuItemProps
                  key={index}
                  item={item}
                  toggleSection={toggleSection}
                  expandedSection={expandedSection}
                  onClose={onClose}
                />
              );
            } else if ("href" in item && item.href) {
              return <MenuItem key={index} item={item} onClose={onClose} />;
            }
            return null;
          })}
        </nav>
      </div>
    </>
  );
}
