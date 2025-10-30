import { useEffect, useState } from 'react';
import { env } from '@/config/env';

export const useCheckAuth = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const line_oauth_state = JSON.parse(localStorage.getItem('line_oauth_state') ?? '{}');
    const flag = env.IS_USE_NEW_API
      ? !!line_oauth_state['line_user_id']
      : !!line_oauth_state['scope'];

    setAuthed(flag);
    setAuthChecked(true);
  }, []);

  return { authChecked, authed };
};
