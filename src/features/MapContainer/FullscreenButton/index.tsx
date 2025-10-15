'use client';

interface FullscreenButtonProps {
  isFullScreenMap: boolean;
  onToggleFullScreen: () => void;
}

export default function FullscreenButton({
  isFullScreenMap,
  onToggleFullScreen,
}: FullscreenButtonProps) {
  return (
    <div className="fullscreen-panel">
      <button className="go-back-btn" onClick={onToggleFullScreen} title="切換全屏">
        {isFullScreenMap ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.7071 1.70711C18.0976 1.31658 18.0976 0.683417 17.7071 0.292893C17.3166 -0.0976311 16.6834 -0.0976311 16.2929 0.292893L11 5.58579V3C11 2.44772 10.5523 2 10 2C9.44771 2 9 2.44772 9 3V8C9 8.55229 9.44772 9 10 9H15C15.5523 9 16 8.55228 16 8C16 7.44771 15.5523 7 15 7L12.4142 7L17.7071 1.70711Z"
              fill="#3A3937"
            />
            <path
              d="M9 10C9 9.44771 8.55228 9 8 9H3C2.44771 9 2 9.44772 2 10C2 10.5523 2.44771 11 3 11H5.58579L0.292893 16.2929C-0.0976311 16.6834 -0.0976311 17.3166 0.292893 17.7071C0.683417 18.0976 1.31658 18.0976 1.70711 17.7071L7 12.4142L7 15C7 15.5523 7.44772 16 8 16C8.55229 16 9 15.5523 9 15V10Z"
              fill="#3A3937"
            />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 1C18 0.447715 17.5523 0 17 0H12C11.4477 0 11 0.447716 11 1C11 1.55229 11.4477 2 12 2L14.5858 2L9.79289 6.79289C9.40237 7.18342 9.40237 7.81658 9.79289 8.20711C10.1834 8.59763 10.8166 8.59763 11.2071 8.20711L16 3.41421V6C16 6.55228 16.4477 7 17 7C17.5523 7 18 6.55228 18 6V1Z"
              fill="#3A3937"
            />
            <path
              d="M8.20711 11.2071C8.59763 10.8166 8.59763 10.1834 8.20711 9.79289C7.81658 9.40237 7.18342 9.40237 6.79289 9.79289L2 14.5858L2 12C2 11.4477 1.55228 11 1 11C0.447715 11 0 11.4477 0 12V17C0 17.5523 0.447716 18 1 18H6C6.55229 18 7 17.5523 7 17C7 16.4477 6.55229 16 6 16H3.41421L8.20711 11.2071Z"
              fill="#3A3937"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
