import { useState, useEffect } from 'react';
import { Service, ServiceStatus } from '../types/service';

export function useServiceStatus(service: Service) {
  const [status, setStatus] = useState<ServiceStatus>('checking');

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | undefined;
    let controller: AbortController | null = null;
    let timeoutId: number | undefined;

    const cleanupOngoing = () => {
      if (controller) {
        controller.abort();
        controller = null;
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const checkStatus = async () => {
      try {
        if (!isMounted) return;
        setStatus('checking');

        controller = new AbortController();
        const signal = controller.signal;
        timeoutId = setTimeout(() => controller?.abort(), 5000) as unknown as number;

        await fetch(service.url, {
          method: 'HEAD',
          mode: 'no-cors',
          signal,
        });

        if (!isMounted) return;
        setStatus('online');
      } catch (_err) {
        if (!isMounted) return;
        setStatus('offline');
      } finally {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }
      }
    };

    checkStatus();
    intervalId = setInterval(checkStatus, 30000) as unknown as number;

    return () => {
      isMounted = false;
      if (intervalId !== undefined) clearInterval(intervalId);
      cleanupOngoing();
    };
  }, [service.url]);

  return status;
}
