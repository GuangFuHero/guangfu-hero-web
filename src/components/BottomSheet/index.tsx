'use client';

import { Drawer } from '@mui/material';
import React from 'react';

/**
 * BottomSheet 組件屬性介面
 */
interface BottomSheetProps {
  /** 是否顯示 BottomSheet */
  open: boolean;
  /** 關閉 BottomSheet 的回調函數 */
  onClose: () => void;
  /** BottomSheet 內容 */
  children: React.ReactNode;
  /** 標題 */
  title?: string;
  /** 自訂樣式類別 */
  className?: string;
  contentMaxHeight?: string;
}

/**
 * BottomSheet 組件 - 從底部彈出的模態視窗
 *
 * 使用 MUI Drawer 實作，從螢幕底部向上滑出的互動效果。
 * 適用於顯示選單、選項列表或額外資訊。
 *
 * @example
 * ```tsx
 * <BottomSheet
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="選擇類別"
 * >
 *   <div>內容區域</div>
 * </BottomSheet>
 * ```
 */
const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  children,
  title,
  className = '',
  contentMaxHeight = '70vh',
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          maxHeight: '95vh',
        },
      }}
    >
      <div className={`py-4 ${className}`}>
        {/* 標題區域 */}
        {title && (
          <div className="px-4 flex items-center justify-between mb-4 border-b border-[var(--gray-3)] pb-3">
            <h3 className="text-xl font-medium text-[#3A3937]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#838383] hover:text-gray-700 text-3xl cursor-pointer flex items-center justify-center"
              aria-label="關閉"
            >
              &times;
            </button>
          </div>
        )}

        {/* 內容區域 */}
        <div className="px-4">{children}</div>
      </div>
    </Drawer>
  );
};

export default BottomSheet;
