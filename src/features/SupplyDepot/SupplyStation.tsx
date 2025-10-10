"use client";
import React from "react";
import { Card, TextField, Typography, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";

const SupplyStation = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section aria-labelledby="station-info" className="space-y-6">
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          物資站資訊
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="名稱"
            placeholder="例：光復里物資站"
            variant="outlined"
            size="small"
            margin="dense"
            required
            {...register("name", {
              required: "請輸入物資站名稱",
            })}
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />
          <TextField
            label="電話"
            placeholder="例：0912345678"
            variant="outlined"
            size="small"
            margin="dense"
            required
            {...register("phone", {
              required: "請輸入電話號碼",
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message as string}
          />
          <TextField
            label="地址"
            placeholder="例：花蓮縣光復鄉…"
            variant="outlined"
            size="small"
            margin="dense"
            required
            {...register("address", {
              required: "請輸入地址",
            })}
            error={!!errors.address}
            helperText={errors.address?.message as string}
          />
          <TextField
            label="備註"
            placeholder="例：可聯繫時間、其他說明"
            variant="outlined"
            size="small"
            margin="dense"
            multiline
            rows={2}
            {...register("notes")}
          />
        </Stack>
      </Card>
    </section>
  );
};

export default SupplyStation;
