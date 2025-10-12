'use client';

import { DISASTER_AREA, MAP_START_POSITION_INFO } from '@/constants';
import { queryKeys } from '@/hooks/useMapData';
import { useMapQueries } from '@/hooks/useMapQueries';
import { LayerType, UserPosition } from '@/types/map';

import { Place, PlaceType } from '@/types/place';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import GuangFuStationMarker from './GuangFuStationMarker';
import { userLocationIcon } from './Icons';
import PlaceMarker from './PlaceComponent';

interface MapEventsProps {
  onSidebarClose: () => void;
}

type LeafletMapRef = {
  getMap: () => L.Map | null;
  flyTo: (latlng: [number, number], zoom?: number | undefined) => void;
  openPopup: (latlng: [number, number], dataId: string) => void;
  updateUserLocation: (position: UserPosition, isVisible: boolean) => void;
} | null;

const MapEvents = ({ onSidebarClose }: MapEventsProps) => {
  useMapEvents({ click: onSidebarClose });
  return null;
};

const DisasterPane = () => {
  const map = useMap();

  useEffect(() => {
    map.createPane('disasterPane');
    map.getPane('disasterPane')!.style.zIndex = '410';
  }, [map]);

  return null;
};

const ZoomControl = () => {
  const map = useMap();

  useEffect(() => {
    const zoomControl = L.control.zoom({ position: 'topright' });
    map.addControl(zoomControl);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
};

interface ReactLeafletMapProps {
  activeLayer: LayerType;
  onSidebarClose: () => void;
  userPosition: UserPosition | null;
  isUserLocationVisible: boolean;
  isFullScreenMap?: boolean;
}

const ReactLeafletMapContent = forwardRef<LeafletMapRef, ReactLeafletMapProps>(
  ({ activeLayer, onSidebarClose, userPosition, isUserLocationVisible }, ref) => {
    const queryClient = useMapQueries();
    const map = useMap();

    const places: Record<PlaceType | string, Place[]> | undefined = queryClient.getQueryData(
      queryKeys.places
    );

    useImperativeHandle(ref, () => ({
      getMap: () => map,
      flyTo: (latlng: [number, number], zoom?: number) => {
        map.flyTo(latlng, zoom || 15);
      },
      openPopup: (_: [number, number], dataId: string) => {
        map.eachLayer(layer => {
          if (layer.options && layer.options?.dataId === dataId) {
            layer.openPopup();
          }
        });
      },
      updateUserLocation: (position: UserPosition, isVisible: boolean) => {
        if (isVisible) {
          map.flyTo([position.lat, position.lng], 15);
        }
      },
    }));

    const isLayerVisible = (layerType: string) => {
      return activeLayer === 'all' || activeLayer === layerType;
    };

    return (
      <>
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <DisasterPane />
        <ZoomControl />
        <MapEvents onSidebarClose={onSidebarClose} />

        <GuangFuStationMarker />

        {activeLayer === 'all' && (
          <Polygon
            positions={DISASTER_AREA}
            pathOptions={{
              color: '#ec4899',
              weight: 2,
              opacity: 0.8,
              fillColor: '#ec4899',
              fillOpacity: 0.2,
            }}
            pane="disasterPane"
          >
            <Popup>
              <div>
                <h3 className="font-bold">救災區域範圍</h3>
                <div className="gap-0 space-y-0">
                  <p className="m-0 text-sm">主要災害影響區域</p>
                  <p className="m-0 text-sm text-gray-600">請注意安全</p>
                </div>
              </div>
            </Popup>
          </Polygon>
        )}

        {userPosition && isUserLocationVisible && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">您的位置</h3>
                <p className="text-sm">緯度: {userPosition.lat.toFixed(6)}</p>
                <p className="text-sm">經度: {userPosition.lng.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {Object.values(places || {})
          .flat()
          .map(place => (
            <PlaceMarker key={place.id} place={place} isVisible={isLayerVisible(place.type)} />
          ))}
      </>
    );
  }
);

ReactLeafletMapContent.displayName = 'ReactLeafletMapContent';

const ReactLeafletMap = forwardRef<LeafletMapRef, ReactLeafletMapProps>(
  (
    { activeLayer, onSidebarClose, userPosition, isUserLocationVisible, isFullScreenMap = true },
    ref
  ) => {
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
      delete L.Icon.Default.prototype?._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }, []);

    return (
      <MapContainer
        id="map"
        center={[MAP_START_POSITION_INFO.lat, MAP_START_POSITION_INFO.lng]}
        zoom={MAP_START_POSITION_INFO.zoom}
        style={{
          // header:80 + alert:(64 + 22) + tab:54 + dropdown:38 + padding*2:(12 + 12) + footer:64 + map-box:(34) = 380
          height: `calc(100svh - 380px)`,
          width: '100%',
          ...(isFullScreenMap ? {} : { maxWidth: 'calc(100svw - 32px)' }),
        }}
        zoomControl={false}
        attributionControl={false}
        whenReady={() => setMapReady(true)}
      >
        {mapReady && (
          <ReactLeafletMapContent
            ref={ref}
            activeLayer={activeLayer}
            onSidebarClose={onSidebarClose}
            userPosition={userPosition}
            isUserLocationVisible={isUserLocationVisible}
          />
        )}
      </MapContainer>
    );
  }
);

ReactLeafletMap.displayName = 'ReactLeafletMap';

export default memo(ReactLeafletMap);
