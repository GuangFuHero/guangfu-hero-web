'use client';

import { useAllPlaces } from '@/hooks/useMapData';
import { UserPosition } from '@/lib/types/map';

import { Place, PlaceType } from '@/lib/types/place';
import { useTab } from '@/providers/TabProvider';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { MAP_START_POSITION_INFO } from '../constants';
import GuangFuStationMarker from './GuangFuStationMarker';
import { userLocationIcon } from './Icons';
import MilitaryControlledArea from './MilitaryControlledArea';
import PlaceComponent from './PlaceComponent';

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

const ZoomControl = () => {
  const map = useMap();

  useEffect(() => {
    const zoomControl = L.control.zoom({ position: 'bottomleft' });
    map.addControl(zoomControl);

    return () => {
      map.removeControl(zoomControl);
    };
  }, [map]);

  return null;
};

interface ReactLeafletMapProps {
  onSidebarClose: () => void;
  userPosition: UserPosition | null;
  isFullScreenMap?: boolean;
}

const ReactLeafletMapContent = forwardRef<LeafletMapRef, ReactLeafletMapProps>(
  ({ onSidebarClose, userPosition }, ref) => {
    const { activeTab } = useTab();
    const map = useMap();
    const places: Record<PlaceType | string, Place[]> | undefined = useAllPlaces().data;

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
      return activeTab === 'all' || activeTab === layerType;
    };

    const placesData = useMemo(() => Object.values(places || {}).flat(), [places]);

    return (
      <>
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl />
        <MapEvents onSidebarClose={onSidebarClose} />

        <GuangFuStationMarker />
        <MilitaryControlledArea />

        {userPosition && (
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

        {placesData.map(place => (
          <PlaceComponent key={place.id} place={place} isVisible={isLayerVisible(place.type)} />
        ))}
      </>
    );
  }
);

ReactLeafletMapContent.displayName = 'ReactLeafletMapContent';

const ReactLeafletMap = forwardRef<LeafletMapRef, ReactLeafletMapProps>(
  ({ onSidebarClose, userPosition, isFullScreenMap = true }, ref) => {
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
          // header:64 + alert:(64 + 22) + tab:54 + padding-top: 12 = 216px
          height: isFullScreenMap ? '100svh' : 'calc(100svh - 216px)',
          width: '100svw',
        }}
        zoomControl={false}
        attributionControl={false}
        whenReady={() => setMapReady(true)}
      >
        {mapReady && (
          <ReactLeafletMapContent
            ref={ref}
            onSidebarClose={onSidebarClose}
            userPosition={userPosition}
          />
        )}
      </MapContainer>
    );
  }
);

ReactLeafletMap.displayName = 'ReactLeafletMap';

export default memo(ReactLeafletMap);
