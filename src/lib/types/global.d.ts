import 'leaflet';
import 'react-leaflet';

declare global {
  interface Window {
    gtag?: () => void;
  }
}

declare module 'leaflet' {
  interface LayerOptions {
    dataId?: string | number;
  }

  namespace Icon {
    interface Default {
      _getIconUrl?: () => string;
    }
  }
}

declare module 'react-leaflet' {
  interface MarkerProps {
    dataId?: string | number;
  }
}
