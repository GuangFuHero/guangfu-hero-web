import { Station } from '@/lib/types/resource';
import { mapLink, phoneHref } from '@/lib/utils';
import { LocationOn as LocationIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { Link as MuiLink, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import Link from 'next/link';
import { memo } from 'react';

const StationsInfo = ({ stations }: { stations: Station[] }) => {
  const displayedStations = stations.filter(station => !!station?.name && !!station.id);

  return (
    <Stack spacing={2} py="16px" sx={{ borderBottom: '1px dashed var(--gray-3)' }}>
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '20px',
          color: 'var(--black)',
        }}
      >
        物資站資源
      </Typography>

      {displayedStations.length > 0 ? (
        <>
          {displayedStations.map(station => (
            <Stack
              key={station.id}
              sx={{
                p: '12px',
                borderRadius: '12px',
                bgcolor: 'var(--light-gray-background)',
                border: '1px solid var(--gray-3)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '20px',
              }}
            >
              <Typography
                sx={{
                  font: 'inherit',
                  color: 'var(--black)',
                }}
              >
                {station.name}
              </Typography>

              {station.address && (
                <MuiLink
                  component={Link}
                  href={mapLink(station.address)}
                  target="_blank"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                >
                  <LocationIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
                  <Typography
                    sx={{
                      font: 'inherit',
                      fontWeight: 400,
                      color: 'var(--secondary)',
                    }}
                  >
                    {station.address}
                  </Typography>
                </MuiLink>
              )}

              {station.phone && (
                <MuiLink
                  href={phoneHref(station.phone)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
                >
                  <PhoneIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
                  <Typography
                    sx={{
                      font: 'inherit',
                      fontWeight: 400,
                      color: 'var(--secondary)',
                    }}
                  >
                    {station.phone}
                  </Typography>
                </MuiLink>
              )}

              {station.supplies?.length > 0 ? (
                <>
                  {station.supplies.map(supply => (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      key={`${supply.id}-${supply.supply_id}-${supply.total_number}-${supply.received_count}`}
                      spacing={2}
                      sx={{
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '20px',
                        color: 'var(--gray)',
                      }}
                    >
                      <Typography sx={{ font: 'inherit' }}>{supply.name}</Typography>
                      {supply.received_count !== null && supply.received_count !== undefined && (
                        <Typography sx={{ font: 'inherit' }}>
                          {supply.received_count} {supply.unit}
                        </Typography>
                      )}
                    </Stack>
                  ))}
                </>
              ) : null}
            </Stack>
          ))}
        </>
      ) : (
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '20px',
            color: 'var(--gray-2)',
          }}
        >
          尋寶超人正在連線中，馬上幫你找到物資站！
        </Typography>
      )}
    </Stack>
  );
};

export default memo(StationsInfo);
