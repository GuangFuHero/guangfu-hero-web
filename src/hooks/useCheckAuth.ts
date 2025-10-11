import { useEffect, useState } from 'react';

export const useCheckAuth = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const flag = !!localStorage.getItem('line_oauth_state');
    setAuthed(flag);
    setAuthChecked(true);
  }, []);

  return { authChecked, authed };
};
