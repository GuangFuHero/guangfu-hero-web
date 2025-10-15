import { PLACE_CONFIG } from '../ReactLeafletMap/place.config';

interface LegendItem {
  type: string;
  label: string;
  color: string;
  icon: (() => React.ReactNode) | null;
  border?: string;
}

export default function Legend() {
  const allLegendItems: LegendItem[] = [
    {
      type: 'station',
      label: '光復火車站',
      color: '#FFC02D',
      icon: () => (
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.5 4C3.67157 4 3 4.67157 3 5.5V8.5C3 9.32843 3.67157 10 4.5 10H13.5C14.3284 10 15 9.32843 15 8.5V5.5C15 4.67157 14.3284 4 13.5 4H4.5ZM5 8V6H13V8H5Z"
            fill="white"
          />
          <path
            d="M6.5 12.5C6.5 13.1904 5.94036 13.75 5.25 13.75C4.55964 13.75 4 13.1904 4 12.5C4 11.8096 4.55964 11.25 5.25 11.25C5.94036 11.25 6.5 11.8096 6.5 12.5Z"
            fill="white"
          />
          <path
            d="M12.75 13.75C13.4404 13.75 14 13.1904 14 12.5C14 11.8096 13.4404 11.25 12.75 11.25C12.0596 11.25 11.5 11.8096 11.5 12.5C11.5 13.1904 12.0596 13.75 12.75 13.75Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 0C1.79086 0 0 1.79086 0 4V13C0 14.9094 1.33785 16.5063 3.12731 16.9045L1.4 18.2C0.958172 18.5314 0.868629 19.1582 1.2 19.6C1.53137 20.0418 2.15817 20.1314 2.6 19.8L6.33333 17H11.6667L15.4 19.8C15.8418 20.1314 16.4686 20.0418 16.8 19.6C17.1314 19.1582 17.0418 18.5314 16.6 18.2L14.8727 16.9045C16.6621 16.5063 18 14.9094 18 13V4C18 1.79086 16.2091 0 14 0H4ZM12.0116 15H14C15.1046 15 16 14.1046 16 13V4C16 2.89543 15.1046 2 14 2H4C2.89543 2 2 2.89543 2 4V13C2 14.1046 2.89543 15 4 15H11.9899C11.9971 14.9999 12.0044 14.9999 12.0116 15Z"
            fill="white"
          />
        </svg>
      ),
    },
    ...PLACE_CONFIG.map(config => ({
      type: config.type,
      label: config.label,
      color: config.color,
      icon: config.icon,
    })),
    {
      type: 'military',
      label: '軍方接管區域範圍（志工勿入）',
      color: '#F6BFBD',
      icon: null,
      border: '3px dashed #FF464A',
    },
  ];

  // 分成兩列
  const leftColumn = allLegendItems.slice(0, Math.ceil(allLegendItems.length / 2));
  const rightColumn = allLegendItems.slice(Math.ceil(allLegendItems.length / 2));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3">圖例說明</h3>
      <div className="legend-grid">
        <div className="legend-column">
          {leftColumn.map((item, index) => (
            <div key={`left-${item.type}-${index}`} className="legend-item-compact">
              <div
                className="legend-color-compact"
                style={{
                  backgroundColor: item.color,
                  border: item.border || 'none',
                  color: 'white',
                }}
              >
                {item.icon && item.icon()}
              </div>
              <span className="legend-label-compact">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="legend-column">
          {rightColumn.map((item, index) => (
            <div key={`right-${item.type}-${index}`} className="legend-item-compact">
              <div
                className="legend-color-compact"
                style={{
                  backgroundColor: item.color,
                  border: item.border || 'none',
                  color: 'white',
                }}
              >
                {item.icon && item.icon()}
              </div>
              <span className="legend-label-compact">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
