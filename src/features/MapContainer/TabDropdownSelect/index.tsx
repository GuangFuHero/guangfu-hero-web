'use client';

import { PLACE_CONFIG } from '@/features/MapContainer/ReactLeafletMap/place.config';
import { useAllPlaces } from '@/hooks/useMapData';
import { PlaceTab } from '@/lib/types/map';
import { PLACE_TYPE_STRING_MAP, PlaceType } from '@/lib/types/place';
import { useTab } from '@/providers/TabProvider';
import { useEffect, useRef, useState } from 'react';

export default function TabDropdownSelect() {
  const { activeTab, setActiveTab } = useTab();
  const { data: places } = useAllPlaces();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAll = activeTab === 'all';

  const getTypeCount = (type: PlaceTab): number => {
    if (!places) return 0;
    if (type === 'all') {
      return Object.values(places).reduce((total, placeArray) => total + placeArray.length, 0);
    }
    return places[type]?.length || 0;
  };

  const dropdownOptions = [
    {
      label: '全部',
      value: 'all' as PlaceTab,
      count: getTypeCount('all'),
      icon: null,
      color: '',
    },
    ...Object.values(PlaceType).map(type => {
      const config = PLACE_CONFIG.find(c => c.type === type);
      return {
        label: PLACE_TYPE_STRING_MAP[type],
        value: type as PlaceTab,
        count: getTypeCount(type),
        icon: config?.icon || null,
        color: config?.color || '#6b7280',
      };
    }),
  ];

  const getSelectedLabel = () => {
    if (activeTab === 'all') {
      return '篩選站點';
    }
    return PLACE_TYPE_STRING_MAP[activeTab as PlaceType];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (value: PlaceTab) => {
    setActiveTab(value);
    setIsOpen(false);
  };

  const leftColumnOptions = dropdownOptions.slice(0, Math.ceil(dropdownOptions.length / 2));
  const rightColumnOptions = dropdownOptions.slice(Math.ceil(dropdownOptions.length / 2));

  return (
    <div className="filter-dropdown-wrapper" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-dropdown-trigger"
        style={{
          backgroundColor: isAll ? 'white' : '#434343',
          color: isAll ? '#3a3937' : 'white',
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.541571 1.6776C2.2249 3.83594 5.33324 7.83594 5.33324 7.83594V12.8359C5.33324 13.2943 5.70824 13.6693 6.16657 13.6693H7.83324C8.29157 13.6693 8.66657 13.2943 8.66657 12.8359V7.83594C8.66657 7.83594 11.7666 3.83594 13.4499 1.6776C13.8749 1.1276 13.4832 0.335938 12.7916 0.335938H1.1999C0.508238 0.335938 0.116571 1.1276 0.541571 1.6776Z"
            fill={isAll ? '#434343' : 'white'}
          />
        </svg>
        <span className="filter-trigger-text">{getSelectedLabel()}</span>
      </button>

      {isOpen && (
        <div className="filter-dropdown-menu">
          <div className="filter-options-grid">
            <div className="filter-options-column">
              {leftColumnOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`filter-option ${activeTab === option.value ? 'active' : ''}`}
                >
                  <div className="filter-option-content">
                    <div className="filter-option-indicator">
                      {option.icon ? (
                        <div
                          className="filter-option-icon"
                          style={{ backgroundColor: option.color }}
                        >
                          {option.icon()}
                        </div>
                      ) : (
                        <div
                          className="filter-option-dot"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                    </div>
                    <span className="filter-option-label">{option.label}</span>
                    <span className="filter-option-count">({option.count})</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="filter-options-column filter-options-column-right">
              {rightColumnOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`filter-option ${activeTab === option.value ? 'active' : ''}`}
                >
                  <div className="filter-option-content">
                    <div className="filter-option-indicator">
                      {option.icon ? (
                        <div
                          className="filter-option-icon"
                          style={{ backgroundColor: option.color }}
                        >
                          {option.icon()}
                        </div>
                      ) : (
                        <div
                          className="filter-option-dot"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                    </div>
                    <span className="filter-option-label">{option.label}</span>
                    <span className="filter-option-count">({option.count})</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="filter-options-single-column">
              {dropdownOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`filter-option ${activeTab === option.value ? 'active' : ''}`}
                >
                  <div className="filter-option-content">
                    <div className="filter-option-indicator">
                      {option.icon ? (
                        <div
                          className="filter-option-icon"
                          style={{ backgroundColor: option.color }}
                        >
                          {option.icon()}
                        </div>
                      ) : (
                        <div
                          className="filter-option-dot"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                    </div>
                    <span className="filter-option-label">{option.label}</span>
                    <span className="filter-option-count">({option.count})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
