import { env } from '@/config/env';

export const handleGoBack = () => {
  if (history.length > 1) {
    window.history.back();
    return;
  }
  if (env.NEXT_PUBLIC_BASE_URL) {
    window.location.href = env.NEXT_PUBLIC_BASE_URL;
    return;
  }
};
