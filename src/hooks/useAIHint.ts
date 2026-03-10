import { useState, useRef, useCallback } from 'react';
import { requirementApi } from '../services/api';

export function useAIHint() {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInputRef = useRef('');

  const requestHint = useCallback((fieldLabel: string, userInput: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHint(null);
    if (!userInput || userInput.length < 15) return;

    timerRef.current = setTimeout(async () => {
      if (userInput === lastInputRef.current) return;
      lastInputRef.current = userInput;
      setLoading(true);
      try {
        const h = await requirementApi.getHint(fieldLabel, userInput);
        setHint(h);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }, 1800);
  }, []);

  const clearHint = useCallback(() => {
    setHint(null);
    lastInputRef.current = '';
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { hint, loading, requestHint, clearHint };
}
