import StatefulTag from '@/components/StatefulTag';
import Tab from '@/components/Tab';
import { TYPE_MAP } from '@/lib/types/resource';
import { Box, Stack } from '@mui/material';
import React from 'react';

interface FilterPanelProps {
  selectedTag: string;
  onTagChange: (tag: string) => void;
  showMode: 'default' | 'only-pending' | 'only-completed';
  onModeChange: (mode: 'default' | 'only-pending' | 'only-completed') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedTag,
  onTagChange,
  showMode,
  onModeChange,
}) => {
  const typeOptions = Object.keys(TYPE_MAP).map(value => ({
    value,
    label: TYPE_MAP[value as keyof typeof TYPE_MAP].label,
  }));

  const statusOptions: Array<{ value: typeof showMode; label: string }> = [
    { value: 'default', label: '全部' },
    { value: 'only-pending', label: '未配送' },
    { value: 'only-completed', label: '已完成' },
  ];

  const categoryOptions = [{ value: '', label: '全部' }, ...typeOptions];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} mb={2}>
        {statusOptions.map(option => (
          <Tab
            key={option.value}
            active={showMode === option.value}
            onClick={() => onModeChange(option.value)}
          >
            {option.label}
          </Tab>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
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
