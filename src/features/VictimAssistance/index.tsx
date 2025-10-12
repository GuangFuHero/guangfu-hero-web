'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getShelters, getMedicalStations, getMentalHealthResources } from '@/lib/api';
import { Shelter, MedicalStation, MentalHealthResource } from '@/lib/types';
import Button from '@/components/Button';
import InfoCard from '@/components/InfoCard';

type Category = '庇護所' | '醫療站' | '心理資源';
type ServiceFormat = '全部' | '實體' | '線上' | '電話' | '多種';

interface VictimAssistanceProps {
  initialCategory?: Category;
}

export default function VictimAssistance({ initialCategory = '庇護所' }: VictimAssistanceProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedServiceFormat, setSelectedServiceFormat] = useState<ServiceFormat>('全部');
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [medicalStations, setMedicalStations] = useState<MedicalStation[]>([]);
  const [mentalHealthResources, setMentalHealthResources] = useState<MentalHealthResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: Category[] = ['庇護所', '醫療站', '心理資源'];
  const serviceFormats: ServiceFormat[] = ['全部', '實體', '線上', '電話', '多種'];

  const handleCategoryClick = (category: Category) => {
    if (category === '庇護所') {
      router.push('/victim/shelter');
    } else if (category === '醫療站') {
      router.push('/victim/medical');
    } else if (category === '心理資源') {
      router.push('/victim/mental-health');
    } else {
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    if (selectedCategory === '庇護所') {
      fetchShelters();
    } else if (selectedCategory === '醫療站') {
      fetchMedicalStations();
    } else if (selectedCategory === '心理資源') {
      fetchMentalHealthResources();
    } else {
      setLoading(false);
    }
  }, [selectedCategory]);

  async function fetchShelters() {
    try {
      setLoading(true);
      setError(null);
      const response = await getShelters(50, 0);
      setShelters(response.member);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  }

  async function fetchMedicalStations() {
    try {
      setLoading(true);
      setError(null);
      const response = await getMedicalStations(50, 0);
      setMedicalStations(response.member);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  }

  async function fetchMentalHealthResources() {
    try {
      setLoading(true);
      setError(null);
      const response = await getMentalHealthResources(50, 0);
      setMentalHealthResources(response.member);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  }

  const filteredMentalHealthResources =
    selectedServiceFormat === '全部'
      ? mentalHealthResources
      : mentalHealthResources.filter(resource => resource.service_format === selectedServiceFormat);

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {categories.map(category => (
          <Button
            key={category}
            onClick={() => handleCategoryClick(category)}
            active={selectedCategory === category}
          >
            {category}
          </Button>
        ))}
      </div>

      {selectedCategory === '心理資源' && (
        <div className="flex gap-2 mb-3">
          {serviceFormats.map(format => (
            <Button
              key={format}
              onClick={() => setSelectedServiceFormat(format)}
              active={selectedServiceFormat === format}
              variant="sub"
            >
              {format}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {loading && <div className="text-center py-8 text-[var(--gray)]">載入中...</div>}

        {error && <div className="text-center py-8 text-red-500">錯誤: {error}</div>}

        {!loading &&
          !error &&
          selectedCategory === '庇護所' &&
          shelters.map(shelter => (
            <InfoCard
              key={shelter.id}
              name={shelter.name}
              address={shelter.location}
              contact={shelter.phone}
              hours={shelter.opening_hours || ''}
              mapUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                shelter.location
              )}`}
              fullData={shelter}
            />
          ))}

        {!loading && !error && selectedCategory === '醫療站' && (
          <>
            {medicalStations.length === 0 ? (
              <div className="text-center py-8 text-[var(--gray)]">此分類暫無資料</div>
            ) : (
              medicalStations.map(station => (
                <InfoCard
                  key={station.id}
                  name={station.name}
                  type={
                    station.station_type === 'shelter_medical'
                      ? '大型醫療站'
                      : station.station_type === 'self_organized'
                        ? '臨時站點'
                        : station.station_type === 'fixed_point'
                          ? '固定站點'
                          : ''
                  }
                  address={station.location}
                  contact={station.phone}
                  hours={station.operating_hours}
                  mapUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    station.detailed_address || station.location
                  )}`}
                  fullData={station}
                />
              ))
            )}
          </>
        )}

        {!loading && !error && selectedCategory === '心理資源' && (
          <>
            {filteredMentalHealthResources.length === 0 ? (
              <div className="text-center py-8 text-[var(--gray)]">此分類暫無資料</div>
            ) : (
              filteredMentalHealthResources.map(resource => {
                let displayLocation = '';
                let mapLocation = null;

                if (resource.location && resource.location !== 'string') {
                  if (resource.location.startsWith('地點：')) {
                    const extractedLocation = resource.location.replace('地點：', '');
                    displayLocation = extractedLocation;
                    mapLocation = extractedLocation;
                  } else {
                    displayLocation = resource.location;
                    mapLocation = resource.location;
                  }
                }

                return (
                  <InfoCard
                    key={resource.id}
                    name={resource.name}
                    type={resource.service_format}
                    address={displayLocation}
                    contact={resource.contact_info}
                    hours={resource.service_hours}
                    mapUrl={
                      mapLocation
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            mapLocation
                          )}`
                        : undefined
                    }
                    fullData={resource}
                  />
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}
