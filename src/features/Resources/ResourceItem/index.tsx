'use client';

import ActionButton from '@/components/ActionButton';
import { Supply } from '@/lib/types';
import { Station } from '@/lib/types/resource';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { displayPhone, isCompleted } from '../utils';
import CardHeader from './CardHeader';
import ContactInfo from './ContactInfo';
import Items from './Items';
import StationsInfo from './StationsInfo';

interface ResourceItemProps {
  request: Supply;
  stations: Station[];
  isFulfilledCollapsed: boolean;
  onToggleFulfilled: () => void;
  onDeliveryOpen: (req: Supply) => void;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
  request: req,
  stations,
  isFulfilledCollapsed,
  onToggleFulfilled,
  onDeliveryOpen,
}) => {
  const completed = isCompleted(req);

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 3,
        boxShadow: '0px 2px 10px 0px #0000001A',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <CardHeader name={req.name} createdAt={req.created_at} isCompleted={completed} />

        <Stack px="20px">
          {!completed && <StationsInfo stations={stations} />}

          <ContactInfo
            address={req.address}
            phone={req.phone}
            isPhoneDisplayed={displayPhone(req)}
          />

          <Items
            req={req}
            onToggleFulfilled={onToggleFulfilled}
            isFulfilledCollapsed={isFulfilledCollapsed}
          />
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          position: 'relative',
          justifyContent: completed ? 'flex-start' : 'center',
          p: '16px 20px',
          borderTop: '1px solid var(--gray-3)',
        }}
      >
        {completed ? (
          <Typography
            sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 400, color: 'var(--gray-2)' }}
          >
            如仍有需求，請重新點選新增需求
          </Typography>
        ) : (
          <ActionButton
            variant="secondary"
            className="min-w-[200px]"
            icon={<></>}
            onClick={() => onDeliveryOpen(req)}
          >
            我要配送
          </ActionButton>
        )}
      </CardActions>
    </Card>
  );
};

export default ResourceItem;
