import { divIcon } from 'leaflet';

const createCustomIcon = (html: string, size: [number, number] = [25, 25]) =>
  divIcon({
    className: 'custom-marker',
    html,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
  });

export const userLocationIcon = createCustomIcon(
  `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍</div>`,
  [20, 20]
);

export const stationIcon = createCustomIcon(
  `<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🚂</div>`,
  [30, 30]
);

export const getTabIcon = (icon: string, color: string) =>
  createCustomIcon(
    `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${icon}</div>`
  );
