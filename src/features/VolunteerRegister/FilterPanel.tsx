import StatefulTag from '@/components/StatefulTag';
import Tab from '@/components/Tab';
import { Box, Stack } from '@mui/material';
import React from 'react';

interface FilterPanelProps {
  selectedTag: string;
  onTagChange: (tag: string) => void;
  showMode: 'active' | 'completed';
  onModeChange: (mode: 'active' | 'completed') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedTag,
  onTagChange,
  showMode,
  onModeChange,
}) => {
  const statusOptions: Array<{ value: typeof showMode; label: string }> = [
    { value: 'active', label: '未配送' },
    { value: 'completed', label: '已完成' },
  ];

  const categoryOptions = [
    { value: '', label: '所有需求' },
    { value: '鏟子超人,鏟', label: '鏟子超人' },
    { value: '清溝超人,溝', label: '清溝超人' },
    { value: '搬物超人,搬,拖,運', label: '搬物超人' },
    { value: '廚師超人,廚師,煮', label: '廚師超人' },
    { value: '整理超人,整理', label: '整理超人' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} mb={2}>
        {statusOptions.map(option => (
          <Tab
            key={option.value}
            active={showMode === option.value}
            onClick={() => onModeChange(option.value)}
            className="text-[20px] leading-[25px] font-weight-500"
          >
            {option.label}
          </Tab>
        ))}
      </Stack>

      <Stack direction="row" spacing="4px" flexWrap="wrap">
        {categoryOptions.map(option => (
          <StatefulTag
            key={option.value}
            active={selectedTag === option.value}
            onClick={() => onTagChange(option.value)}
          >
            <Stack
              direction="row"
              sx={{ font: 'inherit' }}
              alignItems="center"
              justifyContent="space-between"
              gap={1}
            >
              {selectedTag === option.value ? (
                <svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.72667 7.05333L0.946666 4.27333L0 5.21333L3.72667 8.94L11.7267 0.94L10.7867 0L3.72667 7.05333Z"
                    fill="white"
                  />
                </svg>
              ) : null}
              {option.label}
            </Stack>
          </StatefulTag>
        ))}
      </Stack>
    </Box>
  );
};

export default FilterPanel;
