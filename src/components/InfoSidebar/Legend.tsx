import { PLACE_CONFIG } from '../ReactLeafletMap/place.config';

export default function Legend() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3">圖例說明</h3>
      <div className="space-y-2">
        <div className="legend-item">
          <div
            className="legend-color"
            style={{
              backgroundColor: '#3b82f6',
              width: '25px',
              height: '25px',
            }}
          ></div>
          <span className="font-medium">光復火車站</span>
        </div>
        {PLACE_CONFIG.map(config => {
          return (
            <div key={config.type} className="legend-item">
              <div
                style={{
                  backgroundColor: config.color,
                  color: 'white',
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  marginRight: '0.5rem',
                }}
              >
                {config.icon}
              </div>
              <span className="font-medium">{config.label}</span>
            </div>
          );
        })}
        <div className="legend-item">
          <div
            className="legend-color"
            style={{
              backgroundColor: '#ec4899',
              opacity: 0.3,
              width: '25px',
              height: '25px',
            }}
          ></div>
          <span className="font-medium">救災區域範圍</span>
        </div>
      </div>
    </div>
  );
}
