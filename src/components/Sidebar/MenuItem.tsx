'use client';

import React from 'react';
import Link from 'next/link';

interface MenuItemProps {
  item: {
    name: string;
    href: string;
  };
  onClose: () => void;
}

const MenuItem = ({ item, onClose }: MenuItemProps) => {
  const isAnchor = item.href.startsWith('#');
  return isAnchor ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-4 hover:bg-gray-700 border-b border-[#434343]"
    >
      {item.name}
    </a>
  ) : (
    <Link
      href={item.href}
      className="px-6 py-4 hover:bg-[var(--gray)] border-b border-[var(--gray)]"
      onClick={onClose}
    >
      {item.name}
    </Link>
  );
};

export default MenuItem;
