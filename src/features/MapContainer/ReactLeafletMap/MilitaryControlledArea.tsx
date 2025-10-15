import { useEffect } from 'react';
import { Polygon, Popup, useMap } from 'react-leaflet';
import { MILITARY_CONTROLLED_AREA } from '../constants';

const MilitaryControlledAreaPane = () => {
  const map = useMap();

  useEffect(() => {
    map.createPane('militaryControlledAreaPane');
    map.getPane('militaryControlledAreaPane')!.style.zIndex = '410';
  }, [map]);

  return null;
};

export default function MilitaryControlledArea() {
  return (
    <>
      <MilitaryControlledAreaPane />
      <Polygon
        positions={MILITARY_CONTROLLED_AREA}
        pathOptions={{
          color: '#dc2626',
          weight: 3,
          opacity: 1,
          fillColor: '#dc2626',
          fillOpacity: 0.15,
          dashArray: '10, 10',
        }}
        pane="militaryControlledAreaPane"
      >
        <Popup>
          <div>
            <h3 className="font-bold text-red-600">⚠️ 軍方接管區域</h3>
            <div className="gap-0 space-y-1">
              <p className="m-0 text-sm font-semibold text-red-700">志工請勿擅自進入</p>
              <p className="m-0 text-sm text-gray-600">此區域已由軍方接管</p>
              <p className="m-0 text-sm text-gray-600">如需進入請先聯繫相關單位</p>
            </div>
          </div>
        </Popup>
      </Polygon>
    </>
  );
}
