"use client";
import Link from "next/link";

interface MenuItemProps {
  item: { 
    name: string; 
    href: string 
  };
  onClose: () => void;
}

const MenuItem = ({ item, onClose }: MenuItemProps) => {
  const href = item.href || "";
  const isAnchor = href.startsWith("#");
  const isExternal = /^https?:\/\//i.test(href);

  if (isAnchor) {
    // 頁內錨點：不開新分頁
    return (
      <a
        href={href}
        className="px-6 py-4 hover:bg-gray-700 border-b border-[#434343]"
      >
        {item.name}
      </a>
    );
  }

  if (isExternal) {
    // 外部連結：開新分頁 + 安全性 rel
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-4 hover:bg-[var(--gray)] border-b border-[var(--gray)]"
        onClick={onClose}
      >
        {item.name}
      </a>
    );
  }

  // 內部連結：Next Link，不開新分頁
  return (
    <Link
      href={href}
      className="px-6 py-4 hover:bg-[var(--gray)] border-b border-[var(--gray)]"
      onClick={onClose}
      prefetch={false}
    >
      {item.name}
    </Link>
  );
};

export default MenuItem;
