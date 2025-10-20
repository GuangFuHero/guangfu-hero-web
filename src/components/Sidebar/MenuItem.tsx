'use client';
import Link from 'next/link';
import Image from 'next/image';

interface MenuItemProps {
  item: {
    name: string;
    href: string;
  };
  onClose: () => void;
}

const MenuItem = ({ item, onClose }: MenuItemProps) => {
  const href = item.href || '';
  const isAnchor = href.startsWith('#');
  const isExternal = /^https?:\/\//i.test(href);

  if (isAnchor) {
    // 頁內錨點：不開新分頁
    return (
      <a
        href={href}
        className="px-6 h-[60px] hover:bg-gray-700 border-b border-[#434343] flex items-center"
      >
        {item.name}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 h-[60px] hover:bg-[var(--gray)] border-b border-[var(--gray)] flex items-center group"
        onClick={onClose}
      >
        <span className="text-[var(--primary)]">{item.name}</span>
        <Image
          src="/open_in_window.svg"
          alt="Open in new window"
          width={16}
          height={16}
          className="ml-1 opacity-100 transition-opacity"
          style={{
            filter:
              'invert(53%) sepia(79%) saturate(1812%) hue-rotate(359deg) brightness(99%) contrast(92%)',
          }}
        />
      </a>
    );
  }

  // 內部連結：Next Link，不開新分頁
  return (
    <Link
      href={href}
      className="px-6 h-[60px] hover:bg-[var(--gray)] border-b border-[var(--gray)] flex items-center"
      onClick={onClose}
      prefetch={false}
    >
      {item.name}
    </Link>
  );
};

export default MenuItem;
