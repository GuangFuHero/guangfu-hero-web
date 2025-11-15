'use client';

import Link from 'next/link';
import React from 'react';
import ReactGA from 'react-ga4';
export default function SearchCardLink({
  href,
  gaLabel,
  children,
  className,
  style,
  target,
}: {
  href: string;
  gaLabel: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        ReactGA.event(gaLabel);
      }}
      className={className}
      style={style}
      target={target}
    >
      {children}
    </Link>
  );
}
