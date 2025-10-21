'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Stack,
  TextField,
  Grid,
  ToggleButton,
  Chip,
  CircularProgress,
  Box,
} from '@mui/material';
import { NormalizedSupplyItem } from '@/features/SupplyDepot/useFetchAllData';
import { useFormContext } from 'react-hook-form';
import { ReportedSupplies } from '@/lib/supplyLocalStorage';
import { env } from '@/config/env';

interface SupplyRequirementListProps {
  supplies?: NormalizedSupplyItem[];
  reportedSupplies?: ReportedSupplies;
  loadingMore?: boolean;
  hasMore?: boolean;
  fetchNextBatch?: () => void;
}

const SupplyRequirementList = ({
  supplies,
  reportedSupplies = {},
  loadingMore = false,
  hasMore = false,
  fetchNextBatch,
}: SupplyRequirementListProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-select when quantity is entered
  const handleQuantityChange = (id: string, value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedItems(prev => ({ ...prev, [id]: true }));
    } else if (!numValue || numValue <= 0) {
      setSelectedItems(prev => ({ ...prev, [id]: false }));
    }
  };

  // Expose selectedItems to parent via form context
  useEffect(() => {
    // Store selected items in a hidden field so parent can access
    document.dispatchEvent(
      new CustomEvent('selectedItemsChange', {
        detail: selectedItems,
      })
    );
  }, [selectedItems]);

  // Listen for clear event from parent
  useEffect(() => {
    const handleClearSelectedItems = () => {
      setSelectedItems({});
    };
    document.addEventListener('clearSelectedItems', handleClearSelectedItems);
    return () => {
      document.removeEventListener('clearSelectedItems', handleClearSelectedItems);
    };
  }, []);

  // Infinite scroll: detect when scrolled near bottom
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !fetchNextBatch) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // Trigger when scrolled to within 100px of bottom
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom && hasMore && !loadingMore) {
        fetchNextBatch();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loadingMore, fetchNextBatch]);
  return (
    <section aria-labelledby="station-info" className="space-y-6">
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          目前需求列表，請填寫物資站可提供數量
        </Typography>
        <Stack spacing={0} sx={{ maxHeight: '80dvh', overflow: 'auto' }}>
          <Grid container spacing={1}>
            {/* <Grid size={1}></Grid> */}
            <Grid size={9}>
              <Typography textAlign="center">需求 (已送/需求)</Typography>
            </Grid>
            <Grid size={3}>
              <Typography textAlign="center">可提供</Typography>
            </Grid>
          </Grid>
          <Stack spacing={1} sx={{ maxHeight: '70dvh', overflow: 'auto' }} ref={scrollContainerRef}>
            {supplies?.map(
              (
                {
                  id,
                  name,
                  total_number,
                  total_count,
                  received_count,
                  recieved_count,
                  unit,
                  requestor,
                },
                idx
              ) => {
                const isReported = !!reportedSupplies[id];
                const fieldError = errors[`quantity_${id}`];
                return (
                  <Grid container spacing={1} key={idx}>
                    <Grid size={9}>
                      <ToggleButton
                        value="check"
                        selected={selectedItems?.[id] || false}
                        color="success"
                        fullWidth
                        size="small"
                        sx={{ fontSize: 14 }}
                      >
                        <Stack alignItems="center">
                          <Typography fontSize={12} textAlign="center">
                            {requestor}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {isReported && (
                              <Chip
                                label="已回報"
                                color="success"
                                size="small"
                                sx={{ fontSize: 10, mr: 2 }}
                              />
                            )}
                            <Typography textAlign="center" color="black" fontWeight={600}>
                              {name} {env.IS_USE_NEW_API ? received_count : recieved_count}/
                              {env.IS_USE_NEW_API ? total_number : total_count} {unit}
                            </Typography>
                          </Stack>
                        </Stack>
                      </ToggleButton>
                    </Grid>
                    <Grid size={3} alignItems="center" display="flex">
                      <TextField
                        placeholder="數量"
                        variant="outlined"
                        type="number"
                        {...register(`quantity_${id}`, {
                          valueAsNumber: true,
                          validate: value => {
                            // Validate that quantity must be greater than 0
                            if (value && value <= 0) {
                              return '數量必須大於 0';
                            }
                            return true;
                          },
                          onChange: e => {
                            handleQuantityChange(id, e.target.value);
                          },
                        })}
                        error={!!fieldError}
                        slotProps={{
                          htmlInput: { min: 0, step: 1, inputMode: 'numeric' },
                        }}
                      />
                    </Grid>
                    {fieldError && (
                      <Grid size={12}>
                        <Typography fontSize={12} color="error" textAlign="end">
                          {fieldError?.message as string}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                );
              }
            )}
            {loadingMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {!hasMore && supplies && supplies.length > 0 && (
              <Typography
                variant="caption"
                sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}
              >
                已載入全部資料
              </Typography>
            )}
          </Stack>
        </Stack>
      </Card>
    </section>
  );
};

export default SupplyRequirementList;
