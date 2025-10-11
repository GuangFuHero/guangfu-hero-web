import {
  useAccommodations,
  useMedicalStations,
  useRestrooms,
  useShowerStations,
  useWaterStations,
} from '@/hooks/useMapData';

export default function Statistics() {
  const accommodationsCount = useAccommodations().data?.length || 0;
  const waterStationsCount = useWaterStations().data?.length || 0;
  const restroomsCount = useRestrooms().data?.length || 0;
  const showerStationsCount = useShowerStations().data?.length || 0;
  const medicalStationsCount = useMedicalStations().data?.length || 0;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3">統計資訊</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">總住宿點：</span>
          <span className="font-semibold">{accommodationsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">總加水站：</span>
          <span className="font-semibold">{waterStationsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">總廁所：</span>
          <span className="font-semibold">{restroomsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">總洗澡點：</span>
          <span className="font-semibold">{showerStationsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">總醫療站：</span>
          <span className="font-semibold">{medicalStationsCount}</span>
        </div>
      </div>
    </div>
  );
}
