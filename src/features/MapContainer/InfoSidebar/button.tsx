'use client';

interface InfoSidebarButtonProps {
  onToggleSidebarOpen: () => void;
  isSidebarOpen: boolean;
  isFullScreenMap: boolean;
}

export default function InfoSidebarButton({
  onToggleSidebarOpen,
  isSidebarOpen,
  isFullScreenMap,
}: InfoSidebarButtonProps) {
  return (
    <div className="more-info-panel">
      <button
        className="btn btn-primary text-[16px] leading-5 font-semibold border-[#E6E6E6] border border-solid "
        onClick={onToggleSidebarOpen}
      >
        {isSidebarOpen ? '關閉' : '更多資訊'}
      </button>
    </div>
  );
}
