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
        <div className="legend-item">
          <div
            style={{
              backgroundColor: '#10b981',
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
            🏠
          </div>
          <span className="font-medium">住宿點</span>
        </div>
        <div className="legend-item">
          <div
            style={{
              backgroundColor: '#06b6d4',
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
            💧
          </div>
          <span className="font-medium">加水站</span>
        </div>
        <div className="legend-item">
          <div
            style={{
              backgroundColor: '#8b5cf6',
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
            🚻
          </div>
          <span className="font-medium">廁所</span>
        </div>
        <div className="legend-item">
          <div
            style={{
              backgroundColor: '#f59e0b',
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
            🚿
          </div>
          <span className="font-medium">洗澡點</span>
        </div>
        <div className="legend-item">
          <div
            style={{
              backgroundColor: '#ef4444',
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
            🏥
          </div>
          <span className="font-medium">醫療站</span>
        </div>
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
